import { PackageSetup } from './model'
import shelljs from "shelljs"
import fs from "fs"
import ora from "ora"
import { folderNameOf, outLog } from './utils'

export class Cloner {
    private setup: PackageSetup
    private spinnerBar: ora.Ora
    private folder: string
    private currentPackageName = "com.sepack.basic"
    private tempPackageName = "com.sepack"

    constructor(setup: PackageSetup) {
        this.setup = setup
        this.spinnerBar = ora()
        this.spinnerBar.color = "white"
        this.folder = folderNameOf(this.setup.projectName)
    }

    async startClone(): Promise<boolean> {
        this.spinnerBar.text = "Preparing..."
        this.spinnerBar.start()
        const template = this.setup.template

        return new Promise((resolve) => {
            const command = `git clone -b ${template.branch} ${template.url} ${this.folder}`

            shelljs.exec(command, { silent: true, async: true }, async (_code, _stdout, stderr) => {
                const isError = stderr.includes("fatal")
                this.spinnerBar.stop()
                
                if (!isError) {
                    const replace = await this.replacing()
                    return resolve(replace)
                } else {
                    return resolve(false)
                }

            })
        })
    }

    private async replacing(): Promise<boolean> {
        return new Promise((resolve, _reject) => {
            shelljs.cd(this.folder)

            const prefixMain = "app/src/main/java/"
            const prefixAndroidTest = "app/src/androidTest/java/"
            const prefixUnitTest = "app/src/test/java/"

            const prefixList = [prefixMain, prefixAndroidTest, prefixUnitTest]
            prefixList.forEach(item => {
                this.moving(item)
            })

            const files = shelljs.find(".").filter(file => {
                return file.match(/\.kt$/) || file.match(/\/build.gradle$/) || file.match(/\.xml$/)
            })

            files.forEach(file => {
                outLog(`Generated file: `, file)
                shelljs.sed("-i", this.currentPackageName, this.setup.packageName, file)
            })

            this.addDependencies()
            this.naming()
            resolve(true)
        })
    }

    private moving(prefixDir: string) {
        const destinationPackage = this.setup.packageName

        const currentDir = prefixDir + this.currentPackageName.split(".").join("/")
        const temp = prefixDir + this.tempPackageName.split(".").join("/")
        const destinationDir = prefixDir + destinationPackage.split(".").join("/")

        const isExist = fs.existsSync(currentDir)
        const isContainsCom = !destinationPackage.includes("com")

        if (isExist) {
            shelljs.mkdir("-p", destinationDir)
            shelljs.mv("-f", currentDir + "/*", destinationDir)
            shelljs.rm("-rf", temp)
            if (isContainsCom) {
                shelljs.rm("-rf", prefixDir + "/com")
            }
        }

        const unusedFiles = [".DS_Store", ".idea", ".git", ".gitignore", ".gradle"]
        unusedFiles.forEach(item => {
            shelljs.rm("-rf", item)
        })
    }

    private addDependencies() {
        const currentPoint = `// sepack-external-dependencies`
        const destinationPoint = this.setup.dependencies.map(item => {
            return `implementation '${item}'`
        })

        destinationPoint.forEach(item => {
            outLog(`Adding dependencies: `, item)
        })

        const destinationString = `     ${destinationPoint}`.split(",").join("\n     ")
        const files = shelljs.find(".").filter((file) => {
            return file.match(/\/external.gradle$/)
        })

        if (destinationPoint.length != 0) {
            files.forEach((file) => {
                shelljs.sed("-i", currentPoint, destinationString, file)
            })
        }
    }

    private naming() {
        const currentPoint = `sepack-name-project`

        const files = shelljs.find(".").filter((file) => {
            return file.match(/\/strings.xml$/)
        })

        files.forEach((file) => {
            shelljs.sed("-i", currentPoint, this.setup.projectName, file)
        })

        shelljs.sed("-i", currentPoint, this.setup.projectName, "settings.gradle")
    }
}