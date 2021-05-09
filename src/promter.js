import inquirer from "inquirer";
import { RepoConfig } from "./repo-data.js";

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
      var repoConfig = new RepoConfig();
      repoConfig.repoUrl = sepackConfig.repoUrl;
      repoConfig.projectName = answer.project_name;
      setupPackageName(repoConfig, sepackConfig);
    });
}
function setupPackageName(repoConfig, sepackConfig) {
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
      setupTemplate(repoConfig, sepackConfig);
    });
}
function setupTemplate(repoConfig, sepackConfig) {
  var templates = sepackConfig.template
  var templatesName = sepackConfig.template.map(item => {
    return item.name
  })
  console.log(templatesName)
  inquirer
    .prompt([
      {
        name: "repo_template",
        type: "list",
        message: "Select template",
        choices: templatesName,
        default: templatesName[0]
      },
    ])
    .then((answer) => {
      var selected = answer.repo_template;
      var selectedTemplate = templates.find(item => {
        return item.name == selected
      })
    
      console.log(selectedTemplate.url);
    });
}
