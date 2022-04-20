// Modules to control application life and create native browser window
const { app, ipcMain, dialog, BrowserWindow, BrowserView } = require('electron')
const path = require('path')
const Tools = require('./src/common_js/Tools')
const CreateTray = require('./src/instance_js/CreateTray')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let force_quit = false

if (!app.requestSingleInstanceLock()) {
    app.quit()
}

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
            contextIsolation: false, // 好像是解决require报错问题
            webviewTag: true,  // 解决webview无法显示问题
            allowRunningInsecureContent: true,
            webSecurity: false, // 跨域问题
            backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器。这也会影响到 Page Visibility API
        }
    })

    // and load the index.html of the app.
    // mainWindow.loadFile('index.html')
    // mainWindow.loadURL('http://localhost:3000')
    mainWindow.loadURL(`file://${__dirname}/build_html/index.html`)

    // Open the DevTools.
    if (Tools.isDebug()) {
        mainWindow.webContents.openDevTools()
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        force_quit = false
    })

    mainWindow.on('close', (e)=>{
        if (!force_quit) {
            e.preventDefault()
            mainWindow.hide()
        }
    })

    app.on('activate', ()=>{
        if (!mainWindow.isVisible()) {
            mainWindow.show()
            mainWindow.focus()
        }
    })

    app.on('second-instance', ()=>{
        if (!mainWindow.isVisible()) {
            mainWindow.show()
            mainWindow.focus()
        } 
        else {
            mainWindow.focus()
        }
    })

    app.on('before-quit', ()=>{
        // console.log('before-quit')
        force_quit = true
    })

    CreateTray({
        forceQuit: ()=>{
            force_quit = true
            app.quit()
        },
        showMainWindow: ()=>{
            mainWindow.show()
            mainWindow.focus()
        }
    })
}

app.commandLine.appendSwitch("disable-background-timer-throttling")
app.commandLine.appendSwitch('disable-site-isolation-trials') // 修复webview中iframe跨域问题

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

require('./src2react/api_dialog/Register.electron')
require('./src/instance_js/CreateMenu')