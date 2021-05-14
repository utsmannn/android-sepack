import { SepackConfig, VersionApi, PackageSetup, Dependencies } from './model';
import { prompt } from "enquirer";
import chalk from "chalk";
import { searchDependencies } from './network';
import ora from "ora"
import { Cloner } from './cloner'

export class Prompter {
  sepackConfig: SepackConfig
  depsResult = []
  setup: PackageSetup

  constructor(sepackConfig: SepackConfig) {
    this.sepackConfig = sepackConfig
  }

  async startPromter() {
    this.setup = await this.packageSetup()
    try {
      await this.dependenciesConfig('Add extras dependencies?');
    } catch (error) {
      console.log(error)
    }
  }

  private async dependenciesConfig(message: string) {
    const addExtras = await this.addExtras(message);
    if (addExtras) {
      const deps = await this.addDeps();
      const depsName = deps.map(dep => {
        return `${dep.group}:${dep.artifact}:${dep.version}`
      });

      const form = await prompt({
        type: 'multiselect',
        name: 'dependencies',
        message: 'Select dependencies (allow multiple):',
        choices: depsName,
      });

      const dependencies = form["dependencies"] as string[]
      dependencies.forEach(dep => {
        this.depsResult.push(dep)
      })

      this.dependenciesConfig('Add extras dependencies again?')
    } else {
      this.confirm()
    }
  }

  private async packageSetup(): Promise<PackageSetup> {
    const templateList = this.sepackConfig.templates
    const templateName = templateList.filter(item => {
      return item.branch != ""
    }).map((item, index) => {
      return `(${index + 1}) ${item.name}`
    })
    const form = await prompt([
      {
        type: 'input',
        name: 'project_name',
        message: 'What is your project name?',
        validate: (value) => {
          return value.length > 2 && this.allowed(value, false)
        }
      },
      {
        type: 'input',
        name: 'package_name',
        message: 'What is your package name?',
        validate: (value) => {
          return value.length > 2 && this.allowed(value, true)
        }
      },
      {
        type: 'autocomplete',
        name: 'template',
        message: 'Select template:',
        choices: templateName,
      }
    ])

    const templateSelected = form["template"] as string
    const template = templateList.find(item => templateSelected.includes(item.name))
    return new PackageSetup(form["project_name"], form["package_name"], template)
  }

  private async addExtras(message: string): Promise<boolean> {
    const form = await prompt({
      type: 'confirm',
      name: 'add_deps',
      message: message
    })
    const data = form["add_deps"] as boolean
    return data
  }

  private async addDeps(): Promise<Dependencies[]> {
    const formInput = await prompt({
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

    const deps = await searchDependencies(query)
    spinnerBar.stop()
    return deps
  }

  private async confirm() {
    this.setup.dependencies = this.depsResult
    const cloner = new Cloner(this.setup)
    const isSuccess = await cloner.startClone()
    console.log(`okee -> ${isSuccess}`)
  }

  private allowed(string: string, dot: boolean): boolean {
    var allowingChar: string | string[]
    if (dot) {
      allowingChar = "abcdefghijklmnopqrstuvwxyz."
    } else {
      allowingChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz "
    }
    const stringList = string.split("")
    const filtering = stringList.map((char: string) => {
      const included = allowingChar.includes(char)
      return included;
    });

    const dotNotAllowed =
      stringList[0] === "." || stringList[stringList.length - 1] === "."
    const valid = !filtering.includes(false)
    return valid && !dotNotAllowed;
  }
}
