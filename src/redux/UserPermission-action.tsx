import { userPermissionActionTypes } from "./UserPermission-action-types";

export const isAddPermission = (userPermission: any) => {
    return {
        type: userPermissionActionTypes.IS_ADD,
        payload: userPermission
    };
};
