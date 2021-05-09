#!/usr/bin/env node

import figlet from "figlet";
import shelljs from "shelljs";
import chalk from "chalk";
import { startPromter } from "./promter.js";
import axios from "axios";
import { SepackConfig } from "./repo-data.js";

shelljs.exec("clear");
console.log(chalk.green(figlet.textSync("sepack - android", "Colossal")));
console.log(chalk.blue("by github.com/utsmannn"));
console.log(chalk.green("-----"));

if (!shelljs.which("git")) {
  console.log("git not installed on your computer!");
} else {
  shelljs.exec("git --version");
}

axios
  .get("http://localhost:8080/api/version")
  .then(response => {
    var templates = response.data.templates
    var dependencies = response.data.dependencies

    var sepackConfig = new SepackConfig([templates], [dependencies])
    startPromter(sepackConfig)
  })
  .catch(error => {
    console.error(error)
  })
