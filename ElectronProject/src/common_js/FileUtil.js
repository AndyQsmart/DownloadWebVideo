const fs = require('fs');
const request = require('request');

class FileUtil {
    static saveBase64(base64, save_path, callback, error_callback) {
        if (!base64) {
            if (error_callback) {
                error_callback()
            }
            return
        }
        let arr = base64.split(',')
        // 去掉url的头，并转化为byte
        let bytes_str = arr[1]
        let data_buffer = new Buffer(bytes_str, 'base64')
        fs.writeFile(save_path, data_buffer, (err) => {
            if (err) {
                console.log(err)
                return
            }
            if (callback) {
                callback()
            }
        })
    }

    static download(url, save_path, option) {
        const { onStart, onProgress, onEnd } = option
        const req = request({
            method: 'GET',
            uri: url,
        })
        const out = fs.createWriteStream(save_path);
        req.pipe(out);
        req.on('response', (data) => {
            // 更新总文件字节大小
            let totalBytes = parseInt(data.headers['content-length'], 10);
            if (onStart) {
                onStart({
                    total: totalBytes,
                })
            }
        });
        
        let receivedBytes = 0;
        req.on('data', (chunk) => {
            // 更新下载的文件块字节大小
            receivedBytes += chunk.length;
            if (onProgress) {
                onProgress({
                    receive: receivedBytes,
                })
            }
        });
        
        req.on('end', () => {
            // TODO: 检查文件，部署文件，删除文件
            if (onEnd) {
                onEnd()
            }
        })
    }
}

module.exports = FileUtil;