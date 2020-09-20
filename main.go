package main

import (
	"bytes"
	"fmt"
	"github.com/go-errors/errors"
	"github.com/go-git/go-git"
	"github.com/manifoldco/promptui"
	"github.com/urfave/cli"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

const (
	TEMPLATE_1 = "MVVM Basic"
	TEMPLATE_2 = "MVVM Basic With Glide"
	TEMPLATE_3 = "MVVM Basic RecyclerView"
)

func main() {
	app := &cli.App{
		Name:   "init",
		Version: "0.1.2",
		Description: "Build android MVVM project with templates",
		Usage:  "Input application name, package name and select template",
		Action: actionBuf,
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}

func cloneRepo(appName string, repo string) {
	appName = strings.Replace(appName, " ", "-", -1)
	_, err := git.PlainClone(appName, false, &git.CloneOptions{
		URL:      repo,
		Progress: os.Stdout,
	})

	if err != nil {
		log.Fatal(err)
	}
}

func actionBuf(*cli.Context) error {
	userInput()
	return nil
}

func userInput() {
	appName, errAppName := settingUpName("Enter application name", false)
	if errAppName != nil {
		log.Fatal(errAppName)
	}

	packageName, errPackageName := settingUpName("Enter package name", true)
	log.Println("appname is ", appName)
	log.Println("package name is ", packageName)

	if errPackageName != nil {
		log.Fatal(errPackageName)
	}

	promptTemplate := promptui.Select{
		Label: "Select Template",
		Items: []string{TEMPLATE_1, TEMPLATE_2, TEMPLATE_3},
	}

	_, result, err := promptTemplate.Run()
	if err != nil {
		log.Fatal(err)
	}

	switch result {
	case TEMPLATE_1:
		var repo = "https://github.com/utsmannn/sepack-basic"
		setupClone(appName, repo, packageName, "Sepack-mvvm")
	case TEMPLATE_2:
		var repo = "https://github.com/utsmannn/sepack-basic-glide"
		setupClone(appName, repo, packageName, "sepack mvvm glide")
	case TEMPLATE_3:
		var repo = "https://github.com/utsmannn/sepack-basic-recyclerview"
		setupClone(appName, repo, packageName, "sepack mvvm glide")
	}
}

func setupClone(appName string, repo string, packageName string, oldName string) {
	fmt.Println("Cloning repo...")
	cloneRepo(appName, repo)
	removeUnusedDir(appName)
	fmt.Println("Configuring...")
	readFile(appName, packageName, oldName)
	fmt.Println("Removing old dir...")
	removeOldDir(appName, packageName)

	goos := runtime.GOOS
	switch goos {
	case "windows", "darwin":
		openAndroidStudio(appName)
	}
}

func openAndroidStudio(appName string)  {
	prompt := promptui.Prompt{
		Label: "Open project on Android Studio? (y/n)",
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatal(err)
	}

	if result == "y" || result == "yes" {
		openStudio(appName)
	} else {
		fmt.Println("done..")
	}
}


func openStudio(appName string)  {
	appName = strings.Replace(appName, " ", "-", -1)
	goos := runtime.GOOS
	switch goos {
	case "windows":
		var command = "start \"\" \"C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe\""
		runCommand(command, appName)
	case "darwin":
		var command = "open -a /Applications/Android\\ Studio.app"
		runCommand(command, appName)
	}
}

func runCommand(command string, appName string)  {
	fmt.Println("Opening...")
	cmd, err := exec.Command("bash", "-c", command + " " + appName).Output()
	if err != nil {
		log.Fatal(err)
	}

	log.Println(string(cmd))
}

func removeOldDir(appName string, packageName string) {
	if !strings.Contains(packageName, "com.utsman") {
		appName = strings.Replace(appName, " ", "-", -1)
		oldDirAndroidTest := appName + "/app/src/androidTest/java/com/utsman"
		oldDirMain := appName + "/app/src/main/java/com/utsman"
		oldDirTest := appName + "/app/src/test/java/com/utsman"

		err1 := os.RemoveAll(oldDirAndroidTest)
		err2 := os.RemoveAll(oldDirMain)
		err3 := os.RemoveAll(oldDirTest)

		if err1 != nil {
			log.Fatal(err1)
		}

		if err2 != nil {
			log.Fatal(err2)
		}

		if err3 != nil {
			log.Fatal(err3)
		}
	}
}

func removeUnusedDir(path string) {
	path = strings.Replace(path, " ", "-", -1)
	fmt.Println("Removing ds_store...")
	err := os.Remove(path + "/.DS_Store")
	fmt.Println("Removing idea config...")
	err = os.RemoveAll(path + "/.idea")
	fmt.Println("Removing git config...")
	errGit := os.RemoveAll(path + "/.git")

	if errGit != nil {
		log.Fatal(errGit)
	}

	if err != nil {
		log.Fatal(err)
	}
}

func settingUpName(command string, dot bool) (string, error) {
	prompt := promptui.Prompt{
		Label: command,
	}

	result, err := prompt.Run()
	validation := allowedChar(result, dot)
	if !validation {
		msg := "character not allowed"
		errVal := errors.New(msg)
		return result, errVal
	}

	return result, err
}

func readFile(appName string, packageName string, oldName string) {
	appNameSlash := strings.Replace(appName, " ", "-", -1)
	err := filepath.Walk(filepath.Base(appNameSlash),
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				log.Fatal(err)
				return err
			}
			dir, err := os.Stat(path)
			if err != nil {
				log.Fatal(err)
			}
			switch mode := dir.Mode(); {
			case mode.IsDir():
				// dir
			case mode.IsRegular():
				if path != "main.go" {
					replace(path, appName, packageName, oldName)
					newPath := pathFixing(path, packageName)

					pathMkdir := strings.Replace(newPath, info.Name(), "", -1)
					mkErr := os.MkdirAll(pathMkdir, os.ModePerm)
					if mkErr != nil {
						log.Fatal(mkErr)
					}

					err := os.Rename(path, newPath)
					fmt.Println("Configuring file: ", newPath)
					if err != nil {
						log.Fatal(err)
					}
				}
			}
			return nil
		})

	if err != nil {
		log.Fatal(err)
	}
}

func pathFixing(path string, packageName string) string {
	pathFixer := strings.Replace(packageName, ".", "/", -1)
	newPath := strings.Replace(path, "com/utsman/sepack", pathFixer, -1)
	return newPath
}

func replace(path string, appName string, packageName string, oldName string) {
	input, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	input = bytes.Replace(input, []byte("com.utsman.sepack"), []byte(packageName), -1)
	input = bytes.Replace(input, []byte(oldName), []byte(appName), -1)
	err = ioutil.WriteFile(path, input, 0666)
	if err != nil {
		log.Fatal(err)
	}
}

func allowedChar(s string, dot bool) bool {
	allowed := "abcdefghijklmnopqrstuvwxyz "
	if dot {
		allowed = "abcdefghijklmnopqrstuvwxyz."
	}

	for _, char := range s {
		if !strings.Contains(allowed, strings.ToLower(string(char))) {
			return false
		}
	}
	return true
}
