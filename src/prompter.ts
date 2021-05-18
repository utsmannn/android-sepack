import shelljs from 'shelljs'
import { SepackConfig, PackageSetup, Dependencies } from './model'
import chalk from "chalk"
import { searchDependencies } from './network'
import ora from "ora"
import { Cloner } from './cloner'
import { errorLine, folderNameOf, outLog } from './utils'
import inquirer from 'inquirer'

export class Prompter {
  sepackConfig: SepackConfig
  depsResult = []
  setup: PackageSetup

  constructor(sepackConfig: SepackConfig) {
    this.sepackConfig = sepackConfig
  }

  async startPromter() {
    try {
      this.setup = await this.packageSetup()
      const isConfigOk = await this.dependenciesConfig('Add extras dependencies?')
      if (isConfigOk) {
        this.setup.dependencies = this.depsResult
        const cloner = new Cloner(this.setup)
        const isSuccess = await cloner.startClone()
        if (isSuccess) {
          await this.openProject()
        } else {
          errorLine(`Failed!`)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  private async dependenciesConfig(message: string): Promise<boolean> {
    const addExtras = await this.addExtras(message)
    if (addExtras) {
      const deps = await this.addDeps()
      const depsName = deps.map(dep => {
        return `${dep.group}:${dep.artifact}:${dep.version}`
      })

      const form = await inquirer.prompt({
        type: 'checkbox',
        name: 'dependencies',
        message: 'Select dependencies (allow multiple):',
        choices: depsName,
      })

      const dependencies = form.dependencies as string[]
      dependencies.forEach(dep => {
        this.depsResult.push(dep)
      })

      return await this.dependenciesConfig('Add extras dependencies again?')
    } else {
      this.setup.dependencies = this.depsResult
      return await this.confirm()
    }
  }

  private async packageSetup(): Promise<PackageSetup> {
    const templateList = this.sepackConfig.templates
    const templateName = templateList.map((item) => {
      if (item.url == "separator") {
        return new inquirer.Separator(item.name)
      } else {
        return item.name
      }
    })

    const form = await inquirer.prompt([
      {
        type: 'input',
        name: 'project_name',
        message: 'What is your project name?',
        default: 'Awesome app',
        validate: (value) => {
          return value.length > 2 && this.allowed(value, false)
        }
      },
      {
        type: 'input',
        name: 'package_name',
        message: 'What is your package name?',
        default: 'com.awesome.app',
        validate: (value) => {
          return value.length > 2 && this.allowed(value, true)
        }
      },
      {
        type: 'rawlist',
        name: 'template',
        message: 'Select your template:',
        loop: false,
        choices: templateName,
        default: templateName[0]
      }
    ])

    const templateSelected = form.template as string
    const template = templateList.find(item => templateSelected.includes(item.name))
    return new PackageSetup(form["project_name"], form["package_name"], template)
  }

  private async addExtras(message: string): Promise<boolean> {
    var defaultConfirm: boolean = true
    if (message.includes('again')) {
      defaultConfirm = false
    }
    const form = await inquirer.prompt({
      type: 'confirm',
      name: 'add_deps',
      message: message,
      default: defaultConfirm
    })
    const data = form.add_deps as boolean
    return data
  }

  private async addDeps(): Promise<Dependencies[]> {
    const formInput = await inquirer.prompt({
      type: 'input',
      name: 'deps',
      message: 'Search dependencies:',
      validate: (value) => {
        return value.length > 1
      }
    })

    const query = formInput["deps"] as string

    const spinnerBar = ora(chalk.green(`Search ${query}`))
    spinnerBar.color = "white"
    spinnerBar.start()

    try {
      const deps = await searchDependencies(query)
      spinnerBar.stop()

      if (deps.length == 0) {
        errorLine('Please correct dependencies!')
        return await this.addDeps()
      } else {
        return deps
      }

    } catch (error) {
      spinnerBar.stop()
      errorLine('Please correct dependencies!')
      return await this.addDeps()
    }
  }

  private async confirm(): Promise<boolean> {
    const projectName = this.setup.projectName
    const packageName = this.setup.packageName
    const template = this.setup.template.name
    const deps = this.setup.dependencies
    const folder = "/" + folderNameOf(projectName)
    const pwd = shelljs.pwd() + folder

    var confirmText = `

      Project name        : ${projectName}
      Package name        : ${packageName}
      Template            : ${template}
      Location            : ${folder}
      Path                : ${pwd}
    
    `

    if (deps.length > 0) {
      const depsExtra = `${deps.map((item) => {
        return `- ${item}\n                           `
      })}`.split(",").join(" ")

      confirmText = `

      Project name        : ${projectName}
      Package name        : ${packageName}
      Template            : ${template}
      Location            : ${folder}
      Path                : ${pwd}
      Extra dependencies  : ${depsExtra}

    `
    }

    outLog('Confirm', confirmText)
    const form = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: 'This project ok?'

    })
    const valid = form.confirm as boolean
    return valid
  }

  private async openProject() {
    const listOpen = ["Android Studio", "VSCode", "Nothing else"]
    const form = await inquirer.prompt({
      type: "rawlist",
      name: "open",
      message: "Open project?",
      choices: listOpen,
      default: listOpen[0],
    })

    const opener = new Opener()

    const selected = form.open as string
    switch (selected) {
      case "Android Studio":
        opener.openStudio()
        break;
      case "VSCode":
        opener.openVsCode()
        break;
      default:
        opener.openFolder()
        break;
    }
  }

  private allowed(string: string, dot: boolean): boolean {
    var allowingChar: string
    if (dot) {
      allowingChar = "abcdefghijklmnopqrstuvwxyz."
    } else {
      allowingChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz "
    }
    const stringList = string.split("")
    const filtering = stringList.map((char: string) => {
      const included = allowingChar.includes(char)
      return included
    })

    const dotNotAllowed = stringList[0] === "." || stringList[stringList.length - 1] === "."
    const valid = !filtering.includes(false)
    return valid && !dotNotAllowed
  }
}


class Opener {

  os = process.platform
  constructor() {
  }

  openStudio() {
    const macCommand = "open -a /Applications/Android\\ Studio.app . "

    switch (this.os) {
      case "darwin":
        shelljs.exec(macCommand)
        break
      default:
        console.log("Your os not able to open project")
        break
    }
  }

  openFolder() {
    const macCommand = "open ."
    const winCommand = "start ."

    switch (this.os) {
      case "darwin":
        shelljs.exec(macCommand)
        break
      case "win32":
        shelljs.exec(winCommand)
        break
      default:
        console.log("Your os not able to open project")
        break
    }
  }

  openVsCode() {
    const codeCommand = "code ."

    switch (this.os) {
      case "darwin":
        shelljs.exec(codeCommand)
        break
      case "win32":
        shelljs.exec(codeCommand)
        break
      default:
        console.log("Your os not able to open project")
        break
    }
  }
}