import fs from "fs"
import shelljs from 'shelljs'
import { errorLine, outLog, sdkPath, slash } from './utils'
import osSys from 'os'

export class Command {
  os = process.platform
  isAdbInstalled: boolean

  constructor() {
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

  public async buildProject(sdk: string): Promise<boolean> {
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
              resolve(await this.buildProject(sdkFixer))
            }
          } else if (isContainLocalProp) {
            shelljs.exec(`${this.gradlew()} build`)
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

  public async runApp(resume: boolean): Promise<boolean> {
    if (this.isAdbInstalled) {
      return new Promise(resolve => {
        const rawData = fs.readFileSync('sepack_config.json')
        const packageName = JSON.parse(rawData.toString()).package_name
        if (!resume) {
          shelljs.exec(`${this.gradlew()} assembleDebug`)
          shelljs.exec(`${this.gradlew()} installDebug`)
        }

        shelljs.exec(` adb shell cmd package resolve-activity --brief -c android.intent.category.LAUNCHER ${packageName}`, { silent: true }, (data, stderr, stdout) => {
          const launcher = stderr.split("\n")[1]
          shelljs.exec(`adb shell cmd activity start-activity ${launcher}`)
          resolve(true)
        })
      })
    } else {
      errorLine("Adb not installed!")
      return false
    }
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

}