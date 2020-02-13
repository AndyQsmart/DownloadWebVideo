import { ActionType } from './Type'
import { UserOperation } from '../../../common_js/UserUtil';
import Http from '../../../common_js/Http';
import Tools from '../../../common_js/Tools';

export function changeAvatar(data) {
    return ({
        type: ActionType.CHANGE_AVATAR,
        data
    })
}

export function changeCurrentUserInfo(user_name, data) {
    return ({
        type: ActionType.CHANGE_CURRENT_USER_INFO,
        data: {
            user_name,
            data,
        }
    })
}

export function login(user_name, password, call_back) {
    return (dispatch) => {
        let arg = {
            cmd: UserOperation.USER_LOGIN,
            data: {
                user_name,
                password,
            }
        }
        Http.post(Tools.getUrl('/user-operation/'), arg, (data)=>{
            if (data.result_id == 0) {
                let ans = data.message 
                console.log(ans)
                dispatch(changeCurrentUserInfo(user_name, ans))
                dispatch(changeAvatar({
                    avatar_url: ans.user_ext_info.avatar
                }))
                Http.loginInRedux(user_name, data)
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function logout(call_back) {
    return (dispatch) => {
        let arg = {
            cmd: UserOperation.USER_LOGOUT,
        }
        Http.post(Tools.getUrl('/user-operation/'), arg, (data)=>{
            if (data.result_id == 0) {
                let ans = data.message 
                console.log(ans)
                dispatch(changeCurrentUserInfo(null))
                Http.logoutInRedux()
                if(call_back) {
                    call_back()
                }
            }
        })
    }
}