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
            let bytes_str = arr[arr.length-1]
            arr.splice(arr.length-1, 1)
            let mine_str = arr.join(',')
            var mime = mine_str.match(/:(.*?);/)[1] || type;
            // 去掉url的头，并转化为byte
            var bytes = window.atob(bytes_str);
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
            console.log('Tools.base64ToBlob:error:', e)
            var ab = new ArrayBuffer(0);
            return new Blob([ab], {
                type: type,
            });
        }
    }
}

Tools.Key = Key

export default Tools;