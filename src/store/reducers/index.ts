import { combineReducers } from 'redux';
import { weather } from './weather.reducer';
import { location } from './location.reducer';

const rootReducer = combineReducers({
    weather,
    location
});

export default rootReducer;
