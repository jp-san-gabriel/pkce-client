import {combineReducers} from 'redux';
import userListReducer from './userList';

const reducers = combineReducers({
    userList: userListReducer
});

export default reducers;