#!/usr/bin/env node

import figlet from "figlet";
import shelljs from "shelljs";
import chalk from "chalk";
import { startPromter } from "./promter.js";
import axios from "axios";
import { SepackConfig } from "./repo-data.js";
import clui from "clui";

shelljs.exec("clear");
console.log(chalk.green(figlet.textSync("sepack - android", "Colossal")));
console.log(chalk.green("-----"));
console.log(chalk.blue("by github.com/utsmannn"));
console.log(chalk.green("-----"));

if (!shelljs.which("git")) {
  console.log("git not installed on your computer!");
}

var Spinner = clui.Spinner;
var spinnerBar = new Spinner();
spinnerBar.message(" ping to server...");
spinnerBar.start();

axios
  .get("https://sepacket.herokuapp.com/api/version")
  .then((response) => {
    spinnerBar.stop();
    console.log(chalk.green("server connected!"))
    var templates = response.data.templates;
    var dependencies = response.data.dependencies;

    var sepackConfig = new SepackConfig([templates], [dependencies]);
    startPromter(sepackConfig);
  })
  .catch((error) => {
    console.error("Server error!");
    spinnerBar.stop();
  });
