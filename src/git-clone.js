import shelljs from "shelljs";
import chalk from "chalk";
import clui from "clui";
import { RepoConfig, Template } from "./repo-data.js";
import fs from "fs";

var repoConfig = new RepoConfig();
var template = new Template();

export function startClone(rConfig, tConfig, listener) {
  repoConfig = rConfig;
  template = tConfig;

  var folderProject = repoConfig.projectName
    .trim()
    .split(" ")
    .join("-")
    .toLowerCase();

  var command = `git clone -b ${template.branch} ${repoConfig.repoUrl} ${folderProject}`

  console.log(command)
  var Spinner = clui.Spinner;
  var spinnerBar = new Spinner();
  spinnerBar.message("Building project...");
  spinnerBar.start();
  shelljs.exec(
    command,
    { silent: true, async: false },
    function (code, stdout, stderr) {
      spinnerBar.stop();
      var isError = stderr.includes("fatal");
      if (isError) {
        console.log(chalk.red(stderr));
        listener(false);
      } else {
        replacing(folderProject, repoConfig);

        spinnerBar.message("Success");
        console.log(chalk.green("Success!"));
        listener(true);
      }
    }
  );
}

function replacing(folder) {
  var currentPackageName = "com.sepack.basic";
  var destinationPackageName = repoConfig.packageName;
  shelljs.cd(folder);

  var prefixMain = "app/src/main/java/";
  var prefixAndroidTest = "app/src/androidTest/java/";
  var prefixUnitTest = "app/src/test/java/";

  moving(prefixMain);
  moving(prefixAndroidTest);
  moving(prefixUnitTest);

  fixer(currentPackageName, destinationPackageName);
  addExtrasDependencies();
  changeNameProject();
}

function moving(prefixDir) {
  var currentPackageName = "com.sepack.basic";
  var tempPackageName = "com.sepack";
  var destinationPackageName = repoConfig.packageName;

  var currentDir = prefixDir + currentPackageName.split(".").join("/");
  var temp = prefixDir + tempPackageName.split(".").join("/");
  var destinationDir = prefixDir + destinationPackageName.split(".").join("/");

  var isExsist = fs.existsSync(currentDir);
  var isContainsCom = !destinationPackageName.includes("com");
  if (isExsist) {
    shelljs.mkdir("-p", destinationDir);
    shelljs.mv("-f", currentDir + "/*", destinationDir);
    shelljs.rm("-rf", temp);
    if (isContainsCom) {
      shelljs.rm("-rf", prefixDir + "/com");
    }
  }

  var unusedFiles = [".DS_Store", ".idea", ".git", ".gitignore", ".gradle"];
    unusedFiles.forEach((item) => {
      shelljs.rm("-rf", item);
    });
}

function fixer(current, destination) {
  var files = shelljs.find(".").filter((file) => {
    return file.match(/\.kt$/) || file.match(/\/build.gradle$/) || file.match(/\.xml$/);
  });
  files.forEach((file) => {
    shelljs.sed("-i", current, destination, file);
  });
}

function addExtrasDependencies() {
  var dependencies = template.dependencies;
  var current = `// sepack-external-dependencies`;
  var destination = dependencies.map((item) => {
    return `implementation '${item}'`;
  });

  var destinationString = `     ${destination}`.split(",").join("\n     ");

  var files = shelljs.find(".").filter((file) => {
    return file.match(/\/external.gradle$/);
  });

  if (destination.length != 0) {
    files.forEach((file) => {
      shelljs.sed("-i", current, destinationString, file);
    });
  }
}

function changeNameProject() {
  var current = `sepack-name-project`;
  var destination = repoConfig.projectName;

  var files = shelljs.find(".").filter((file) => {
    return file.match(/\/strings.xml$/);
  });

  files.forEach((file) => {
    shelljs.sed("-i", current, destination, file);
  });

  shelljs.sed("-i", current, destination, "settings.gradle")
  
}
