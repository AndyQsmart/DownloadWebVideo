import { TestQuestionAttribute } from "../../../common_js/AssignmentUtil"
import Tools from "../../../common_js/Tools"
import { DataUtil } from "../../../pages/AssignmentPage/AssignmentComponent/Core/DataTools"

const ActionType = {
    SET_ASSIGNMENT_DATA: 'assignment0',
    SET_REVIEW_ASSIGNMENT_DATA: 'assignment1',
    SET_ASSIGNMENT_REVIEWS_MAP: 'assignment2',    //设置作业的批阅映射表
    SET_ASSIGNMENT_REVIEWS_DATA: 'assignment3',   //同时设置作业的批阅和批阅映射表
    SET_TEST_QUESTION_DATA: 'assignment4',
    DELETE_ASSIGNMENT_DATA: 'assignment5',
    DELETE_ASSIGNMENT_AND_REVIEW_DATA: 'assignment6',    //删除作业和其批阅信息（包括映射表）

}

function setAssignmentData(old_state, action) {
    const { assignment_data } = old_state
    const { id, data } = action.data
    data.image = JSON.parse(data.image)
    data.image = DataUtil.decodeImageRotate(data.image)
    try {
        data.some_answer = JSON.parse(data.some_answer)
    }
    catch (e) {
        data.some_answer = {}
    }
    return {
        ...old_state,
        assignment_data: {
            ...assignment_data,
            [id]: data,
        }
    }
}

function deleteAssignmentData(old_state, action) {
    const { assignment_data } = old_state
    const { id } = action.data
    let new_assignment_data = {...assignment_data}
    delete new_assignment_data[id]
    return {
        ...old_state,
        assignment_data: {
            ...new_assignment_data,
        }
    }
}

function setReviewAssignmentData(old_state, action) {
    const { review_assignment_data } = old_state
    const { id, data } = action.data
    return {
        ...old_state,
        review_assignment_data: {
            ...review_assignment_data,
            [id]: data,
        }
    }
}

function setAssignmentReviewsMap(old_state, action) {
    const { assignment_reviews_map } = old_state
    const { id, data } = action.data
    return {
        ...old_state,
        assignment_reviews_map: {
            ...assignment_reviews_map,
            [id]: data,
        }
    }
}

function setAssignmentReviewsData(old_state, action) {
    const { assignment_reviews_map, review_assignment_data } = old_state
    const { id, review_assignment_list } = action.data
    let review_ids = []
    let new_review_assignment_data = {}
    for (let i = 0; i < review_assignment_list.length; i++) {
        let review_data = review_assignment_list[i]
        review_ids.push(review_data.id)
        new_review_assignment_data[review_data.id] = review_data
    }
    return {
        ...old_state,
        assignment_reviews_map: {
            ...assignment_reviews_map,
            [id]: review_ids,
        },
        review_assignment_data: {
            ...review_assignment_data,
            ...new_review_assignment_data,
        }
    }
}

function deleteAssignmentAndReviewData(old_state, action) {
    const { assignment_data, assignment_reviews_map, review_assignment_data } = old_state
    const { id } = action.data
    //删除作业信息
    let new_assignment_data = {...assignment_data}
    delete new_assignment_data[id]
    //删除映射表信息
    let new_assignment_reviews_map = {...assignment_reviews_map}
    let review_ids = new_assignment_reviews_map[id]
    delete new_assignment_reviews_map[id]
    //删除批阅
    let new_review_assignment_data = {...review_assignment_data}
    if (!Tools.isNone(review_ids)) {
        for (let i = 0; i < review_ids.length; i++) {
            let review_id = review_ids[i]
            delete new_review_assignment_data[review_id]
        }
    }
    return {
        ...old_state,
        assignment_data: {
            ...new_assignment_data
        },
        assignment_reviews_map: {
            ...new_assignment_reviews_map
        },
        review_assignment_data: {
            ...new_review_assignment_data,
        }
    }
}

function setTestQuestionData(old_state, action) {
    const { test_question_data } = old_state
    const { id, data } = action.data
    data.question_score = JSON.parse(data.question_score)
    if (data.question_attribute == TestQuestionAttribute.QUESTION_FILES) {
        data.file_question_meta = JSON.parse(data.file_question_meta)
    }
    return {
        ...old_state,
        test_question_data: {
            ...test_question_data,
            [id]: data,
        }
    }
}

const defaultState = {
    assignment_data: {},
    review_assignment_data: {},
    test_question_data: {},
    assignment_reviews_map: {},
}

function processor(state=defaultState, action) {
    switch (action.type) {
        case ActionType.SET_ASSIGNMENT_DATA:
            return setAssignmentData(state, action)
        case ActionType.SET_REVIEW_ASSIGNMENT_DATA:
            return setReviewAssignmentData(state, action)
        case ActionType.SET_ASSIGNMENT_REVIEWS_MAP:
            return setAssignmentReviewsMap(state, action)
        case ActionType.SET_ASSIGNMENT_REVIEWS_DATA:
            return setAssignmentReviewsData(state, action)
        case ActionType.SET_TEST_QUESTION_DATA:
            return setTestQuestionData(state, action)
        case ActionType.DELETE_ASSIGNMENT_DATA:
            return deleteAssignmentData(state, action)
        case ActionType.DELETE_ASSIGNMENT_AND_REVIEW_DATA:
            return deleteAssignmentAndReviewData(state, action)
        default:
            return state
    }
}

export default processor;
export { ActionType }