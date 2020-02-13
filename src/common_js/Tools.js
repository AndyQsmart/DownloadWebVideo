import { ipcRenderer } from 'electron'

const Key = {
    ENTER: 13,
    R: 82,
}

class Tools {
    static isNone(value) {
        if (value == undefined)
            return true;
        if (value == null)
            return true;
        if (typeof(value) == "number" && isNaN(value))
            return true;
        return false;
    }

    static setPermanentStorageArg(key, data) {
        localStorage.setItem(key, JSON.stringify(data))
    }

    static removePermanentStorageArg(key) {
        localStorage.removeItem(key)
    }

    static clearStorage() {
        localStorage.clear()
    }

    static getPermanentStorageArg(key) {
        let arg = localStorage.getItem(key) 
        try {
            return JSON.parse(arg)
        }
        catch (e) {
            return null
        }
    }

    static blobToBase64(blob_data, callback) {
        let reader = new FileReader()
        reader.onload = (e) => {
            if (callback) {
                callback(e.target.result)
            }
        }
        reader.readAsDataURL(blob_data)
    }

    static blobToUrl(blob_data) {
        return URL.createObjectURL(blob_data)
    }

    static urlToBlob(the_url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("get", the_url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            if (this.status == 200) {
                if (callback) {
                    callback(this.response);
                }
            }
        };
        xhr.send();
    }

    static base64ToBlob(urlData, type='image/jpeg') {
        try {
            var arr = urlData.split(',')
            var mime = arr[0].match(/:(.*?);/)[1] || type;
            // 去掉url的头，并转化为byte
            var bytes = window.atob(arr[1]);
            // 处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
            var ia = new Uint8Array(ab);
            
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            return new Blob([ab], {
                type: mime
            });
        }
        catch (e) {
            var ab = new ArrayBuffer(0);
            return new Blob([ab], {
                type: type,
            });
        }
    }

    static onDownloadCallback(event, res) {
        // console.log(res)
        const the_option = Tools.taskList[res.task_id]
        if (!the_option) {
            return
        }
        const { onStart, onProgress, onEnd } = the_option
        if (res.event == 'onStart') {
            if (onStart) {
                onStart(res.data)
            }
        }
        else if (res.event == 'onProgress') {
            if (onProgress) {
                onProgress(res.data)
            }
        }
        if (res.event == 'onEnd') {
            delete Tools.taskList[res.task_id]
            if (onEnd) {
                onEnd(res.data)
            }
        }
    }

    static download(url, save_path, option) {
        if (!Tools.isDownloadListen) {
            ipcRenderer.on('api-return-fileutil-download', Tools.onDownloadCallback)
            Tools.isDownloadListen = true
        }
        ipcRenderer.invoke('api-fileutil-download', {
            url,
            save_path,
        }).then((task_id)=>{
            // console.log(task_id)
            Tools.taskList[task_id] = option
        });
    }

    static save(file, save_path, callback) {
        Tools.blobToBase64(file, (base64)=>{
            ipcRenderer.invoke('api-fileutil-savebase64', {
                base64,
                save_path,
            }).then(()=>{
                if (callback) {
                    callback()
                }
            }).catch((e)=>{
                console.log(e)
            })
        })
    }
}

Tools.Key = Key
Tools.isDownloadListen = false
Tools.taskList = {}

export default Tools;