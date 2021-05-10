import axios from "axios";
import inquirer from "inquirer";
import { startClone } from "./git-clone.js";
import { RepoConfig, Template } from "./repo-data.js";
import clui from "clui";
import chalk from "chalk";

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
      },
    ])
    .then((answer) => {
      repoConfig.projectName = answer.project_name;
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
          if (allowed(value)) {
            return true;
          } else {
            return "Please enter your corrent package name";
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
        //console.log("ready" + dependenciesList + "\n" + selectedTemplate.name + "\n" + repoConfig.projectName + "\n" + selectedTemplate.dependencies);
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
        message: "Search dependencies",
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
    .get("http://localhost:8080/api/dependencies?search=" + search)
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
        console.log("Dependencies not found in maven central");
        selectDependencies();
      } else {
        depsChoise(dataMap);
      }
    })
    .catch((error) => {
      spinnerBar.stop();
      console.log(chalk.red("Failed!"));
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
      },
    ])
    .then((answer) => {
      var depsSelect = answer.dependencies;
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
      console.log(confirm);
    })
    .catch((error) => {
      console.log(error);
    });
}

function allowed(string) {
  var allowed = "abcdefghijklmnopqrstuvwxyz.";
  var filtering = string.split("").map((char) => {
    var included = allowed.includes(char)
    return included
  });

  var valid = !filtering.includes(false);
  return valid;
}
