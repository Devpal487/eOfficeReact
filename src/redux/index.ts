import {combineReducers} from 'redux';
import { UserPermissionReducer } from './UserPermission-reducer'; 


const reducers =combineReducers({
    UserPermissionReducer:UserPermissionReducer,
})

export default reducers;