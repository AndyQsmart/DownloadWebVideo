// Modules to control application life and create native browser window
const { app, ipcMain, dialog, BrowserWindow } = require('electron')
const path = require('path')
const FileUtil = require('./src_electron/common_js/FileUtil')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,  // 解决require is not defined问题
            webviewTag: true,  // 解决webview无法显示问题
        }
    })

    // and load the index.html of the app.
    // mainWindow.loadFile('index.html')
    // mainWindow.loadURL('http://localhost:3000')
    mainWindow.loadURL(`file://${__dirname}/build/index.html`)

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    // const { session } = require('electron')

    // // Modify the user agent for all requests to the following urls.
    // const filter = {
    // urls: ['*://*/*']
    // }

    // session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    // //   details.requestHeaders['User-Agent'] = 'MyAgent'
    //     console.log(details.url)
    //     callback({ requestHeaders: details.requestHeaders })
    // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('api-dialog', (event, arg)=>{
    try {
        return dialog.showOpenDialog(arg)
    }
    catch (e) {
        console.log(e)
        return null
    }
});

ipcMain.handle('api-fileutil-savebase64', (event, arg)=>{
    const { base64, save_path } = arg
    return new Promise((resolve, reject)=>{
        FileUtil.saveBase64(base64, save_path, ()=>{
            resolve()
        }, ()=>{
            reject()
        })
    })
})

var task_id_max = 1
var task_id_list = []
ipcMain.handle('api-fileutil-download', (event, arg)=>{
    let the_task_id = null
    if (task_id_list.length > 0) {
        the_task_id = task_id_list.pop()
    }
    else {
        the_task_id = task_id_max
        task_id_max += 1
    }

    const { url, save_path } = arg
    // console.log(arg)
    FileUtil.download(url, save_path, {
        onStart: (res)=>{
            event.sender.send('api-return-fileutil-download', {
                task_id: the_task_id,
                event: 'onStart',
                data: res,
            })
        },
        onProgress: (res)=>{
            event.sender.send('api-return-fileutil-download', {
                task_id: the_task_id,
                event: 'onProgress',
                data: res,
            })
        },
        onEnd: (res)=>{
            if (the_task_id == task_id_max-1) {
                task_id_max -= 1
            }
            else {
                task_id_list.push(the_task_id)
            }
            event.sender.send('api-return-fileutil-download', {
                task_id: the_task_id,
                event: 'onEnd',
                data: res,
            })
        }
    })

    return new Promise((resolve, reject)=>{
        resolve(the_task_id)
    })
})