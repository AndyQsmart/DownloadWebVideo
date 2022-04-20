import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles'
const { clipboard } = require('electron')
import DevelopTools from '../../common_js/DevelopTools';
import NavBar from '../../instance_component/NavBar/NavBar';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import OverflowBox from '../../common_component/box/OverflowBox';

const ui_styles = {
    url_text: {
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap'
    },
}

class DownloadVideoPage extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            download_url: '',
            download_url_text: '',
            valid_url_list: [],
        }

        this.text_change_func = {}
        this.handle_click_func = {}

        this.listenWebRequest = this.listenWebRequest.bind(this)
        this.clearRequestListen = this.clearRequestListen.bind(this)
        this.startDownload = this.startDownload.bind(this)
        this.tryAddUrl = this.tryAddUrl.bind(this)
    }

    handleClickItem(index) {
        if (!this.handle_click_func[index]) {
            this.handle_click_func[index] = ()=>{
                const { valid_url_list } = this.state
                clipboard.writeText(valid_url_list[index])
            }
        }
        return this.handle_click_func[index]
    }

    tryAddUrl(url) {
        const pure_url = url.split('?')[0]
        if (!/.jpg|.png|.gif|.so|.css|.js|.woff/i.test(pure_url)) {
            console.log(url)
        }
        if (!/.mp4|.m4s|.m3u8|.flv|.f4v/i.test(pure_url)) {
            return
        }
        const { valid_url_list } = this.state
        this.setState({
            valid_url_list: [
                ...valid_url_list,
                url,
            ]
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

    clearRequestListen() {
        let webview = this.refs.webview
        if (!webview || !webview.getWebContents) return
        let webContents = webview.getWebContents()
        const filter = {
            urls: ['*://*/*']
        }
        webContents.session.webRequest.onBeforeSendHeaders(filter, null)
        console.log('clear')
    }

    listenWebRequest() {
        let webview = this.refs.webview
        // webview.openDevTools()
        let webContents = webview.getWebContents()
        const filter = {
            urls: ['*://*/*']
        }
        console.log(webContents)
        webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            // details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
            // console.log(details)
            this.tryAddUrl(details.url)
            callback({ requestHeaders: details.requestHeaders })
        })
        DevelopTools.addReloadListener(this.clearRequestListen)
    }

    startDownload() {
        const { download_url_text } = this.state
        this.setState({
            download_url: download_url_text,
            valid_url_list: [],
        })
    }

    renderInputArea() {
        const { download_url_text } = this.state
        return (
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
                        提取
                    </Button>
                    </Box>
                </Box>
            </Box>
        )
    }

    renderShowUrlArea() {
        const { classes } = this.props
        const { valid_url_list } = this.state
        return (
            <OverflowBox
                width={10} flexGrow={1}
                borderLeft='1px solid #dddddd'
                display='flex' flexDirection='column'
            >
                <List >
                    {
                        valid_url_list.map((item, index)=>{
                            return (
                                <Tooltip key={index} title={'点击复制：'+item} >
                                    <ListItem button divider onClick={this.handleClickItem(index)} >
                                        <Typography className={classes.url_text} >
                                            {item}
                                        </Typography>
                                    </ListItem>
                                </Tooltip>
                            )
                        })
                    }
                </List>
            </OverflowBox>
        )
    }

    renderWebArea() {
        const { download_url } = this.state
        return (
            <Box clone width={10} flexGrow={1} >
            <webview ref='webview'
                onLoadStart={this.onLoadStart}
                // src='https://www.qq.com/'
                // src='https://www.baidu.com/'
                // src='https://www.jiuzhangzaixian.com/'
                src={download_url}
            >
            </webview>
            </Box>
        )
    }

    componentDidMount() {
        let webview = this.refs.webview
        webview.addEventListener('load-commit', this.listenWebRequest)
    }

    componentWillUnmount() {
        let webview = this.refs.webview
        webview.removeEventListener('load-commit', this.listenWebRequest)
        this.clearRequestListen()
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
                        {this.renderShowUrlArea()}
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default withStyles(ui_styles)(DownloadVideoPage);