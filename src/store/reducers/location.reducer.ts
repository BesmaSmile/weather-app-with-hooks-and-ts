import { reducersConstants } from '../../constants';

export function location(state = {}, action:any) {
    switch(action.type) {
        //Current location
        case reducersConstants.CURRENT_LOCATION_REQUEST:
        return {
            ...state,
            currentLocationPending: true,
            currentLocationError:undefined
        }
        case reducersConstants.CURRENT_LOCATION_SUCCESS:
        return {
            ...state,
            currentLocationPending: false,
            location: action.location
        }
        case reducersConstants.CURRENT_LOCATION_FAILURE:
        return {
            ...state,
            currentLocationPending: false,
            currentLocationError : action.error
        }

        case reducersConstants.UPDATE_LOCATION:
        return {
            ...state,
            location: action.location
        }
        default:
        return state
    }
}
