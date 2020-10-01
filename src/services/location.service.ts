export const locationService = {
    getCurrentLocation,
};

function getCurrentLocation(success:any,failure:any) {
    const options = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    };
    return navigator.geolocation.getCurrentPosition(success,
        failure,options);
}
