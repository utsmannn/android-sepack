import { appVersion } from './constant'
import chalk from "chalk"
import figlet from "figlet"
import shelljs from "shelljs"
import osSys from 'os'

export function welcomeMessage() {
    console.log(
        chalk.white(
            "  " + figlet.textSync("sepack", {
                font: "Colossal",
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 80,
                whitespaceBreak: true,
            })
        )
    )
    console.log(
        chalk.green(
            "  " + figlet.textSync("android", {
                font: "Colossal",
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 80,
                whitespaceBreak: false,
            })
        )
    )

    console.log(chalk.green("  -------------------------------"))
    console.log(
        "  " + chalk.green(appVersion) + " | " + "by github.com/" + chalk.redBright("utsmannn")
    )
    console.log(chalk.green("  -------------------------------"))
}

export function errorLine(error: string) {
    console.log(chalk.red(`!! Error: ${error}`))
}

export function outLog(param: string, value: string) {
    console.log(
        chalk.blueBright(`> ${param}: `) + chalk.white(value)
    )
}

export function folderNameOf(projectName: string): string {
    return projectName.trim()
        .split(" ")
        .join("-")
        .toLowerCase()
}

export function slash(path: string) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path)
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path)

    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }

    return path.replace(/\\/g, '/')
}

export async function sdkPath(): Promise<string> {
    return new Promise(resolve => {
        shelljs.exec('whoami', { silent: true, async: true }, (code, stdout, stderr) => {
            const user = stdout.split("\\").reverse()[0].trim()
            const unixSdk = `/Users/${user}/Library/Android/sdk`
            const winSdk = `C:/Users/${user}/AppData/Local/Android/Sdk`
    
            if (osSys.type() == 'Windows_NT') {
                resolve(slash(winSdk))
            } else {
                resolve(unixSdk)
            }
        })
    })
}