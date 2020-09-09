import React, { Component } from 'react';
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules';

import Button from '@material-ui/core/Button';
import Tools from '../../../common_js/Tools'

import styles from './FileButton.css'
import WeixinTools from '../../../common_js/weixin/WeixinTools';

class FileButton extends Component {
    constructor(props) {
        super(props);
        this.button = React.createRef()
        this.getFiles = this.getFiles.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    click() {
        this.button.current.click()
    }

    onClick() {
        const { onChange } = this.props
        WeixinTools.jssdk.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                WeixinTools.jssdk.getLocalImgData({
                    localId: localIds[0],
                    success: function (res) {
                        let localData = 'data:image/jpeg;base64,' + res.localData
                        // let localData = 'data:image/jpeg;base64,' + res.localData.replace(/\r|\n/g, '');
                        if (onChange) {
                            onChange([Tools.jpegBase64ToBlob(localData)])
                        }
                    }
                });
            }
        });
    }

    getFiles() {
        let ans = []
        let files = this.refs.fileLoader.files
        for (let i = 0; i < files.length; i++) {
            ans.push(files[i])
        }
        return ans
    }

    onChange(e) {
        if (!Tools.isNone(this.props.onChange)) {
            this.props.onChange(this.getFiles())
        }
        this.refs.fileLoader.value = ''
    }

    componentDidMount() {
        if (Tools.isWeiXin() && Tools.isAndroid()) {
            WeixinTools.configJsSdk()
        }
    }

    render() {
        let { accept, onChange, children, multiple, ...other } = this.props
        if (Tools.isNone(accept)) {
            accept = 'image/*'
            if (Tools.isChrome()) {
                accept = 'image/jpeg,image/gif,image/png,image/bmp'
            }
        }

        if (Tools.isWeiXin() && Tools.isAndroid()) {
            return (
                <Button {...other} onClick={this.onClick} >
                    {this.props.children}
                </Button>
            );
        }

        return (
            <Button component='label' {...other} ref={this.button}>
                {
                    this.props.multiple == true ?
                        <input styleName='input-area' ref='fileLoader' onChange={this.onChange} type="file" accept={accept} multiple />
                    :
                        <input styleName='input-area' ref='fileLoader' onChange={this.onChange} type="file" accept={accept} />
                }
                {this.props.children}
            </Button>
        );
    }
}

FileButton.propTypes = {
    onChange: PropTypes.func,
    accept: PropTypes.string,
}

export default CSSModules(FileButton, styles);
