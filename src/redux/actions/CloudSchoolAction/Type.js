import Tools from "../../../common_js/Tools";

const ActionType = {
    SET_GROUP_DATA: 'cloudschool0',
    SET_GROUP_LIST: 'cloudschool1',
    SET_KEY_WORD_GROUP_LIST: 'cloudschool2',
    SET_GROUP_ROOM_LIST: 'cloudschool3',
    SET_KEY_WORD_GROUP_ROOM_LIST: 'cloudschool4',
    DELETE_GROUP_ROOM_LIST: 'cloudschool5',
    DELETE_GROUP_LIST: 'cloudschool6',
    SET_ROOM_DATA: 'cloudschool7',
    SET_ROOM_COMMENT_LIST: 'cloudschool8',
    DELETE_ROOM_COMMENT_LIST: 'cloudschool9',
    DELETE_ROOM_DATA: 'cloudschool10',
    SET_OWN_ROOM_LIST: 'cloudschool11',
    SET_KEY_WORD_OWN_ROOM_LIST: 'cloudschool12',
    SET_ROOM_HISTORY_COURSE_LIST: 'cloudschool13',
    DELETE_ROOM_HISTORY_COURSE_LIST: 'cloudschool14',
    SET_HISTORY_COURSE_DATA: 'cloudschool15',
}

function setGroupData(old_state, action) {
    const { group_data } = old_state
    const { name, data } = action.data
    return {
        ...old_state,
        group_data: {
            ...group_data,
            [name]: data,
        }
    }
}

function setGroupList(old_state, action) {
    const {group_list} = old_state
    const {all_count, each_page_count, page_index, key_word} = action.data
    const new_group_list = action.data.group_list
    const {list} = group_list.list
    return {
        ...old_state,
        group_list: {
            ...group_list,
            list: {
                all_count: all_count,
                each_page_count: each_page_count,
                list: {
                    ...list,
                    [page_index]: new_group_list,
                }
            }
        }
    }
}

function setKeyWordGroupList(old_state, action) {
    const {group_list} = old_state
    const {all_count, each_page_count, page_index, key_word, group_list: new_group_list} = action.data
    if(group_list.key_word == key_word) {
        const {key_word_list} = group_list
        const {list} = key_word_list
        return {
            ...old_state,
            group_list: {
                ...group_list,
                key_word_list: {
                    all_count: all_count,
                    each_page_count: each_page_count,
                    list: {
                        ...list,
                        [page_index]: new_group_list,
                    }
                }
            }
        }
    }
    else {
        return {
            ...old_state,
            group_list: {
                ...group_list,
                key_word_list: {
                    all_count: all_count,
                    each_page_count: each_page_count,
                    list: {
                        [page_index]: new_group_list,
                    }
                },
                key_word: key_word,
            }
        }
    }
}

function setGroupRoomList(old_state, action) {
    const {group_room_list} = old_state
    const {group_name, all_count, each_page_count, page_index, key_word, group_room_list: new_group_room_list} = action.data
    let room_list = group_room_list[group_name]
    //处理group_room_list为{}
    if(!room_list) {
        room_list = default_room_list_item
    }
    const {list} = room_list.list
    return {
        ...old_state,
        group_room_list: {
            ...group_room_list,
            [group_name]: {
                ...room_list,
                list: {
                    all_count,
                    each_page_count,
                    list: {
                        ...list,
                        [page_index]: new_group_room_list,
                    }
                }
            }
        }
    }
}

function setKeyWordGroupRoomList(old_state, action) {
    const {group_room_list} = old_state
    const {group_name, all_count, each_page_count, page_index, key_word, group_room_list: new_group_room_list} = action.data
    let room_list = group_room_list[group_name]
    //处理group_room_list为{}
    if(!room_list) {
        room_list = default_room_list_item
    }
    const {list} = room_list.key_word_list
    if(key_word == room_list.key_word) {
        return {
            ...old_state,
            group_room_list: {
                ...group_room_list,
                [group_name]: {
                    ...room_list,
                    key_word_list: {
                        all_count,
                        each_page_count,
                        list: {
                            ...list,
                            [page_index]: new_group_room_list,
                        }
                    }
                }
            }
        }
    }
    else {
        return {
            ...old_state,
            group_room_list: {
                ...group_room_list,
                [group_name]: {
                    ...room_list,
                    key_word_list: {
                        all_count,
                        each_page_count,
                        list: {
                            [page_index]: new_group_room_list,
                        }
                    },
                    key_word: key_word,
                }
            }
        }
    }
}

function setOwnRoomList(old_state, action) {
    const { own_room_list } = old_state
    const { owner_name, all_count, each_page_count, page_index, key_word, own_room_list: new_own_room_list } = action.data
    let room_list = own_room_list[owner_name]
    //处理own_room_list为{}
    if (!room_list) {
        room_list = default_room_list_item
    }
    const { list } = room_list.list
    return {
        ...old_state,
        own_room_list: {
            ...own_room_list,
            [owner_name]: {
                ...room_list,
                list: {
                    all_count,
                    each_page_count,
                    list: {
                        ...list,
                        [page_index]: new_own_room_list,
                    }
                }
            }
        }
    }
}

function setKeyWordOwnRoomList(old_state, action) {
    const { own_room_list } = old_state
    const { owner_name, all_count, each_page_count, page_index, key_word, own_room_list: new_own_room_list } = action.data
    let room_list = own_room_list[owner_name]
    // 处理own_room_list为{}
    if (!room_list) {
        room_list = default_room_list_item
    }
    const { list } = room_list.key_word_list
    if (key_word == room_list.key_word) {
        return {
            ...old_state,
            own_room_list: {
                ...own_room_list,
                [owner_name]: {
                    ...room_list,
                    key_word_list: {
                        all_count,
                        each_page_count,
                        list: {
                            ...list,
                            [page_index]: new_own_room_list,
                        }
                    }
                }
            }
        }
    }
    else {
        return {
            ...old_state,
            own_room_list: {
                ...own_room_list,
                [owner_name]: {
                    ...room_list,
                    key_word_list: {
                        all_count,
                        each_page_count,
                        list: {
                            [page_index]: new_own_room_list,
                        }
                    },
                    key_word: key_word,
                }
            }
        }
    }
}

function deleteGroupRoomList(old_state, action) {
    const {group_room_list} = old_state
    const {group_name} = action.data
    return ({
        ...old_state,
        group_room_list: {
            ...group_room_list,
            [group_name]: null,
        }
    })
}

function deleteGroupList(old_state, action) {
    return ({
        ...old_state,
        group_list: {
            list: {
                list: {}
            },
            key_word_list: {
                list: {}
            },
            key_word: '',
        },
    })
}

function setRoomData(old_state, action) {
    const {room_data} = old_state
    const {id, data} = action.data
    return ({
        ...old_state,
        room_data: {
            ...room_data,
            [id]: data,
        }
    })
}

function setRoomCommentList(old_state, action) {
    const { room_comment_list } = old_state
    const { room_id, all_count, each_page_count, page_index, room_comment_list: new_room_comment_list } = action.data
    let the_room_comment_list = room_comment_list[room_id]
    if (!the_room_comment_list) {
        the_room_comment_list = default_room_comment_list_item
    }
    const { list: comment_list } = the_room_comment_list

    return ({
        ...old_state,
        room_comment_list: {
            ...room_comment_list,
            [room_id]: {
                all_count,
                each_page_count,
                list: {
                    ...comment_list,
                    [page_index]: new_room_comment_list,
                }
            },
        }
    })
}

function deleteRoomCommentList(old_state, action) {
    const { room_comment_list } = old_state
    const { room_id } = action.data
    return ({
        ...old_state,
        room_comment_list: {
            ...room_comment_list,
            [room_id]: null,
        }
    })
}

function deleteRoomData(old_state, action) {
    const {room_data} = old_state
    const {room_id} = action.data
    return ({
        ...old_state,
        room_data: {
            ...room_data,
            [room_id]: null,
        }
    })
}

function setHistoryCourseData(old_state, action) {
    const { room_history_course_data } = old_state
    const { id, data } = action.data
    return ({
        ...old_state,
        room_history_course_data: {
            ...room_history_course_data,
            [id]: data,
        }
    })
}

function setRoomHistoryCourseList(old_state, action) {
    const { room_history_course_list } = old_state
    const { room_id, all_count, each_page_count, page_index, room_history_course_list: new_room_history_course_list } = action.data
    let the_room_history_course_list = room_history_course_list[room_id]
    if (!the_room_history_course_list) {
        the_room_history_course_list = default_room_history_course_list_item
    }
    const { list: history_course_list } = the_room_history_course_list

    return ({
        ...old_state,
        room_history_course_list: {
            ...room_history_course_list,
            [room_id]: {
                all_count,
                each_page_count,
                list: {
                    ...history_course_list,
                    [page_index]: new_room_history_course_list,
                }
            },
        }
    })
}

function deleteRoomHistoryCourseList(old_state, action) {
    const { room_history_course_list } = old_state
    const { room_id } = action.data
    return ({
        ...old_state,
        room_history_course_list: {
            ...room_history_course_list,
            [room_id]: null,
        }
    })
}

// own_room_list = {
//     [user_name]: {
//         list: {
//             all_count: 0,
//             each_page_count: 1,
//             list: {
//                 [page_index]: list
//             },
//         },
//         key_word_list: {
//             room_list,
//         },
//         key_word: '',
//     }
// }

// group_room_list = {
//     [group_name]: {
//         list: {
//             all_count: 0,
//             each_page_count: 1,
//             list: {
//                 [page_index]: list
//             },
//         },
//         key_word_list: {
//             room_list,
//         },
//         key_word: '',
//     }
// }

// group_list = {
//     list: {
//         all_count: 0,
//         each_page_count: 1,
//         list: {
//             [page_index]: list
//         },
//     },
//     key_word_list: {
//         room_list,
//     },
//     key_word: '',
// }

// room_comment_list = {
//     [room_id]: {
//         list: {
//             [page_index]: list
//         },
//         all_count: 0,
//         each_page_count: 1,
//     }
// }

// room_history_course_list = {
//     [room_id]: {
//         list: {
//             [page_index]: list
//         },
//         all_count: 0,
//         each_page_count: 1,
//     }
// }

const default_room_list_item = {
    list: {
        list: {},
    },
    key_word_list: {
        list: {},
    },
    key_word: '',
}

const default_room_comment_list_item = {
    list: {},
}

const default_room_history_course_list_item = {
    list: {},
}

const defaultState = {
    group_data: {},
    group_list: {
        list: {
            list: {}
        },
        key_word_list: {
            list: {}
        },
        key_word: '',
    },
    group_room_list: {},
    own_room_list: {},
    room_data: {},
    room_comment_list: {},
    room_history_course_list: {},
    room_history_course_data: {},
}

function processor(state=defaultState, action) {
    switch (action.type) {
        case ActionType.SET_GROUP_DATA:
            return setGroupData(state, action)
        case ActionType.SET_GROUP_LIST:
            return setGroupList(state, action)
        case ActionType.SET_KEY_WORD_GROUP_LIST:
            return setKeyWordGroupList(state, action)
        case ActionType.SET_GROUP_ROOM_LIST:
            return setGroupRoomList(state, action)
        case ActionType.SET_KEY_WORD_GROUP_ROOM_LIST:
            return setKeyWordGroupRoomList(state, action)
        case ActionType.DELETE_GROUP_ROOM_LIST:
            return deleteGroupRoomList(state, action)
        case ActionType.DELETE_GROUP_LIST:
            return deleteGroupList(state, action)
        case ActionType.SET_ROOM_DATA:
            return setRoomData(state, action)
        case ActionType.SET_ROOM_COMMENT_LIST:
            return setRoomCommentList(state, action)
        case ActionType.DELETE_ROOM_COMMENT_LIST:
            return deleteRoomCommentList(state, action)
        case ActionType.DELETE_ROOM_DATA:
            return deleteRoomData(state, action)
        case ActionType.SET_OWN_ROOM_LIST:
            return setOwnRoomList(state, action)
        case ActionType.SET_KEY_WORD_OWN_ROOM_LIST:
            return setKeyWordOwnRoomList(state, action)
        case ActionType.SET_ROOM_HISTORY_COURSE_LIST:
            return setRoomHistoryCourseList(state, action)
        case ActionType.DELETE_ROOM_HISTORY_COURSE_LIST:
            return deleteRoomHistoryCourseList(state, action)
        case ActionType.SET_HISTORY_COURSE_DATA:
            return setHistoryCourseData(state, action)
        default:
            return state
    }
}

export default processor;
export { ActionType }