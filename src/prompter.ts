import { SepackConfig } from './model';
import axios from "axios";
import inquirer from "enquirer";
import clui from "clui";
import chalk from "chalk";
import shelljs from "shelljs";
import { base_url } from "./constant.js";

export class Prompter {
    sepackConfig: SepackConfig
    constructor(sepackConfig: SepackConfig) {
        this.sepackConfig = sepackConfig
    }

    startPromter() {
        console.log(this.sepackConfig.templates)
        console.log(this.sepackConfig.templates.length)
    }
}
