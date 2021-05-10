#!/usr/bin/env node

import figlet from "figlet";
import shelljs from "shelljs";
import chalk from "chalk";
import { startPromter } from "./promter.js";
import axios from "axios";
import { SepackConfig } from "./repo-data.js";
import clui from "clui";

shelljs.exec("clear");
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
);
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
);

var version = "0.2.3"

console.log(chalk.green("-------------------------------"));
console.log(chalk.green(`v${version}`) + " | " + chalk.blue("by github.com/utsmannn"));
console.log(chalk.green("-------------------------------"));

if (!shelljs.which("git")) {
  console.log("git not installed on your computer!");
}

var Spinner = clui.Spinner;
var spinnerBar = new Spinner();
spinnerBar.message(" ping to server...");
spinnerBar.start();

axios
  .get("http://localhost:8080/api/version")
  .then((response) => {
    spinnerBar.stop();
    console.log(chalk.green("server connected!"));
    var templates = response.data.templates;
    var dependencies = response.data.dependencies;

    var sepackConfig = new SepackConfig([templates], [dependencies]);
    startPromter(sepackConfig);
  })
  .catch((error) => {
    console.error("Server error!");
    spinnerBar.stop();
  });
