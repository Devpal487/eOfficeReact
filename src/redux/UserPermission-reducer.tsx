import { userPermissionActionTypes } from "./UserPermission-action-types"; 

const initialState = {
    UserPermissionList: localStorage.getItem("userdata")
}

export const UserPermissionReducer = (state =initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case userPermissionActionTypes.IS_ADD:
            return {...state, UserPermissionList:action.payload};
            case userPermissionActionTypes.IS_EDIT:
                return {...state, UserPermissionList:action.payload};
                case userPermissionActionTypes.IS_VIEW:
                    return {...state, UserPermissionList:action.payload};
                    case userPermissionActionTypes.IS_DELETE:
                        return {...state, UserPermissionList:action.payload};
                        case userPermissionActionTypes.IS_PRINT:
                            return {...state, UserPermissionList:action.payload};
        default:
            return state;
    }
}
