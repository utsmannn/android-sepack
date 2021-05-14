import { Prompter } from './prompter';
import shelljs from "shelljs"
import chalk from "chalk"
import { SepackConfig, VersionApi } from "./model"
import { errorLine, welcomeMessage } from "./utils"
import ora from "ora"
import { getApiVersion } from './network';

export class Main {
    constructor() { }

    async start() {
        shelljs.exec("clear")
        welcomeMessage()

        if (!shelljs.which("git")) {
            errorLine("Error:  git not installed on your computer!")
        } else {
            const spinnerBar = ora(chalk.green("Ping server..."))
            spinnerBar.color = "white"
            spinnerBar.start()

            try {
                const versionApi = await getApiVersion()
                spinnerBar.stop()
                console.log(chalk.green("Server connected!"))
                const templates = versionApi.templates
                const sepackConfig = new SepackConfig(templates)
                const prompter = new Prompter(sepackConfig)
                prompter.startPromter()
            } catch (error) {
                spinnerBar.stop()
                errorLine("Server not connected!")
            }

        }
    }
}

