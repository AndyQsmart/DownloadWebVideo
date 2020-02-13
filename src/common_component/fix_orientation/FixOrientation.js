import React, { PureComponent } from 'react';
import styles from './FixOrientation.css'
import EXIF from '../../common_js/exifjs/exif'
import Tools from '../../common_js/Tools.js'

class FixOrientation extends PureComponent {
    fixFile(file, type) {
        return this.fixUrl(Tools.blobToUrl(file), type)
    }

    fixUrl(url, type) {
        return new Promise((resolve, reject)=>{
            this.fixWithType(url, type, (file)=>{
                resolve(file)
            }, ()=>{
                reject()
            })
        })
    }

    fixWithType(url, type='image/png', callback, error_callback) {
        let img = new Image();
        img.onerror = () => {
            if (error_callback) {
                error_callback()
            }
        }
        img.onload = () => {
            let Orientation, ctxWidth, ctxHeight, base64; // 定义所需变量
            let canvas = this.refs.canvas
            let ctx = canvas.getContext('2d');
            try {
                EXIF.getData(img, function() {
                    Orientation = EXIF.getTag(this, 'Orientation');
                    ctxWidth = this.naturalWidth;
                    ctxHeight = this.naturalHeight;
            
                    // console.log(Orientation, ctxWidth, ctxHeight);
        
                    canvas.width = ctxWidth;
                    canvas.height = ctxHeight;
                    if ([5, 6, 7, 8].includes(Orientation)) {
                        canvas.width = ctxHeight;
                        canvas.height = ctxWidth;
                    }
        
                    switch (Orientation) {
                        case 2:
                            ctx.transform(-1, 0, 0, 1, ctxWidth, 0);
                            break;
                        case 3:
                            ctx.transform(-1, 0, 0, -1, ctxWidth, ctxHeight);
                            break;
                        case 4:
                            ctx.transform(1, 0, 0, -1, 0, ctxHeight);
                            break;
                        case 5:
                            ctx.transform(0, 1, 1, 0, 0, 0);
                            break;
                        case 6:
                            ctx.transform(0, 1, -1, 0, ctxHeight, 0);
                            break;
                        case 7:
                            ctx.transform(0, -1, -1, 0, ctxHeight, ctxWidth);
                            break;
                        case 8:
                            ctx.transform(0, -1, 1, 0, 0, ctxWidth);
                            break;
                        default:
                            ctx.transform(1, 0, 0, 1, 0, 0);
                    }
        
                    ctx.drawImage(img, 0, 0, ctxWidth, ctxHeight);
            
                    base64 = canvas.toDataURL(type, 1); 
                    callback(Tools.base64ToBlob(base64));
                });
            }
            catch (error) {
                console.log(error)
                Tools.urlToBlob(url, (file)=>{
                    callback(file)
                })
            }
        }
        img.src = url
    }

    render() {
        return (
            <div className={styles.container} >
                <canvas ref='canvas' >
                </canvas>
            </div>
        )
    }
}

export default FixOrientation;