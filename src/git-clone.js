import shelljs from "shelljs";
import chalk from "chalk";
import clui from "clui";

export function startClone(repoConfig) {
    var folderProject = repoConfig.projectName.split(" ").join("-");
    var command = "git clone " + repoConfig.repoUrl + " " + folderProject

    var Spinner = clui.Spinner;
    var spinnerBar = new Spinner();
    spinnerBar.message("Building project...");
    spinnerBar.start();
    shelljs.exec(command, { silent: true, async: false }, function (code, stdout, stderr) {
        spinnerBar.message("Success");
        spinnerBar.stop();

        var isError = stderr.includes('fatal');
        if (isError) {
            console.log(
                chalk.red(stderr)
            );
        } else {
            replacing(folderProject, repoConfig)
            console.log(chalk.green("Success!"));
        }
    });
}

function replacing(folder, repoConfig) {
    var currentPackageName = "com.utsman.sepack"
    var destinationPackageName = repoConfig.packageName

    var unusedFiles = [".DS_Store", ".idea", ".git", ".gitignore"]
    shelljs.cd(folder)
    shelljs.rm('-rf', unusedFiles)

    var prefixMain = "app/src/main/java/"
    var prefixAndroidTest = "app/src/androidTest/java/"
    var prefixUnitTest = "app/src/test/java/"

    var prefixs = [prefixMain, prefixAndroidTest, prefixUnitTest]
    prefixs.forEach(prefix => {
        moving(prefix, repoConfig)
    })

    fixer(currentPackageName, destinationPackageName)
}

function moving(prefixDir, repoConfig) {
    var currentPackageName = "com.utsman.sepack"
    var destinationPackageName = repoConfig.packageName

    var currentDir = prefixDir +  currentPackageName.split(".").join("/")
    var destinationDir = prefixDir + destinationPackageName.split(".").join("/")
    shelljs.mv("-f", currentDir, destinationDir)
}

function fixer(current, destination) {
    var files = shelljs.find(".").filter(file => {
        return file.match(/\.kt$/) || file.match(/\/build.gradle$/)
    })
    files.forEach(file => {
        shelljs.sed("-i", current, destination, file)
    })
}