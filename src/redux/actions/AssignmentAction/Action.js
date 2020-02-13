import { ActionType } from './Type'
import Http from '../../../common_js/Http';
import { AssignmentOperation } from '../../../common_js/AssignmentUtil';
import Tools from '../../../common_js/Tools';

function setAssignmentData(assignment_id, assignment_data) {
    return ({
        type: ActionType.SET_ASSIGNMENT_DATA,
        data: {
            id: assignment_id,
            data: assignment_data,
        }
    })
}

export function deleteAssignmentData(assignment_id) {
    return ({
        type: ActionType.DELETE_ASSIGNMENT_DATA,
        data: {
            id: assignment_id,
        }
    })
}

function setReviewAssignmentData(assignment_id, review_assignment_data) {
    return ({
        type: ActionType.SET_REVIEW_ASSIGNMENT_DATA,
        data: {
            id: assignment_id,
            data: review_assignment_data,
        }
    })
}

function setAssignmentReviewsMap(assignment_id, review_assignment_ids) {
    return ({
        type: ActionType.SET_ASSIGNMENT_REVIEWS_MAP,
        data: {
            id: assignment_id,
            data: review_assignment_ids,
        }
    })
}

function setAssignmentReviewsData(assignment_id, review_assignment_list) {
    return ({
        type: ActionType.SET_ASSIGNMENT_REVIEWS_DATA,
        data: {
            id: assignment_id,
            review_assignment_list: review_assignment_list,
        }
    })
}

export function deleteAssignmentAndReviewData(assignment_id) {
    return ({
        type: ActionType.DELETE_ASSIGNMENT_AND_REVIEW_DATA,
        data: {
            id: assignment_id,
        }
    })
}

function setTestQuestionData(test_question_id, test_question_data) {
    return ({
        type: ActionType.SET_TEST_QUESTION_DATA,
        data: {
            id: test_question_id,
            data: test_question_data,
        }
    })
}

export function requestAssignmentData(assignment_id, call_back=null) {
    return (dispatch, getState) => {
        let state = getState()
        //判断需要去服务器请求
        let assignment_data = state.AssignmentAction.assignment_data
        if(!Tools.isNone(assignment_data[assignment_id])) {
            if(call_back) {
                call_back()
            }
            return
        }
        console.log('request-assignment-data')
        let arg = {
            cmd: AssignmentOperation.GET_ASSIGNMENT_BY_ID,
            data: {
                id: assignment_id
            }
        }
        Http.post(Tools.getUrl('/assignment-operation/'), arg, (data)=>{
            if (data.result_id == 0) {
                let assignment = data.message.assignment
                let test_question = assignment.test_question
                dispatch(setTestQuestionData(test_question.id, test_question))
                delete assignment.test_question
                let review_data = assignment.review_data
                dispatch(setAssignmentReviewsData(assignment_id, review_data))
                delete assignment.review_data
                assignment.test_question_id = test_question.id
                dispatch(setAssignmentData(assignment_id, assignment))
            }
            if(call_back) {
                call_back()
            }
        })
    }
}

//单题批阅获取信息，包括考试和教室考试
export function forceRequestExaminationAssignmentDataByAssignmentIdAndQuestionIndex(assignment_id, question_index, call_back=null) {
    return (dispatch, getState) => {
        let state = getState()
        //清除旧数据  作业、批阅、作业批阅关系表
        dispatch(deleteAssignmentAndReviewData(assignment_id))
        console.log('request-assignment-data')
        let arg = {
            cmd: AssignmentOperation.GET_DATA_BY_ASSIGNMENT_ID_AND_QUESTION_ITEM_INDEX,
            data: {
                assignment_id: assignment_id,
                question_item_index: question_index,
            }
        }
        Http.post(Tools.getUrl('/assignment-operation/'), arg, (data)=>{
            if (data.result_id == 0) {
                console.log(data.message)
                let assignment = data.message.assignment
                let test_question = assignment.test_question
                dispatch(setTestQuestionData(test_question.id, test_question))
                delete assignment.test_question
                let review_data = assignment.review_data
                dispatch(setAssignmentReviewsData(assignment_id, review_data))
                delete assignment.review_data
                assignment.test_question_id = test_question.id
                dispatch(setAssignmentData(assignment_id, assignment))
            }
            if(call_back) {
                call_back()
            }
        })
    }
}