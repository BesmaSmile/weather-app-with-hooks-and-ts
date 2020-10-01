import { reducersConstants } from '../../constants';

export function weather(state = {}, action:any) {
    switch(action.type) {
        //Current weather
        case reducersConstants.CURRENT_WEATHER_REQUEST:
        return {
            ...state,
            currentWeatherPending: true,
            currentWeatherError : undefined,
            currentWeather:undefined
        }
        case reducersConstants.CURRENT_WEATHER_SUCCESS:
        return {
            ...state,
            currentWeatherPending: false,
            currentWeather: action.weather
        }
        case reducersConstants.CURRENT_WEATHER_FAILURE:
        return {
            ...state,
            currentWeatherPending: false,
            currentWeatherError : action.error
        }

        //Daily weather
        case reducersConstants.DAILY_WEATHER_REQUEST:
        return {
            ...state,
            dailyWeatherError : false,
            dailyWeatherPending: true,
            dailyWeather: undefined
        }
        case reducersConstants.DAILY_WEATHER_SUCCESS:
        return {
            ...state,
            dailyWeatherPending: false,
            dailyWeather: action.weather
        }
        case reducersConstants.DAILY_WEATHER_FAILURE:
        return {
            ...state,
            dailyWeatherPending: false,
            dailyWeatherError : action.error
        }
        default:
        return state
    }
}
