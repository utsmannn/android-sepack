function patchUpdate() { 
    const shelljs = require('shelljs')
    const pkg = require('../package.json')
    const currentVersionString = pkg.version
    const patchVersion = parseInt(pkg.version.split(".")[2])
    const mayor = currentVersionString.split(".")[0]
    const minor = currentVersionString.split(".")[1]
    const patch = patchVersion + 1
    const updatedVersion = `${mayor}.${minor}.${patch}`
    console.log(`current -> ${currentVersionString} to ${updatedVersion}`)
    shelljs.sed("-i", currentVersionString, updatedVersion, 'package.json')
}

exports.patchUpdate = patchUpdate()