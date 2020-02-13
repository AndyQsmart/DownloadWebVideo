import Tools from "./Tools"

var _develop_init = false
var _reload_event_list = []

class DevelopTools {
    static init() {
        if (!_develop_init) {
            window.addEventListener('keydown', (e)=>{
                // console.log(e)
                const event = window.event || e
                const code = event.keyCode || event.which
                if (code == Tools.Key.R && (event.metaKey || event.ctrlKey)) {
                    console.log('reload')
                    if (process.env.NODE_ENV !== 'development') {
                        e.preventDefault()
                        e.stopPropagation()
                    }
                    for (let i = 0; i < _reload_event_list.length; i++) {
                        _reload_event_list[i]()
                    }
                }
            })
            _develop_init = true
        }
    }

    static addReloadListener(func) {
        _reload_event_list.push(func)
    }

    static removeReloadListener(func) {
        for (let i = 0; i < _reload_event_list.length; i++) {
            if (_reload_event_list[i] == func) {
                _reload_event_list.splice(i, 1)
                return
            }
        }
    }
}

export default DevelopTools;