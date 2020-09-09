import { ActionType } from './Type'
import Http from '../../../common_js/Http';
import { CloudSchoolOperation } from '../../../common_js/CloudSchoolUtil';
import Tools from '../../../common_js/Tools';

function setGroupData(group_name, group_data) {
    return ({
        type: ActionType.SET_GROUP_DATA,
        data: {
            name: group_name,
            data: group_data,
        }
    })
}

function setGroupList(data) {
    return ({
        type: ActionType.SET_GROUP_LIST,
        data: data,
    })
}

function setKeyWordGroupList(data) {
    return ({
        type: ActionType.SET_KEY_WORD_GROUP_LIST,
        data: data,
    })
}

function setGroupRoomList(data) {
    return ({
        type: ActionType.SET_GROUP_ROOM_LIST,
        data: data,
    })
}

function setKeyWordGroupRoomList(data) {
    return ({
        type: ActionType.SET_KEY_WORD_GROUP_ROOM_LIST,
        data: data,
    })
}

function setOwnRoomList(data) {
    return ({
        type: ActionType.SET_OWN_ROOM_LIST,
        data: data,
    })
}

function setKeyWordOwnRoomList(data) {
    return ({
        type: ActionType.SET_KEY_WORD_OWN_ROOM_LIST,
        data: data,
    })
}

function deleteGroupRoomList(data) {
    return ({
        type: ActionType.DELETE_GROUP_ROOM_LIST,
        data: data,
    })
}

function deleteGroupList() {
    return ({
        type: ActionType.DELETE_GROUP_LIST,
    })
}

function setRoomData(room_id, room_data) {
    return ({
        type: ActionType.SET_ROOM_DATA,
        data: {
            id: room_id,
            data: room_data,
        }
    })
}

export function deleteRoomData(room_id) {
    return ({
        type: ActionType.DELETE_ROOM_DATA,
        data: {
            room_id: room_id,
        }
    })
}

export function requestGroupData(group_name, call_back=null) {
    return (dispatch, getState) => {
        let state = getState()
        //判断需要去服务器请求
        let group_data = state.CloudSchoolAction.group_data
        if(!Tools.isNone(group_data[group_name])) {
            if(call_back) {
                call_back({
                    result_id: 0,
                })
            }
            return
        }
        console.log('request-group-data')
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_GROUP_DATA,
            data: {
                name: group_name
            }
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if (data.result_id == 0) {
                let ans = data.message 
                dispatch(setGroupData(group_name, ans))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function createCloudGroup(data, call_back=null) {
    return (dispatch) => {
        let arg = {
            cmd: CloudSchoolOperation.CREATE_CLOUD_GROUP,
            data: {
                ...data,
            }
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if (data.result_id == 0) {
                let ans = data.message.cloud_group
                dispatch(setGroupData(ans.name, ans))
                dispatch(deleteGroupList())
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function editCloudGroup(data, call_back=null) {
    return (dispatch) => {
        let arg = {
            cmd: CloudSchoolOperation.EDIT_CLOUD_GROUP,
            data: {
                ...data,
            }
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if (data.result_id == 0) {
                let ans = data.message.cloud_group
                dispatch(setGroupData(ans.name, ans))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestKeyWordGroupList(request_data, call_back=null) {
    return (dispatch, getState) => {
        let state = getState()
        const COUNT_AT_EACH_REQUEST = 24
        const {page, key_word} = request_data
        //判断需要去服务器请求
        let group_list = state.CloudSchoolAction.group_list
        if(key_word == '') {
            let list = group_list.list.list
            if(!Tools.isNone(list[page])) {
                if(call_back) {
                    call_back({
                        result_id: 0,
                    })
                }
                return
            }
        }
        else {
            if(key_word == group_list.key_word) {
                let list = group_list.key_word_list.list
                if(!Tools.isNone(list[page])) {
                    if(call_back) {
                        call_back({
                            result_id: 0,
                        })
                    }
                    return
                }
            }
        }
        console.log('request-group-list')
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_GROUP_LIST_BY_KEY_WORD,
            data: {
                key_word: key_word,
                index_from: page*COUNT_AT_EACH_REQUEST,
                index_to: (page+1)*COUNT_AT_EACH_REQUEST,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                let message = data.message
                const {cloud_group_list, all_count} = message
                if(key_word == '') {
                    dispatch(setGroupList({
                        all_count,
                        each_page_count: COUNT_AT_EACH_REQUEST,
                        page_index: page,
                        group_list: cloud_group_list,
                        key_word,
                    }))
                }
                else {
                    dispatch(setKeyWordGroupList({
                        all_count,
                        each_page_count: COUNT_AT_EACH_REQUEST,
                        page_index: page,
                        group_list: cloud_group_list,
                        key_word,
                    }))
                }
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestKeyWordOwnRoomList(request_data, call_back=null) {
    return (dispatch, getState) => {
        const COUNT_AT_EACH_REQUEST = 24
        const { page, key_word: the_key_word, owner_name } = request_data
        const key_word = Tools.isNone(the_key_word) ? '' : the_key_word

        const redux_state = getState()
        const { own_room_list } = redux_state.CloudSchoolAction
        if (own_room_list[owner_name]) {
            const the_own_room_list = own_room_list[owner_name]
            if (key_word == '') {
                const room_list = the_own_room_list.list
                if (room_list.list[page]) {
                    if (call_back) {
                        call_back({
                            result_id: 0,
                        }, Math.ceil(room_list.all_count/room_list.each_page_count)-1 == page)
                    }
                    return
                }
            }
            else if (key_word == the_own_room_list.key_word) {
                const room_list = the_own_room_list.key_word_list
                if (room_list.list[page]) {
                    if (call_back) {
                        call_back({
                            result_id: 0,
                        }, Math.ceil(room_list.all_count/room_list.each_page_count)-1 == page)
                    }
                    return
                }
            }
        }

        console.log('request-own-room-list')
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_ROOM_BY_OWNER_NAME_AND_KEY_WORD,
            data: {
                key_word: key_word,
                owner_name: owner_name,
                index_from: page*COUNT_AT_EACH_REQUEST,
                index_to: (page+1)*COUNT_AT_EACH_REQUEST,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                let message = data.message
                const { cloud_room_list, all_count } = message
                if (key_word == '') {
                    dispatch(setOwnRoomList({
                        owner_name,
                        all_count,
                        each_page_count: COUNT_AT_EACH_REQUEST,
                        page_index: page,
                        own_room_list: cloud_room_list,
                        key_word,
                    }))
                }
                else {
                    dispatch(setKeyWordOwnRoomList({
                        owner_name,
                        all_count,
                        each_page_count: COUNT_AT_EACH_REQUEST,
                        page_index: page,
                        own_room_list: cloud_room_list,
                        key_word,
                    }))
                }
                if (call_back) {
                    call_back(data, cloud_room_list.length < COUNT_AT_EACH_REQUEST)
                }
            }
            else {
                if (call_back) {
                    call_back(data)
                }
            }
        })
    } 
}

export function requestKeyWordGroupRoomList(request_data, call_back=null) {
    return (dispatch, getState) => {
        const COUNT_AT_EACH_REQUEST = 24
        const {page, key_word: the_key_word, group_name} = request_data
        let key_word = Tools.isNone(the_key_word) ? '' : the_key_word

        const redux_state = getState()
        const { group_room_list } = redux_state.CloudSchoolAction
        if (group_room_list[group_name]) {
            let the_group_room_list = group_room_list[group_name]
            if (key_word == '') {
                let room_list = the_group_room_list.list
                if (room_list.list[page]) {
                    call_back({
                        result_id: 0,
                    }, Math.ceil(room_list.all_count/room_list.each_page_count)-1 == page)
                    return
                }
            }
            else if (key_word == the_group_room_list.key_word) {
                let room_list = the_group_room_list.key_word_list
                if (room_list.list[page]) {
                    call_back({
                        result_id: 0,
                    }, Math.ceil(room_list.all_count/room_list.each_page_count)-1 == page)
                    return
                }
            }
        }

        console.log('request-group-room-list')
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_ROOM_BY_GROUP_NAME_AND_KEY_WORD,
            data: {
                key_word: key_word,
                group_name: group_name,
                index_from: page*COUNT_AT_EACH_REQUEST,
                index_to: (page+1)*COUNT_AT_EACH_REQUEST,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                let message = data.message
                const {cloud_room_list, all_count} = message
                if(key_word == '') {
                    dispatch(setGroupRoomList({
                        group_name,
                        all_count,
                        each_page_count: COUNT_AT_EACH_REQUEST,
                        page_index: page,
                        group_room_list: cloud_room_list,
                        key_word,
                    }))
                }
                else {
                    dispatch(setKeyWordGroupRoomList({
                        group_name,
                        all_count,
                        each_page_count: COUNT_AT_EACH_REQUEST,
                        page_index: page,
                        group_room_list: cloud_room_list,
                        key_word,
                    }))
                }
                if(call_back) {
                    call_back(data, cloud_room_list.length < COUNT_AT_EACH_REQUEST)
                }
            }
            else {
                if(call_back) {
                    call_back(data)
                }
            }
        })
    }
}

export function requestBatchDeleteCloudRoomFromGroup(request_data, call_back=null) {
    return (dispatch) => {
        // const {delete_type, cloud_room_id_list, group_name} = request_data
        let arg = {
            cmd: CloudSchoolOperation.BATCH_DELETE_CLOUD_ROOM_FROM_GROUP,
            data: request_data,
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                // let message = data.message
                // let delete_id_list = message.delete_id_list
                dispatch(deleteGroupRoomList({
                    group_name: request_data.group_name,
                }))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestBatchAddCloudRoomToGroup(request_data, call_back=null) {
    return (dispatch) => {
        // const {cloud_room_id_list, group_name} = request_data
        let arg = {
            cmd: CloudSchoolOperation.BATCH_ADD_CLOUD_ROOM_TO_GROUP,
            data: request_data,
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteGroupRoomList({
                    group_name: request_data.group_name,
                }))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestCeateCloudRoomToGroup(request_data, call_back=null) {
    return (dispatch) => {
        // const {cloud_room_name, cover_image, group_name} = request_data
        let arg = {
            cmd: CloudSchoolOperation.CREATE_CLOUD_ROOM_TO_GROUP,
            data: request_data,
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteGroupRoomList({
                    group_name: request_data.group_name,
                }))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestBatchEditCloudRoomFromGroup(request_data, call_back=null) {
    return (dispatch) => {
        // const {edit_cloud_room_list, group_name} = request_data
        let arg = {
            cmd: CloudSchoolOperation.BATCH_EDIT_CLOUD_ROOM_FROM_GROUP,
            data: request_data,
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteGroupRoomList({
                    group_name: request_data.group_name,
                }))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestBatchDeleteCloudGroup(data, call_back=null) {
    return (dispatch) => {
        // const {edit_cloud_room_list, group_name} = request_data
        let arg = {
            cmd: CloudSchoolOperation.BATCH_DELETE_CLOUD_GROUP,
            data: data,
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteGroupList())
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestRoomDataWithInvitationCode(room_id, invitation_code, call_back=null) {
    return (dispatch, getState) => {
        let state = getState()
        //判断要去服务器请求
        let room_data = state.CloudSchoolAction.room_data
        if(!Tools.isNone(room_data[room_id])) {
            if(call_back) {
                call_back({
                    result_id: 0,
                })
            }
            return
        }
        console.log('request-room-data')
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_ROOM_DATA,
            data: {
                cloud_room_id: room_id,
                invitation_code,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                const cloud_room = data.message.cloud_room
                dispatch(setRoomData(room_id, cloud_room))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestRoomData(room_id, call_back=null) {
    return (dispatch, getState) => {
        let state = getState()
        //判断要去服务器请求
        let room_data = state.CloudSchoolAction.room_data
        if(!Tools.isNone(room_data[room_id])) {
            if(call_back) {
                call_back({
                    result_id: 0,
                })
            }
            return
        }
        console.log('request-room-data')
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_ROOM_DATA,
            data: {
                cloud_room_id: room_id,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                const cloud_room = data.message.cloud_room
                dispatch(setRoomData(room_id, cloud_room))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

export function requestEditCloudRoom(request_data, call_back=null) {
    return (dispatch, getState) => {
        // let {cloud_room_id, name, cover_image, notice, access_permission, owner_user_name, online_class_id, cloud_group_name} = request_data
        const redux_state = getState()
        const { room_data } = redux_state.CloudSchoolAction
        const cloud_room = room_data[request_data.cloud_room_id]

        let arg = {
            cmd: CloudSchoolOperation.EDIT_CLOUD_ROOM,
            data: request_data,
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                const new_cloud_room = data.message.cloud_room
                dispatch(setRoomData(new_cloud_room.id, new_cloud_room))
                dispatch(deleteGroupRoomList({
                    group_name: request_data.cloud_group_name,
                }))
                // if (cloud_room.group_name && cloud_room.group_name != request_data.cloud_group_name) {
                //     dispatch(deleteGroupRoomList({
                //         group_name: cloud_room.group_name,
                //     }))
                // }
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

function setRoomCommentList(data) {
    return ({
        type: ActionType.SET_ROOM_COMMENT_LIST,
        data,
    })
}

export function requestRoomCommentList(room_id, page, call_back=null) {
    return (dispatch, getState) => {
        const redux_state = getState()
        const { room_comment_list } = redux_state.CloudSchoolAction
        if (room_comment_list[room_id]) {
            let comment_list = room_comment_list[room_id]
            if (comment_list.list[page]) {
                call_back({
                    result_id: 0,
                }, Math.ceil(comment_list.all_count/comment_list.each_page_count)-1 == page)
                return
            } 
        }

        const COUNT_AT_EACH_REQUEST = 24
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_ROOM_COMMENTS,
            data: {
                room_id: room_id,
                index_from: page*COUNT_AT_EACH_REQUEST,
                index_to: (page+1)*COUNT_AT_EACH_REQUEST,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                console.log(data)
                let ans = data.message
                const { all_count, comment_list } = ans
                dispatch(setRoomCommentList({
                    room_id,
                    all_count,
                    each_page_count: COUNT_AT_EACH_REQUEST,
                    page_index: page,
                    room_comment_list: comment_list,
                }))
                if(call_back) {
                    call_back(data, comment_list.length < COUNT_AT_EACH_REQUEST)
                }
            }
            else {
                if(call_back) {
                    call_back(data)
                }
            }
        })
    }
}

function deleteRoomCommentList(room_id) {
    return ({
        type: ActionType.DELETE_ROOM_COMMENT_LIST,
        data: {
            room_id,
        }
    })
}

export function requestCreateRoomComment(room_id, comment_text, call_back=null) {
    return (dispatch) => {
        let arg = {
            cmd: CloudSchoolOperation.CREATE_CLOUD_ROOM_COMMENT,
            data: {
                room_id,
                content: comment_text,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteRoomCommentList(room_id))
            }
            if (call_back) {
                call_back(data)
            }
        })
    }
}

export function requestCreateAliyunLiveAddress(request_data, call_back=null) {
    // const {cloud_room_id, start_now, start_time_stamp, during_time_stamp} = request_data
    return (dispatch) => {
        let arg = {
            cmd: CloudSchoolOperation.CREATE_ALIYUN_LIVE_ADDRESS,
            data: request_data,
        }
        console.log(arg)
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteRoomData(request_data.cloud_room_id))
            }
            if (call_back) {
                call_back(data)
            }
        })
    }
}

export function deleteRoomHistoryCourseList(room_id) {
    return ({
        type: ActionType.DELETE_ROOM_HISTORY_COURSE_LIST,
        data: {
            room_id
        },
    })
}

export function requestCreateCloudRoomHistoryCourse(request_data, call_back=null) {
    return (dispatch) => {
        let arg = {
            cmd: CloudSchoolOperation.CREATE_CLOUD_ROOM_HISTORY_COURSE,
            data: request_data,
        }
        console.log(arg)
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteRoomHistoryCourseList(request_data.room_id))
            }
            if (call_back) {
                call_back(data)
            }
        })
    }
}

export function requestEditCloudRoomHistoryCourse(request_data, call_back=null) {
    return (dispatch) => {
        let arg = {
            cmd: CloudSchoolOperation.EDIT_CLOUD_ROOM_HISTORY_COURSE_DATA,
            data: request_data,
        }
        console.log(arg)
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(setHistoryCourseData(request_data.id, null))
            }
            if (call_back) {
                call_back(data)
            }
        })
    }
}

function setRoomHistoryCourseList(data) {
    return ({
        type: ActionType.SET_ROOM_HISTORY_COURSE_LIST,
        data,
    })
}

export function requestRoomHistoryCourseList(room_id, page, call_back=null) {
    return (dispatch, getState) => {
        const redux_state = getState()
        const { room_history_course_list } = redux_state.CloudSchoolAction
        if (room_history_course_list[room_id]) {
            let course_list = room_history_course_list[room_id]
            if (course_list.list[page]) {
                if (call_back) {
                    call_back({
                        result_id: 0,
                    }, Math.ceil(course_list.all_count/course_list.each_page_count)-1 == page)
                }
                return
            } 
        }

        const COUNT_AT_EACH_REQUEST = 24
        let arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_ROOM_HISTORY_COURSE,
            data: {
                room_id: room_id,
                index_from: page*COUNT_AT_EACH_REQUEST,
                index_to: (page+1)*COUNT_AT_EACH_REQUEST,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                console.log(data)
                let ans = data.message
                const { all_count, history_course_list } = ans
                dispatch(setRoomHistoryCourseList({
                    room_id,
                    all_count,
                    each_page_count: COUNT_AT_EACH_REQUEST,
                    page_index: page,
                    room_history_course_list: history_course_list,
                }))
                if(call_back) {
                    call_back(data, history_course_list.length < COUNT_AT_EACH_REQUEST)
                }
            }
            else {
                if(call_back) {
                    call_back(data)
                }
            }
        })
    }
}

export function requestBatchDeleteHistoryCourseFromRoom(request_data, call_back=null) {
    return (dispatch) => {
        let arg = {
            cmd: CloudSchoolOperation.DELETE_CLOUD_ROOM_HISTORY_COURSE,
            data: request_data,
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                dispatch(deleteRoomHistoryCourseList(request_data.room_id))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}

function setHistoryCourseData(course_id, course_data) {
    return ({
        type: ActionType.SET_HISTORY_COURSE_DATA,
        data: {
            id: course_id,
            data: course_data,
        }
    })
}

export function requestHistoryCourseData(course_id, call_back=null) {
    return (dispatch, getState) => {
        const state = getState()
        //判断需要去服务器请求
        const course_data = state.CloudSchoolAction.room_history_course_data
        if(!Tools.isNone(course_data[course_id])) {
            if(call_back) {
                call_back({
                    result_id: 0,
                })
            }
            return
        }
        const arg = {
            cmd: CloudSchoolOperation.GET_CLOUD_ROOM_HISTORY_COURSE_DATA,
            data: {
                id: course_id,
            },
        }
        Http.post(Tools.getUrl('/cloudschool-operation/'), arg, (data)=>{
            if(data.result_id == 0) {
                const ans = data.message
                dispatch(setHistoryCourseData(course_id, ans))
            }
            if(call_back) {
                call_back(data)
            }
        })
    }
}