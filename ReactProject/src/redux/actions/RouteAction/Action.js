import { ActionType } from './Type'

export function navigateTo(url, arg=null) {
    return ({
        type: ActionType.NAVIGATE_TO,
        data: {
            url,
            arg,
        }
    })
}

export function redirectTo(url, arg=null) {

}

export function navigateBack(fail_url, count=1) {

}
