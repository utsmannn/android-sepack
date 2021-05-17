import { appVersion } from './constant'
import chalk from "chalk"
import figlet from "figlet"
import shelljs from 'shelljs';

export function welcomeMessage() {
    console.log(
        chalk.white(
            figlet.textSync("sepack", {
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
            figlet.textSync("android", {
                font: "Colossal",
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 80,
                whitespaceBreak: false,
            })
        )
    )

    console.log(chalk.green("-------------------------------"))
    console.log(
        chalk.green(appVersion) + " | " + "by github.com/" + chalk.redBright("utsmannn")
    )
    console.log(chalk.green("-------------------------------"))
}

export function errorLine(error: string) {
    console.log(chalk.red(`Error: ${error}`))
}

export function outLog(param: string, value: string) {
    console.log(
        chalk.blueBright(param) + chalk.greenBright(value)
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
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path) // eslint-disable-line no-control-regex

    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }

    return path.replace(/\\/g, '/')
}

export function clear() {
    const os = process.platform
    switch (this.os) {
        case "win32":
            shelljs.exec("cls")
            break
        default:
            shelljs.exec("clear")
            break
    }
}