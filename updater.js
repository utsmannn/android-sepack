const shelljs = require('shelljs')
const pkg = require('./package.json')
const currentVersionString = pkg.version

module.exports.mayorUpdate = function () { 
    const currentVersionString = pkg.version
    const mayorVersion = parseInt(pkg.version.split(".")[0])
    const mayor = mayorVersion + 1
    const minor = 0
    const patch = 0
    const updatedVersion = `${mayor}.${minor}.${patch}`
    console.log(`current -> ${currentVersionString} to ${updatedVersion}`)
    shelljs.sed("-i", currentVersionString, updatedVersion, 'package.json')
};

module.exports.minorUpdate = function () { 
    const currentVersionString = pkg.version
    const minorVersion = parseInt(pkg.version.split(".")[1])
    const mayor = currentVersionString.split(".")[0]
    const minor = minorVersion + 1
    const patch = 0
    const updatedVersion = `${mayor}.${minor}.${patch}`
    console.log(`current -> ${currentVersionString} to ${updatedVersion}`)
    shelljs.sed("-i", currentVersionString, updatedVersion, 'package.json')
};

module.exports.patchUpdate = function () { 
    const patchVersion = parseInt(pkg.version.split(".")[2])
    const mayor = currentVersionString.split(".")[0]
    const minor = currentVersionString.split(".")[1]
    const patch = patchVersion + 1
    const updatedVersion = `${mayor}.${minor}.${patch}`
    console.log(`current -> ${currentVersionString} to ${updatedVersion}`)
    shelljs.sed("-i", currentVersionString, updatedVersion, 'package.json')
};