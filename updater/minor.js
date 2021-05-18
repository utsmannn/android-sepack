function minorUpdate() { 
    const shelljs = require('shelljs')
    const pkg = require('../package.json')
    const currentVersionString = pkg.version
    const minorVersion = parseInt(pkg.version.split(".")[1])
    const mayor = currentVersionString.split(".")[0]
    const minor = minorVersion + 1
    const patch = currentVersionString.split(".")[2]
    const updatedVersion = `${mayor}.${minor}.${patch}`
    console.log(`current -> ${currentVersionString} to ${updatedVersion}`)
    shelljs.sed("-i", currentVersionString, updatedVersion, 'package.json')
}

exports.minorUpdate = minorUpdate()