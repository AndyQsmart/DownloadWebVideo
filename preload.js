if (require('electron').remote) {
    window.testPreload = ()=>{
        console.log('world')
    }
}