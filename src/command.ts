import fs from "fs"
import chalk from 'chalk';
import shelljs from 'shelljs';
import { errorLine } from './utils';


export class Command {
  os = process.platform
  isAdbInstalled: boolean

  constructor() {
    //this.isAdbInstalled = !(!shelljs.which('adb'))
    if (!shelljs.which('adb')) {
      this.isAdbInstalled = false
    } else {
      this.isAdbInstalled = true
    }
  }

  public async buildProject(sdkPath: string): Promise<boolean> {
    return new Promise(async resolve => {
      const isAndroidProject = shelljs.find(["gradlew", "gradlew.bat"]).length > 0
      if (isAndroidProject) {
        const isContainLocalProp = shelljs.find('local.properties').length > 0
        if (!isContainLocalProp && sdkPath != undefined) {
          console.log(chalk.green('Setting up local.properties'))
          const writeLocalProp = await this.writeLocalProp(sdkPath)
          if (writeLocalProp) {
            resolve(await this.buildProject(sdkPath))
          }
        } else if (isContainLocalProp) {
          shelljs.exec(`${this.gradlew()} build`)
          resolve(true)
        } else {
          errorLine(`local.properties not found, please add flag "--sdk 'your-sdk-folder'"`)
          resolve(false)
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

        const sdkString = `sdk.dir=${sdkValue}`
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
        const sepackRunExist = shelljs.find('build/sepack_run.sh').length > 0
        if (!resume) {
          shelljs.exec(`${this.gradlew()} assembleDebug`)
          shelljs.exec(`${this.gradlew()} installDebug`)
        }

        if (sepackRunExist) {
          shelljs.rm('build/sepack_run.sh')
        }

        const script = `
    pkg=${packageName}
    comp=$(adb shell cmd package resolve-activity --brief -c android.intent.category.LAUNCHER $pkg | tail -1)
    adb shell cmd activity start-activity $comp
          `
        shelljs.touch('build/sepack_run.sh')
        shelljs.sed("-i", "", script, 'build/sepack_run.sh')
        shelljs.exec("chmod +rx build/sepack_run.sh")
        shelljs.exec('build/sepack_run.sh')
        resolve(true)
      })
    } else {
      errorLine("Adb not installed!")
      return false
    }
  }

  public log(tag: string, level: string) {
    if (this.isAdbInstalled) {
      const sepackLogExist = shelljs.find('build/sepack_run.sh').length > 0
      if (sepackLogExist) {
        shelljs.rm('build/sepack_log.sh')
      }

      const rawData = fs.readFileSync('sepack_config.json')
      const packageName = JSON.parse(rawData.toString()).package_name

      const script = `adb logcat '${tag}:${level}' -v color --pid=\`adb shell pidof -s ${packageName}\``
      console.log(script)
      setTimeout(() => {
        shelljs.touch('build/sepack_log.sh')
        shelljs.sed("-i", "", script, 'build/sepack_log.sh')
        shelljs.exec("clear")
        shelljs.exec("chmod +rx build/sepack_log.sh")
        shelljs.exec('build/sepack_log.sh', { async: true })
      }, 1000)
    } else {
      errorLine("Adb not installed!")
    }
  }

}