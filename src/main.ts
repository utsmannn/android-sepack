import { Prompter } from './prompter'
import shelljs from "shelljs"
import chalk from "chalk"
import { SepackConfig, VersionApi } from "./model"
import { errorLine, welcomeMessage } from "./utils"
import ora from "ora"
import { getApiVersion } from './network'
import { appVersion } from './constant'
import boxen from 'boxen'

export class Main {
    constructor() { }

    async start() {
        shelljs.exec("clear")
        welcomeMessage()

        if (!shelljs.which("git")) {
            errorLine("Error:  git not installed on your computer!")
        } else {
            const spinnerBar = ora()
            spinnerBar.text = chalk.green("Ping server...")
            spinnerBar.color = "white"
            spinnerBar.start()

            try {
                const versionApi = await getApiVersion()
                const updater = new Updater()
                spinnerBar.text = chalk.green("Checking update...")
                const isUpdate = updater.isUpdate()

                setTimeout(() => {
                    spinnerBar.stop()
                    if (!isUpdate) {
                        console.log(chalk.green("Server connected!"))
                        const templates = versionApi.templates
                        const sepackConfig = new SepackConfig(templates)
                        const prompter = new Prompter(sepackConfig)
                        prompter.startPromter()
                    } else {
                        updater.notify()
                    }
                }, 1000);
            } catch (error) {
                spinnerBar.stop()
                errorLine("Server not connected!")
            }
        }
    }
}

class Updater {
    private version: string
    constructor() {
        const versionProc = shelljs.exec("npm view sepack version", { silent: true })
        this.version = versionProc.stdout as string
    }

    isUpdate(): boolean {
        const api = this.version.trim()
        const current = appVersion.replace("v", "")
        const isCurrent = api === current
        if (!isCurrent) {
            return api.localeCompare(current, undefined, { numeric: true }) === 1
        } else {
            return false
        }
    }

    notify() {
        const command = chalk.greenBright(`npm i -g sepack`)
        const updateVersionColor = chalk.greenBright(`v${this.version}`)
        const message = chalk.white(`Update available, please run "${command}" to update ${updateVersionColor}`)

        const box = boxen(message, {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
        })

        console.log(box)
    }
}

