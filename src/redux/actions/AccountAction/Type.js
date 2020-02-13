const ActionType = {
    CHANGE_AVATAR: 'account0',
    CHANGE_CURRENT_USER_INFO: 'account1',
}

function changeAvatar(old_state, action) {
    return {
        ...old_state,
        avatar_url: action.data.avatar_url,
    }
}

function changeCurrentUserInfo(old_state, action) {
    const { user_info_data } = old_state
    const { user_name, data } = action.data
    if (!user_name) {
        return {
            ...old_state,
            current_user_name: null,
        }
    }
    return {
        ...old_state,
        current_user_name: user_name,
        user_info_data: {
            ...user_info_data,
            [user_name]: data,
        }
    }
}

const defaultState = {
    avatar_url: null,
    current_user_name: null,
    user_info_data: {},
}
function processor(state=defaultState, action) {
    switch (action.type) {
        case ActionType.CHANGE_AVATAR:
            return changeAvatar(state, action)
        case ActionType.CHANGE_CURRENT_USER_INFO:
            return changeCurrentUserInfo(state, action)
        default:
            return state
    }
}

export default processor;
export { ActionType }