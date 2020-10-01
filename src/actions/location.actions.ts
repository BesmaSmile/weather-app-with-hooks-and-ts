import { reducersConstants } from '../constants';
import { locationService } from '../services';


export const locationActions = {
    getCurrentLocation,
    updateLocation
};

function getCurrentLocation(callback:any) {
    return (dispatch:any) => {
        dispatch(request());
        locationService.getCurrentLocation((location:any)=>{
            dispatch(success(location.coords));
            callback(location.coords)
        }, (error:any)=>{
            dispatch(failure(error.message));
        })
    };

    function request() { return { type: reducersConstants.CURRENT_LOCATION_REQUEST} }
    function success(location:any) { return { type: reducersConstants.CURRENT_LOCATION_SUCCESS, location } }
    function failure(error:any) { return { type:reducersConstants.CURRENT_LOCATION_FAILURE, error } }
}


function updateLocation(location:any) {
    return (dispatch:any) => {
            dispatch({
                type: reducersConstants.UPDATE_LOCATION,
                location
            });
    };
}
