#!/usr/bin/env node

import figlet from "figlet";
import shelljs from "shelljs";
import chalk from "chalk";
import { startClone } from "./git-clone.js";
import inquirer from "inquirer";
import { RepoConfig } from "./repo-config.js";

shelljs.exec("clear");

console.log(chalk.green(figlet.textSync("sepack - android", "Colossal")));
console.log(chalk.blue("by github.com/utsmannn"));
console.log(chalk.green("-----"));

if (!shelljs.which("git")) {
  console.log("git not installed on your computer!");
} else {
  shelljs.exec("git --version");
}

inquirer
  .prompt([
    {
      name: "project_name",
      type: "input",
      message: "Input your your Project name?",
    },
  ])
  .then((answer) => {
    var repoConfig = new RepoConfig();
    repoConfig.repoUrl = "https://github.com/utsmannn/sepack-basic.git";
    repoConfig.projectName = answer.project_name;
    setupPackageName(repoConfig);
  });

function setupPackageName(repoConfig) {
  inquirer
    .prompt([
      {
        name: "package_name",
        type: "input",
        message: "What is your Package name?",
        validate: function (value) {
          if (value.includes(".")) {
            return true;
          } else {
            return "Please enter your corrent package name";
          }
        },
      },
    ])
    .then((answer) => {
      repoConfig.packageName = answer.package_name;
      setupTemplate(repoConfig);
    });
}

function setupTemplate(repoConfig) {
    inquirer
    .prompt([
      {
        name: "repo_template",
        type: "list",
        message: "Select template",
        choices: [ 'mvvm', 'mvp' ],
        default: 'public'
      },
    ])
    .then((answer) => {
        var template = answer.repo_template
        console.log(template)
      /* repoConfig.packageName = answer.package_name;
      startClone(repoConfig); */
    });
}