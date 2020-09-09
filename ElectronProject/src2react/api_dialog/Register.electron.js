const { ipcMain, dialog } = require('electron')

ipcMain.handle('api-dialog', (event, arg)=>{
    try {
        return dialog.showOpenDialog(arg)
    }
    catch (e) {
        console.log(e)
        return null
    }
});