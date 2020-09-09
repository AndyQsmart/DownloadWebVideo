import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles'
import { clipboard } from 'electron'
import DevelopTools from '../../common_js/DevelopTools';
import NavBar from '../../instance_component/NavBar/NavBar';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Tooltip from '@material-ui/core/Tooltip'
import OverflowBox from '../../common_component/box/OverflowBox';
import DirectoryButton from '../../common_component/button/DirectoryButton';
import Tools from '../../common_js/Tools';
import ImageCompress from '../../common_component/image_compress/ImageCompress';
import iziToast from '../../common_component/toast/iziToast';
import CircularProgress from '@material-ui/core/CircularProgress'
import Color from '../../common_js/Color';
import Box from '@material-ui/core/Box'
import FileUtil from '../../common_js/FileUtil';

const ui_styles = {
    url_text: {
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap'
    },
}

function getImageDom() {
    var ans = window.document.getElementsByTagName('img')
    var image_list = []
    for (let i = 0; i < ans.length; i++) {
        image_list.push(ans[i].src)
    }
    return image_list
}

class DownloadImagePage extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            download_url: '',
            download_url_text: '',
            save_url_text: '',
            show_loading: false,
            all_file: 0,
            done_file: 0,
        }

        this.text_change_func = {}
        this.handle_click_func = {}

        this.getImageTagUrl = this.getImageTagUrl.bind(this)
        this.setWebUrl = this.setWebUrl.bind(this)
        this.selectSavePath = this.selectSavePath.bind(this)
    }

    selectSavePath(paths) {
        if (paths.length > 0) {
            this.setState({
                save_url_text: paths[0],
            })
        }
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

    getImageTagUrl() {
        const { download_url, save_url_text: the_save_url_text } = this.state
        if (download_url == '') {
            iziToast.warning({
                title: '提示',
                message: '请先加载网页',
            })
            return
        }
        if (the_save_url_text == '') {
            iziToast.warning({
                title: '提示',
                message: '请选择保存位置',
            })
            return
        }
        let webview = this.refs.webview
        let exe_str = '('+String(getImageDom)+')()'
        webview.executeJavaScript(exe_str, true).then((result) => {
            const save_url_text = the_save_url_text[the_save_url_text.length-1] == '/' ? the_save_url_text : the_save_url_text+'/'

            let done_file = 0
            let fail_file = 0
            for (let i = 0; i < result.length; i++) {
                this.refs.image_compress.compressUrl(result[i]).then((file)=>{
                    FileUtil.saveBlob(
                        file,
                        save_url_text+i+'.png',
                        ()=>{
                            done_file += 1
                            this.setState({
                                done_file,
                            })
                            if (done_file == result.length) {
                                iziToast.success({
                                    title: '成功',
                                    message: '图片下载成功',
                                })
                                this.setState({
                                    show_loading: false,
                                })
                            }
                        }
                    )
                }).catch(()=>{
                    done_file += 1
                    fail_file += 1
                    this.setState({
                        done_file,
                    })
                    if (done_file == result.length) {
                        iziToast.success({
                            title: '成功',
                            message: '图片下载成功',
                        })
                        this.setState({
                            show_loading: false,
                        })
                    }
                })
            }

            this.setState({
                show_loading: true,
                all_file: result.length,
                done_file: 0,
            })
        })
    }

    setWebUrl() {
        const { download_url_text } = this.state
        this.setState({
            download_url: download_url_text,
        })
    }

    renderInputArea() {
        const { download_url_text, save_url_text } = this.state
        return (
            <Box p={1} display='flex' flexDirection='column' >
                <Typography>
                    图片网页地址：
                </Typography>
                <Box display='flex' >
                    <Box clone flexGrow={1} >
                    <TextField
                        value={download_url_text}
                        onChange={this.handleTextChange('download_url_text')}
                    /> 
                    </Box>
                    <Box clone ml={1} >
                    <Button variant='outlined' color='primary' onClick={this.setWebUrl} >
                        加载
                    </Button>
                    </Box>
                </Box>
                <Box display='flex' mt={1} >
                    <Box clone flexGrow={1} >
                    <TextField
                        value={save_url_text}
                        onChange={this.handleTextChange('save_url_text')}
                    /> 
                    </Box>
                    <Box clone ml={1} >
                    <DirectoryButton variant='outlined' color='primary' onChange={this.selectSavePath} >
                        路径
                    </DirectoryButton>
                    </Box>
                </Box>
                <Box display='flex' mt={1} >
                    <Box flexGrow={1} >
                    </Box>
                    <Box clone ml={1} >
                    <Button variant='outlined' color='primary' onClick={this.getImageTagUrl} >
                        保存
                    </Button>
                    </Box>
                </Box>
            </Box>
        )
    }

    renderWebArea() {
        const { download_url } = this.state
        return (
            <Box clone width={10} flexGrow={1} >
            <webview ref='webview'
                src={download_url}
            >
            </webview>
            </Box>
        )
    }

    renderLoading() {
        const { show_loading, all_file, done_file } = this.state
        if (!show_loading) {
            return null
        }

        return (
            <Box position='fixed' top={0} bottom={0} left={0} right={0}
                display='flex' flexDirection='column'
                alignItems='center' justifyContent='center'
                bgcolor='rgba(0,0,0,0.5)'
            >
                <CircularProgress variant="static" value={parseInt(done_file/all_file*100)} />
                <Box clone mt={1} color={Color.white} >
                <Typography>
                    已下载{done_file}个文件，共{all_file}个文件...
                </Typography>
                </Box>
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
                <ImageCompress ref='image_compress' />
                {this.renderLoading()}
            </Box>
        );
    }
}

export default withStyles(ui_styles)(DownloadImagePage);