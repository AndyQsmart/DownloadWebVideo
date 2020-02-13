import Tools from "../../../common_js/Tools"

const ActionType = {
    NAVIGATE_TO: 'route0',
}

function navigateTo(old_state, action) {
    const { url_stack } = old_state
    const { url, arg } = action.data
    const new_state = {
        ...old_state,
        url_stack: [
            ...url_stack,
            {
                url,
                arg,
            },
        ],
    }
    Tools.setPermanentStorageArg('_route_cache', new_state)
    return new_state
}

const cache_route = Tools.getPermanentStorageArg('_route_cache')

const defaultState = cache_route ? cache_route : {
    url_stack: [
        {
            url: '/', arg: null,
        }
    ],
}

function processor(state=defaultState, action) {
    switch (action.type) {
        case ActionType.NAVIGATE_TO:
            return navigateTo(state, action)
        default:
            return state
    }
}

export default processor;
export { ActionType }