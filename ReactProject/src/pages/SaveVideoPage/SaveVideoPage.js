import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles'
import DevelopTools from '../../common_js/DevelopTools';
import NavBar from '../../instance_component/NavBar/NavBar';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box'
import OverflowBox from '../../common_component/box/OverflowBox';
import DirectoryButton from '../../common_component/button/DirectoryButton';
import FileUtil from '../../common_js/FileUtil';
import Tools from '../../common_js/Tools';

const path = require('path')

const ui_styles = {
    url_text: {
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap'
    },
}

const getVideoFunction = function(save_path) {
    function getTimeStamp() {
        return Math.floor(Date.now()/1000.0)
    }

    function prefixZero(num) {
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
    }

    function getTimeByStamp(time_stamp, format) {
        let date = new Date(time_stamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        format = format.replace("%MM", prefixZero(date.getMonth()+1, 2))
        format = format.replace("%dd", prefixZero(date.getDate(), 2))
        format = format.replace("%hh", prefixZero(date.getHours(), 2))
        format = format.replace("%mm", prefixZero(date.getMinutes(), 2))
        format = format.replace("%ss", prefixZero(date.getSeconds(), 2))

        format = format.replace("%y", date.getFullYear())
        format = format.replace("%M", date.getMonth()+1)
        format = format.replace("%d", date.getDate())
        format = format.replace("%h", date.getHours())
        format = format.replace("%m", date.getMinutes())
        format = format.replace("%s", date.getSeconds())
        return format
    }

    function blobToBase64(blob_data, callback) {
        let reader = new FileReader()
        reader.onload = function(e) {
            if (callback) {
                callback(e.target.result)
            }
        }
        reader.readAsDataURL(blob_data)
    }

    function toSaveVideo(video) {
        video.currentTime = 0
        video.play()
        let stream = video.captureStream()
        console.log('toSaveVideo.stream', stream)

        let video_recoder = new MediaRecorder(stream)
        // 如果 start 没设置 timeslice，ondataavailable 在 stop 时会触发
        let time_prefix = getTimeByStamp(getTimeStamp(), '%y%MM%dd%hh%mm')
        console.log('toSaveVideo.time_prefix', time_prefix)
        console.log('toSaveVideo.save_path', save_path)
        video_recoder.ondataavailable = (event)=>{    
            // console.log(event.data)
            blobToBase64(event.data, function(base64_data) {
                window.ipcRenderer.sendToHost('appendBlob', {
                    base64_data: base64_data,
                    type: event.data.type,
                    save_path: save_path+`/record${time_prefix}.mp4`,
                })
            })
            // appendBlob(event.data, save_path+`/record${time_prefix}.mp4`, function() {
            //     console.log('toSaveVideo.save video item success')
            // })
            // let blob = new Blob([event.data], {
            //     type: 'video/mp4',
            // });
            // saveMedia(blob);
        };
        video_recoder.onerror = err => {
            console.error(err);
        };
        video_recoder.start(10000)
        video.addEventListener('ended', function() {
            video_recoder.stop()
            console.log('toSaveVideo: record auto stop')
        })
    }

    function getFrameVideo(frame) {
        let the_document = frame.contentWindow.document
        let res = []
        let video_list = the_document.getElementsByTagName('video')
        if (video_list && video_list.length > 0) {
            for (let i = 0; i < video_list.length; i++) {
                res.push(video_list[i])
                // var inject_js = the_document.createElement('script')
                // inject_js.text = `(${toSaveVideo})("${video_list[i].src}");`
                // the_document.body.appendChild(inject_js)
            }
        }
        let frame_frame = the_document.getElementsByTagName('iframe')
        if (frame_frame) {
            for (let i = 0; i < frame_frame.length; i++) {
                let res2 = getFrameVideo(frame_frame[i])
                res = res.concat(res2)
            }
        }
        return res
    }
    let ans = []
    const video_list = document.getElementsByTagName('video')
    if (video_list && video_list.length > 0) {
        for (let i = 0; i < video_list.length; i++) {
            ans = ans.push(video_list[i])
        }
    }
    const frame_list = document.getElementsByTagName('iframe')
    if (frame_list) {
        for (let i = 0; i < frame_list.length; i++) {
            let res = getFrameVideo(frame_list[i])
            ans = ans.concat(res)
        }
    }
    console.log('toSaveVideo.video_list:', ans)
    if (ans && ans.length > 0) {
        toSaveVideo(ans[0])
    }
    return ans
}

class SaveVideoPage extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            download_url: '',
            download_url_text: '',
            valid_url_list: [],
            save_path: '',
        }

        this.text_change_func = {}
        this.handle_click_func = {}

        this.startDownload = this.startDownload.bind(this)
        this.startSave = this.startSave.bind(this)
        this.changeSavePath = this.changeSavePath.bind(this)
    }

    changeSavePath(path_list) {
        this.setState({
            save_path: path_list[0],
        })
    }

    handleTextChange(name) {
        if (!this.text_change_func[name]) {
            this.text_change_func[name] = (e)=>{
                this.setState({
                    [name]: e.target.value,
                })
            }
        }
        return this.text_change_func[name]
    }

    startDownload() {
        const { download_url_text } = this.state
        this.setState({
            download_url: download_url_text,
            valid_url_list: [],
        })
        // ipcRenderer.invoke('api-openwebview', [download_url_text]).then((res)=>{
        //     console.log(res)
        // })
    }

    startSave() {
        const { save_path } = this.state
        let the_save_path = save_path.replace(/\\/g, '/')
        console.log('the_save_path', the_save_path)
        console.log(this.refs.webview)
        // this.refs.webview.openDevTools()
        this.refs.webview.addEventListener('ipc-message', (event)=>{
            // console.log(event)
            const { channel, args } = event
            if (channel == 'appendBlob') {
                if (args && args[0]) {
                    const { base64_data, type, save_path } = args[0]
                    let the_blob = Tools.base64ToBlob(base64_data, type)
                    // console.log('SaveVideoPage.startSave:blob:', the_blob)
                    FileUtil.appendBlob(the_blob, save_path, ()=>{
                        console.log('SaveVideoPage.startSave:save blob success')
                    })
                }
            }
        })
        this.refs.webview.executeJavaScript(
            `
                const { ipcRenderer } = require("electron")
                window.ipcRenderer = ipcRenderer
                console.log(ipcRenderer)
            `
        ).then((result)=>{
            console.log(result)
        })
        this.refs.webview.executeJavaScript(`(${String(getVideoFunction)})("${the_save_path}");`).then((result)=>{
            console.log(result)
        })
    }

    renderInputArea() {
        const { download_url_text, save_path } = this.state

        return (
            <React.Fragment>
                <Box p={1} display='flex' flexDirection='column' >
                    <Typography>
                        视频网页地址：
                    </Typography>
                    <Box display='flex' >
                        <Box clone flexGrow={1} >
                        <TextField
                            value={download_url_text}
                            onChange={this.handleTextChange('download_url_text')}
                        /> 
                        </Box>
                        <Box clone ml={1} >
                        <Button variant='outlined' color='primary' onClick={this.startDownload} >
                            解析
                        </Button>
                        </Box>
                        <Box clone ml={1} >
                        <Button variant='outlined' color='primary' onClick={this.startSave} >
                            下载
                        </Button>
                        </Box>
                    </Box>
                </Box>
                <Box p={1} display='flex' flexDirection='column' >
                    <Typography>
                        设置保存路径：
                    </Typography>
                    <Box display='flex' >
                        <Box clone flexGrow={1} >
                        <TextField
                            value={save_path}
                            onChange={this.handleTextChange('save_path')}
                        /> 
                        </Box>
                        <Box clone ml={1} >
                        <DirectoryButton variant='outlined' color='primary' onChange={this.changeSavePath} >
                            选择
                        </DirectoryButton>
                        </Box>
                    </Box>
                </Box>
            </React.Fragment>
        )
    }

    renderWebArea() {
        const { download_url } = this.state
        return (
            <Box clone width={10} flexGrow={1} >
            <webview ref='webview'
                // src='https://www.qq.com/'
                // src='https://www.baidu.com/'
                // src='https://www.jiuzhangzaixian.com/'
                src={download_url}
                disablewebsecurity='true'
                nodeintegration='true'
                nodeintegrationinsubframes='true'
                webpreferences='allowRunningInsecureContent, webSecurity=no, contextIsolation=no'
                // preload={path.join(__dirname, 'preload.js')}
            >
            </webview>
            </Box>
        )
    }

    render() {
        return (
            <Box height='100%' display='flex' >
                <NavBar />
                <Box width={10} flexGrow={1}
                    display='flex' flexDirection='column'
                >
                    {this.renderInputArea()}
                    <Divider light />
                    <Box height={10} flexGrow={1} display='flex' >
                        {this.renderWebArea()}
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default withStyles(ui_styles)(SaveVideoPage);