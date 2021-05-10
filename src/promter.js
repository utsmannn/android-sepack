import axios from "axios";
import inquirer from "inquirer";
import { startClone } from "./git-clone.js";
import { RepoConfig, Template } from "./repo-data.js";
import clui from "clui";
import chalk from "chalk";
import shelljs from "shelljs";

var repoConfig = new RepoConfig();
var dependenciesList = [];
var selectedTemplate = new Template();

export function startPromter(sepackConfig) {
  inquirer
    .prompt([
      {
        name: "project_name",
        type: "input",
        message: "Input your your Project name?",
        validate: function (value) {
          if (allowed(value, false)) {
            return true;
          } else {
            console.log(
              chalk.red("\nError: Project name character forbidden!")
            );
            return "Please enter your correct package name";
          }
        },
      },
    ])
    .then((answer) => {
      var projectName = answer.project_name;
      repoConfig.projectName = projectName;
      setupPackageName(sepackConfig);
    });
}

function setupPackageName(sepackConfig) {
  inquirer
    .prompt([
      {
        name: "package_name",
        type: "input",
        message: "What is your Package name?",
        validate: function (value) {
          if (allowed(value, true)) {
            return true;
          } else {
            console.log(
              chalk.red(
                "\nError: Package name not allowed with dot in start or end!"
              )
            );
            return "Please enter your correct package name";
          }
        },
      },
    ])
    .then((answer) => {
      repoConfig.packageName = answer.package_name;
      setupTemplate(sepackConfig);
    });
}

function setupTemplate(sepackConfig) {
  var templates = sepackConfig.template;
  var templatesName = templates.map((item) => {
    return item.name;
  });

  inquirer
    .prompt([
      {
        name: "repo_template",
        type: "list",
        message: "Select template",
        choices: templatesName,
        default: templatesName[0],
      },
    ])
    .then((answer) => {
      var selected = answer.repo_template;
      selectedTemplate = templates.find((item) => {
        return item.name == selected;
      });
      repoConfig.repoUrl = selectedTemplate.url;
      addDepsConfirm("Add extra dependencies?");
    });
}

function addDepsConfirm(message) {
  inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: message,
      },
    ])
    .then((answer) => {
      var confirm = answer.confirm;
      if (confirm) {
        selectDependencies();
      } else {
        selectedTemplate.dependencies = dependenciesList;
        confirmBuilder();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function selectDependencies() {
  inquirer
    .prompt([
      {
        name: "dependencies_search",
        type: "input",
        message: "Search dependencies:",
        validate: function (value) {
          if (value.split("").length === 0) {
            console.log(chalk.red("\nError: Cannot input empty character"));
            return false;
          } else {
            return true;
          }
        },
      },
    ])
    .then((answer) => {
      var search = answer.dependencies_search;
      depsApiSearch(search);
    });
}

function depsApiSearch(search) {
  var Spinner = clui.Spinner;
  var spinnerBar = new Spinner();
  spinnerBar.message("searching dependencies for " + search);
  spinnerBar.start();

  axios
    .get("https://sepacket.herokuapp.com/api/dependencies?search=" + search)
    .then((response) => {
      spinnerBar.stop();
      var data = response.data;
      var dataMap = data.map((item) => {
        var group = item.group;
        var artifact = item.artifact;
        var version = item.version;
        return group + ":" + artifact + ":" + version;
      });

      if (dataMap.length === 0) {
        console.log(
          chalk.yellow("Warning: Dependencies not found in maven central")
        );
        selectDependencies();
      } else {
        depsChoise(dataMap);
      }
    })
    .catch((error) => {
      spinnerBar.stop();
      console.log(chalk.red("Error: Failed!"));
    });
}

function depsChoise(dependencies) {
  inquirer
    .prompt([
      {
        name: "dependencies",
        type: "checkbox",
        message: "Select dependencies",
        choices: dependencies,
        loop: false,
      },
    ])
    .then((answer) => {
      var depsSelect = answer.dependencies;
      if (depsSelect.length === 0) {
        console.log(
          chalk.yellow(
            "Warning: You not select any dependencies, use [space] for select"
          )
        );
      }
      depsSelect.forEach((item) => {
        dependenciesList.push(item);
      });
      addDepsConfirm("Add extra dependencies again?");
    })
    .catch((error) => {
      console.log(error);
    });
}

function confirmBuilder() {
  var projectName = repoConfig.projectName;
  var packageName = repoConfig.packageName;
  var template = selectedTemplate.name;
  var extraDependencies = selectedTemplate.dependencies.map((item) => {
    return `- ${item}\n                       `;
  });

  var dependenciesText = `${extraDependencies}`.split(",").join(" ");
  var confirmText = `
  
  Project name        : ${projectName}
  Package name        : ${packageName}
  Template            : ${template}
  Extra dependencies  : ${dependenciesText}
  
  `;

  if (extraDependencies.length === 0) {
    confirmText = `
    Project name        : ${projectName}
    Package name        : ${packageName}
    Template            : ${template}

    `;
  }

  console.log(chalk.cyan(confirmText));
  inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "Confirm this builder project",
      },
    ])
    .then((answer) => {
      var confirm = answer.confirm;
      if (confirm) {
        startClone(repoConfig, selectedTemplate, (success) => {
          if (success) {
            askOpenStudio();
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function allowed(string, dot) {
  var allowed;
  if (dot) {
    allowed = "abcdefghijklmnopqrstuvwxyz.";
  } else {
    allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
  }
  var stringList = string.split("");
  var filtering = stringList.map((char) => {
    var included = allowed.includes(char);
    return included;
  });

  var dotNotAllowed =
    stringList[0] === "." || stringList[stringList.length - 1] === ".";
  var valid = !filtering.includes(false);
  return valid && !dotNotAllowed;
}

function askOpenStudio() {
  inquirer
    .prompt([
      {
        name: "open",
        type: "confirm",
        message: "Open Android Studio?",
      },
    ])
    .then((answer) => {
      var confirm = answer.open;
      if (confirm) {
        openStudio();
      }
    });
}

function openStudio() {
  var os = process.platform;
  var macCommand =
    "open -a /Applications/Android\\ Studio.app .";

  switch (os) {
    case "darwin":
      shelljs.exec(macCommand);
      break;
    default:
      console.log("Your os not able to open project");
      break;
  }
}
