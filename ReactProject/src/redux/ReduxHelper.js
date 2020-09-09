import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import Reducer from './Reducer'

let redux_store = null

class ReduxHelper {
    static createStore() {
        // 创建 Redux store 来存放应用的状态。
        // API 是 { subscribe, dispatch, getState }。
        redux_store = createStore(
            Reducer(),
            applyMiddleware(
                thunkMiddleware, // 允许我们 dispatch() 函数
            )
        );
        return redux_store
    }

    static getStore() {
        return redux_store
    }
}

export default ReduxHelper;