import React, { PureComponent } from 'react';
import styles from './ImageCompress.css'
import Tools from '../../common_js/Tools.js'
import FixOrientation from '../fix_orientation/FixOrientation.js';

class ImageCompress extends PureComponent {
    compressUrl(url, obj={}) {
        return new Promise((resolve, reject)=>{
            Tools.urlToBlob(url, (file)=>{
                this._compress(file, obj, (file, meta)=>{
                    resolve(file, meta)
                }, ()=>{
                    reject()
                })
            })
        })
    }

    compress(file, obj={}) {
        return new Promise((resolve, reject)=>{
            this._compress(file, obj, (file, meta)=>{
                resolve(file, meta)
            }, ()=>{
                reject()
            })
        })
    }

    _compress(file, obj, callback, error_callback) {
        let canvas = this.refs.canvas
        let type = obj.type ? obj.type : 'image/png'
        this.refs.fixOrientation.fixFile(file, type).then((ans)=>{
            let img = new Image();
            img.src = Tools.blobToUrl(ans);
            img.onerror = ()=>{
                if (error_callback) {
                    error_callback()
                }
            }
            img.onload = function() {
                let that = this;
                // 默认按比例压缩
                let w = that.width, h = that.height, scale = w / h;
                w = obj.width || w;
                if (!Tools.isNone(obj.maxWidth)) {
                    if (w > obj.maxWidth) {
                        w = obj.maxWidth
                    }
                }
                h = obj.height || (w / scale);
                if (!Tools.isNone(obj.maxHeight)) {
                    if (h > obj.maxHeight) {
                        h = obj.maxHeight
                        w = h * scale
                    }
                }
                let quality = 1;  // 默认图片质量为1
                //生成canvas
                let ctx = canvas.getContext('2d');
                canvas.width = w
                canvas.height = h
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                let base64 = canvas.toDataURL(type, quality);
                // 回调函数返回base64的值
                callback(Tools.base64ToBlob(base64), {
                    width: w,
                    height: h,
                })
            }
        }).catch(()=>{
            if (error_callback) {
                error_callback()
            }
        })
    }

    render() {
        return (
            <div className={styles.container} >
                <canvas ref='canvas' >
                </canvas>
                <FixOrientation ref='fixOrientation' />
            </div>
        )
    }
}

export default ImageCompress;
    