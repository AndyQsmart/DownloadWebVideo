const { app, Menu, Tray } = require('electron')
const path = require('path')

let tray = null
function CreateTray(helper) {
    tray = new Tray(path.join(__dirname, './tray_icon.png'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示窗口',
            type: 'normal',
            checked: false,
            click: ()=>{
                helper.showMainWindow()
            },
        },
        {
            label: '退出',
            type: 'normal',
            click: ()=>{
                tray.destroy()
                tray = null
                helper.forceQuit()
            },
        },
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
}

module.exports = CreateTray