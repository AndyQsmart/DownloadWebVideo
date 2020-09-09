const { app } = require('electron')

class Tools {
    static isDebug() {
        return !app.isPackaged
    }

    static isMac() {
        return process.platform === 'darwin'
    }

    static isWin() {
        return process.platform === 'win32'
    }
}

module.exports = Tools;