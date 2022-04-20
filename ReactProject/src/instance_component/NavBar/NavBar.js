import React, { PureComponent } from 'react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Icon from '../../common_component/icon/FontAwesome';
import Routes from '../../Routes';
import Color from '../../common_js/Color';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

const js_style = {
    icon: {
        marginRight: 10,
    },
    list_item: {
        color: Color.white,
    },
}

class NavBar extends PureComponent {
    goHomePage() {
        Routes.navigateTo('/')
    }

    goDownloadImagePage() {
        Routes.navigateTo('/download/downloadimage')
    }

    goDownloadVideoPage() {
        Routes.navigateTo('/download/downloadvideo')
    }

    goSaveVideoPage() {
        Routes.navigateTo('/download/savevideo')
    }

    render() {
        return (
            <Box clone width={200}
                // borderRight='1px solid #dddddd'
                bgcolor={Color.primary}
            >
            <Paper square >
                <List >
                    <ListItem button style={js_style.list_item} onClick={this.goHomePage} >
                        <Icon style={js_style.icon}
                            name='home'
                        />
                        <Typography>
                            主页
                        </Typography>
                    </ListItem>
                    <ListItem button style={js_style.list_item} onClick={this.goDownloadImagePage} >
                        <Icon style={js_style.icon}
                            name='cloud-download'
                        />
                        <Typography>
                            图片提取
                        </Typography>
                    </ListItem>
                    <ListItem button style={js_style.list_item} onClick={this.goDownloadVideoPage} >
                        <Icon style={js_style.icon}
                            name='cloud-download'
                        />
                        <Typography>
                            视频提取
                        </Typography>
                    </ListItem>
                    <ListItem button style={js_style.list_item} onClick={this.goSaveVideoPage} >
                        <Icon style={js_style.icon}
                            name='cloud-download'
                        />
                        <Typography>
                            视频下载
                        </Typography>
                    </ListItem>
                </List>
                <Divider />
            </Paper>
            </Box>
        );
    }
}

export default NavBar;