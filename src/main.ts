import { Prompter } from './prompter';
import shelljs from "shelljs"
import chalk from "chalk"
import axios from "axios"
import clui from "clui"
import { SepackConfig, Template, VersionApi } from "./model"
import { base_url } from "./constant"
import { welcomeMessage } from "./utils"
import { Network } from "./network_rx"
import { catchError } from "rxjs/operators"
import { of } from "rxjs"

export class Main {
    network: Network = new Network()
    constructor() { }

    start() {
        shelljs.exec("clear")
        welcomeMessage()

        if (!shelljs.which("git")) {
            console.log("git not installed on your computer!")
        } else {
            this.getTemplate()
        }
    }

    getTemplate() {
        var Spinner = clui.Spinner
        var spinnerBar = new Spinner("Ping to server....")
        spinnerBar.start()

        this.network.get<VersionApi>("/version")

        .pipe(catchError(err => of(console.log(err))))
        .subscribe()

        // axios
        //     .get(base_url + "/version")
        //     .then((response) => {
        //         spinnerBar.stop()
        //         console.log(chalk.green("Server connected!"))
        //         var templates = response.data.templates

        //         var sepackConfig = new SepackConfig(templates)

        //         var prompter = new Prompter(sepackConfig)
        //         prompter.startPromter()
        //         console.log("oke")
        //     })
        //     .catch((error) => {
        //         console.error("Server error!")
        //         spinnerBar.stop()
        //     })
    }
}

