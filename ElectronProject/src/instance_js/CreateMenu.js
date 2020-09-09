const Tools = require('../common_js/Tools')
const { app, Menu } = require('electron')

const isMac = Tools.isMac()
const isWin = Tools.isWin()

// const template = [
//     // { role: 'appMenu' }
//     ...(isMac ? [{
//         label: '关于直播工具',
//         submenu: [
//             { role: 'about' },
//             { type: 'separator' },
//             { role: 'services' },
//             { type: 'separator' },
//             { role: 'hide' },
//             { role: 'hideothers' },
//             { role: 'unhide' },
//             { type: 'separator' },
//             { role: 'quit' }
//         ]
//     }] : []),
//     // { role: 'fileMenu' }
//     {
//         label: '文件',
//         submenu: [
//             isMac ? { role: 'close' } : { role: 'quit' }
//         ]
//     },
//     // { role: 'editMenu' }
//     {
//         label: 'Edit',
//         submenu: [
//             { role: 'undo' },
//             { role: 'redo' },
//             { type: 'separator' },
//             { role: 'cut' },
//             { role: 'copy' },
//             { role: 'paste' },
//             ...(isMac ? [
//                 { role: 'pasteAndMatchStyle' },
//                 { role: 'delete' },
//                 { role: 'selectAll' },
//                 { type: 'separator' },
//                 {
//                     label: 'Speech',
//                     submenu: [
//                         { role: 'startspeaking' },
//                         { role: 'stopspeaking' }
//                     ]
//                 }
//             ] : [
//                     { role: 'delete' },
//                     { type: 'separator' },
//                     { role: 'selectAll' }
//                 ])
//         ]
//     },
//     // { role: 'viewMenu' }
//     {
//         label: 'View',
//         submenu: [
//             { role: 'reload' },
//             { role: 'forcereload' },
//             { role: 'toggledevtools' },
//             { type: 'separator' },
//             { role: 'resetzoom' },
//             { role: 'zoomin' },
//             { role: 'zoomout' },
//             { type: 'separator' },
//             { role: 'togglefullscreen' }
//         ]
//     },
//     // { role: 'windowMenu' }
//     {
//         label: 'Window',
//         submenu: [
//             { role: 'minimize' },
//             { role: 'zoom' },
//             ...(isMac ? [
//                 { type: 'separator' },
//                 { role: 'front' },
//                 { type: 'separator' },
//                 { role: 'window' }
//             ] : [
//                     { role: 'close' }
//                 ])
//         ]
//     },
//     {
//         role: 'help',
//         submenu: [
//             {
//                 label: 'Learn More',
//                 click: async () => {
//                     const { shell } = require('electron')
//                     await shell.openExternal('https://electronjs.org')
//                 }
//             }
//         ]
//     }
// ]

const template = [
    ...(isMac ? [{
        label: '直播工具',
        submenu: [
            { role: 'about' },
        ]
    }] : []),
    ...(Tools.isDebug() ? [{
        label: '开发工具',
        submenu: [
            { role: 'reload' },
        ]
    }] : []),
]

console.log('Create Application Menu')
const menu = Menu.buildFromTemplate(template)
if (isWin) {
    Menu.setApplicationMenu(Tools.isDebug() ? menu : null)
}
else if (isMac) {
    Menu.setApplicationMenu(menu)
}
else {
    Menu.setApplicationMenu(menu)
}