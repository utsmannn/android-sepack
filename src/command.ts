import fs from "fs"
import shelljs from 'shelljs'
import { errorLine, outLog, sdkPath, slash } from './utils'
import ora from "ora"

export class Command {
  os = process.platform
  isAdbInstalled: boolean
  private spinnerBar: ora.Ora

  constructor() {
    this.spinnerBar = ora()
    this.spinnerBar.color = 'white'

    if (!shelljs.which('adb')) {
      this.isAdbInstalled = false
    } else {
      this.isAdbInstalled = true
    }
  }

  private isSdkValid(path: string): boolean {
    const sdkValid = shelljs.ls(path).toString()
    return sdkValid.includes('build-tools')
  }

  public async buildProject(sdk: string, isShowLog: boolean): Promise<boolean> {
    const sdkFixer = sdk ?? await sdkPath()

    return new Promise(async resolve => {
      const isAndroidProject = shelljs.find(["gradlew", "gradlew.bat"]).length > 0
      if (isAndroidProject) {
        const isContainLocalProp = shelljs.find('local.properties').length > 0
        if (!this.isSdkValid(sdkFixer)) {
          errorLine(`Sdk folder invalid, please add flag "--sdk 'your-sdk-folder'"`)
          resolve(false)
        } else {
          if (!isContainLocalProp) {
            outLog('Build', 'Setting up local.properties')
            const writeLocalProp = await this.writeLocalProp(sdkFixer)
            if (writeLocalProp) {
              resolve(await this.buildProject(sdkFixer, isShowLog))
            }
          } else if (isContainLocalProp) {
            // start build !
            outLog('Build', 'Start build project')

            if (!isShowLog) {
              this.spinnerBar.text = 'Building project...'
              this.spinnerBar.start()
            }

            shelljs.exec(`${this.gradlew()} build`, { silent: !isShowLog }, (code, stdout, stderr) => {
              if (!isShowLog) {
                this.spinnerBar.stop()
                outLog('Build', 'Done')

                if (stderr.includes('BUILD FAILED')) {
                  errorLine(stderr)
                }
              }
            })
            resolve(true)
          } else {
            errorLine(`local.properties not found, please add flag "--sdk 'your-sdk-folder'"`)
            resolve(false)
          }
        }
      } else {
        errorLine('This folder is invalid android project!')
        resolve(false)
      }
    })
  }

  private async writeLocalProp(sdkValue: string): Promise<boolean> {
    return new Promise(resolve => {
      const isValid = shelljs.find(sdkValue).length > 0
      if (isValid) {

        const sdkString = `sdk.dir=${slash(sdkValue)}`
        shelljs.touch('local.properties')
        shelljs.sed('-i', "", sdkString, 'local.properties')

        resolve(true)
      } else {
        errorLine(`'${sdkValue}' is not valid sdk folder!`)
      }
    })
  }

  private gradlew(): string {
    switch (this.os) {
      case "win32":
        return "gradlew.bat"
      default:
        return "./gradlew"
    }
  }

  public async runApp(resume: boolean, isShowLog: boolean): Promise<boolean> {
    if (this.isAdbInstalled) {
      return new Promise(resolve => {
        const sepackConfigJson = 'sepack_config.json'
        const isConfigExist = shelljs.find(sepackConfigJson).length > 0
        if (isConfigExist) {
          const rawData = fs.readFileSync(sepackConfigJson)
          const packageName = JSON.parse(rawData.toString()).package_name
          if (!isShowLog) {
            this.spinnerBar.text = 'Building project...'
            this.spinnerBar.start()
          }

          if (!resume) {
            shelljs.exec(`${this.gradlew()} assembleDebug`, { silent: !isShowLog }, (code, stdout, stderr) => {
              if (stderr.includes('FAILED')) {
                this.spinnerBar.stop()
                errorLine(stderr)
                
              } else {
                this.spinnerBar.text = 'Install application'
                shelljs.exec(`${this.gradlew()} installDebug`, { silent: !isShowLog }, (code, stdout, stderr) => {
                  if (stderr.includes('FAILED')) {
                    this.spinnerBar.stop()
                    errorLine(stderr)
                    resolve(false)
                  } else {
                    this.launchingApp(packageName, isShowLog, resolve)
                  }
                })
              }
            })
          } else {
            this.launchingApp(packageName, isShowLog, resolve)
          }

        } else {
          errorLine(`${sepackConfigJson} not found! Please run 'sepack init' for turn on sepack android project`)
        }
      })
    } else {
      errorLine("Adb not installed!")
      return false
    }
  }

  private launchingApp(packageName: any, silent: boolean, resolve: (value: boolean | PromiseLike<boolean>) => void) {
    this.spinnerBar.text = 'Start build project'
    shelljs.exec(`adb shell cmd package resolve-activity --brief -c android.intent.category.LAUNCHER ${packageName}`, { silent: !silent }, (data, stderr, stdout) => {
      const launcher = stderr.split("\n")[1]
      this.spinnerBar.stop()

      outLog('Run', 'Launcing app')
      shelljs.exec(`adb shell cmd activity start-activity ${launcher}`, { silent: !silent })
      resolve(true)
    })
  }

  public log(tag: string, level: string) {
    if (this.isAdbInstalled) {

      const rawData = fs.readFileSync('sepack_config.json')
      const packageName = JSON.parse(rawData.toString()).package_name

      process.on('SIGINT', () => {
        shelljs.exec(`adb shell am force-stop ${packageName}`)
      })

      setTimeout(() => {
        const pid = shelljs.exec(`adb shell pidof -s ${packageName}`)
        shelljs.exec(`adb logcat '${tag}:${level}' -v color --pid=${pid}`)
      }, 2000)
    } else {
      errorLine("Adb not installed!")
    }
  }

  public async init(): Promise<boolean> {
    return new Promise(async resolve => {
      const pkgName = await this.searchPkgName()
      const appName = await this.searchAppName()

      const json = `
{
    "project_name": "${appName}",
    "package_name": "${pkgName}"
}
              `

      const file = "sepack_config.json"
      shelljs.touch(file)
      shelljs.sed("-i", "", json, file)

      resolve(true)
    })
  }

  private async searchPkgName(): Promise<string> {
    return new Promise(resolve => {
      const appBuildGradle = slash('app/build.gradle')
      const isAppBuildGradleisExist = shelljs.find(appBuildGradle).length > 0
      if (isAppBuildGradleisExist) {
        const text = shelljs.grep('-i', 'applicationId', appBuildGradle).stdout
          .replace('\n', '')
          .replace('"', '')
          .replace(`"`, '')
          .replace('applicationId', '')
          .trim()

        resolve(text)
      } else {
        errorLine(slash('app/app.gradle not found'))
      }
    })
  }

  private async searchAppName(): Promise<string> {
    return new Promise(resolve => {
      const appSettingGradle = 'settings.gradle'
      const isAppSettingGradleisExist = shelljs.find(appSettingGradle).length > 0
      if (isAppSettingGradleisExist) {
        const text = shelljs.grep('-i', 'rootProject.name', appSettingGradle).stdout
          .replace('\n', '')
          .replace('"', '')
          .replace(`"`, '')
          .replace('=', '')
          .replace('rootProject.name', '')
          .trim()

        resolve(text)
      } else {
        errorLine(slash('settings.gradle not found'))
      }
    })
  }

}