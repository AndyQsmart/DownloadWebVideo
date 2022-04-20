import React from 'react';
import { connect } from 'react-redux';
import { ActionType } from './redux/actions/RouteAction/Type';
import ReduxHelper from './redux/ReduxHelper';
import HomePage from './pages/HomePage/HomePage';
import DownloadVideoPage from './pages/DownloadVideoPage/DownloadVideoPage';
import DownloadImagePage from './pages/DownloadImagePage/DownloadImagePage';
import SaveVideoPage from './pages/SaveVideoPage/SaveVideoPage';

const RouteMap = {
    '/': HomePage,
    '/download/downloadvideo': DownloadVideoPage,
    '/download/savevideo': SaveVideoPage,
    '/download/downloadimage': DownloadImagePage,
}

const _Router = (props) => {
    const { url_stack } = props
    const current_route = url_stack[url_stack.length-1]
    if (RouteMap[current_route.url]) {
        let Component = RouteMap[current_route.url]
        return <Component />
    }
    else {
        return null
    }
}

const Router = connect(
    (state)=>{
        const { url_stack } = state.RouteAction
        return {
            url_stack,
        }
    },
)(_Router);

class Routes {
    static navigateTo(url, arg=null) {
        ReduxHelper.getStore().dispatch({
            type: ActionType.NAVIGATE_TO,
            data: {
                url,
                arg,
            }
        })
    }

    static redirectTo(url, arg=null) {

    }

    static navigateBack(fail_url, count=1) {

    }
}

export default Routes;
export { Router };
