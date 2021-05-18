import { Command } from './command';
import { Prompter } from './prompter'
import shelljs from "shelljs"
import chalk from "chalk"
import { SepackConfig } from "./model"
import { errorLine, outLog, sdkPath, welcomeMessage } from "./utils"
import ora from "ora"
import { getApiVersion } from './network'
import { appVersion } from './constant'
import boxen from 'boxen'
import yargs from 'yargs'
import clear from 'cli-clear'

export class Main {
    constructor() { }

    async startArg() {
        const command = new Command()
        yargs.command(["create"], "Create project builder", async () => {
            await this.startBuilder()
        }).command(["build"], "Build android project", {
            sdk: {
                describe: 'Path android sdk',
                type: 'string',
                alias: 's',
                default: await sdkPath()
            },
            checksdk: {
                describe: 'Check path of sdk',
                type: 'boolean',
                alias: 'c',
                default: false
            }
        }, async (arg) => {
            if (arg.checksdk) {
                const sdk = await sdkPath()
                console.log(`Sdk path: ${sdk}`)
            } else {
                await command.buildProject(arg.sdk)
            }

        }).command(["run"], "Run application", {
            resume: {
                describe: 'Resume, run with skip build and install',
                type: 'boolean',
                alias: 'r'
            },
            log: {
                describe: 'Show log',
                type: 'boolean',
                alias: 'l'
            },
            tag: {
                describe: 'Filter tag',
                type: 'string',
                default: null,
                alias: 't'
            },
            verbose: {
                describe: 'Verbose level',
                type: 'boolean',
                alias: 'v'
            },
            debug: {
                describe: 'Debug level',
                type: 'boolean',
                alias: 'd'
            },
            info: {
                describe: 'Info level',
                type: 'boolean',
                alias: 'i'
            },
            warning: {
                describe: 'Warning level',
                type: 'boolean',
                alias: 'w'
            },
            error: {
                describe: 'Error level',
                type: 'boolean',
                alias: 'e'
            },
        }, async (arg) => {
            const isLogEnable = arg.log
            const isResume = arg.resume

            const tag = arg.tag ?? "*"
            const isTagEnable = arg.tag != "*"
            const isFilterVerbose = arg.verbose
            const isFilterDebug = arg.debug
            const isFilterInfo = arg.info
            const isFilterWarning = arg.warning
            const isFilterError = arg.error

            var level: string
            if (isFilterDebug) {
                level = "D"
            } else if (isFilterInfo) {
                level = "I"
            } else if (isFilterWarning) {
                level = "W"
            } else if (isFilterError) {
                level = "E"
            } else if (isFilterVerbose) {
                level = "V"
            } else {
                level = "V"
            }

            await command.runApp(isResume)
            if (isTagEnable || isLogEnable || isFilterVerbose || isFilterDebug || isFilterInfo || isFilterWarning || isFilterError) {
                setTimeout(() => {
                    command.log(tag, level)
                }, 2000);
            }
        }).argv
    }

    private async startBuilder() {
        clear()
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
                        outLog('Task', "Server connected!")
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