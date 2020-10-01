import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { icons, images } from '../../assets';
import './App.css';
import CountrySearchInput from '../../components/CountrySearchInput';
import Map from '../map';
import 'moment/locale/fr';
import Chart from '../chart';
import { locationActions, weatherActions } from '../../actions';
import { Switch, Route, NavLink } from "react-router-dom";
import { capitalizeFirstLetter } from '../../helpers';

import { MagicSpinner, CombSpinner } from 'react-spinners-kit';

function App(props:any) {
    const [state, setState]=useState<any>({
        askedForCurrentWeather : false,
        askedForDailyWeather : false,
        date : moment().format('YYYY-MM-DD'),
        selectedDay : 0,
        isLoading: true
    })

    const [ currentTime, setCurrentTime ]=useState<string>(moment().format('LTS'))

    useEffect(()=>{
            const { getCurrentLocation, getCurrentWeather, getDailyWeather }=props
            setTimeout(()=> {
                console.log("inside");
                
                setState({
                    ...state,
                    isLoading:false
                })
                getCurrentLocation((location:any)=>{
                    const { longitude, latitude }=location
                    getCurrentWeather(longitude, latitude)
                    getDailyWeather(longitude, latitude)
                })
                
            }, 3000);
    }, [])

    useEffect(()=>{
        setInterval( () => {
            setCurrentTime( moment().format('LTS'))
        },1000)
    }, [])
    /*componentDidMount() {
        const { getCurrentLocation, getCurrentWeather, getDailyWeather }=setState({
                currentTime : moment().format('LTS')
              })
          },1000)
        }, 3000);
    }*/
    function _displayCurrentWeatherLoading(){
        const {currentWeather, currentWeatherPending, currentWeatherError,
            currentLocationPending, currentLocationError}=props
        if(currentWeatherPending || currentWeatherError
            ||(!currentWeather && (currentLocationPending || currentLocationError) ))//weather depends on current location
        return (
            <div className='loading-container'>
                <CombSpinner color={currentWeatherPending||currentLocationPending ? ' #B43E5A' : '#ddd'}/>
            </div>
        )
    }

    function _displayDailyWeatherLoading(){
        const {dailyWeather,  dailyWeatherPending, dailyWeatherError,
            currentLocationPending, currentLocationError}=props
        if(dailyWeatherPending || dailyWeatherError
            ||(!dailyWeather && (currentLocationPending || currentLocationError) ))//weather depends on current location
        return (
            [0,1,2,3,4,5].map(i=>{
                return (
                    <div key={i} className='card'>
                        <div className='loading-container'>
                            <MagicSpinner color={dailyWeatherPending||currentLocationPending ? ' #B43E5A' : '#ddd'}/>
                        </div>
                    </div>
                )
            })

        )
    }

    function _selectDate(index:number,date:string){
        setState({
            ...state,
            date: date,
            selectedDay: index
        })
    }

    function _getSelectedDateWeather(){
        if(moment(state.date,"YYYY-MM-DD").format('Do MMMM  YYYY') === moment().format('Do MMMM  YYYY')){
            return props.currentWeather
        }else{
            if(props.dailyWeather)
                return {

                    ...props.dailyWeather.daily.find((weather:any)=>weather.date
                        === moment(state.date,"YYYY-MM-DD").format('YYYY-MM-DD')),
                    city : props.dailyWeather.city,
                    country : props.dailyWeather.country
                }
        }
    }

    const { currentWeather, currentWeatherPending,
            dailyWeather, dailyWeatherPending }=props
    const { date, selectedDay, isLoading}=state
    let weather
    if(currentWeather && !currentWeatherPending)
    {
        weather=_getSelectedDateWeather()
    }
    moment.locale('fr')
    return (
        <div className='app-container'>
        {!isLoading &&
            <div className='row appeared'>
                <div className='col-md-2'>
                    <div className='logo'>
                        <img src={images.logo} width={50} height= {50} alt=''/>
                        <div className='col-md-2'>
                        MétéO
                        </div>
                    </div>

                    <div className='card'>
                        {weather && !currentWeatherPending &&
                            <div className='card-inner'>
                                {(weather.city || weather.country) && <div className='default-text city'>{weather.city}{weather.country!==weather.city ? ' ,'+weather.country : '' }</div>}
                                {!weather.city && !weather.country && <div className='default-text city'>Endroit unconnu</div>}

                                <div className='default-text'>{capitalizeFirstLetter(moment().format('dddd'))} {moment().format('Do MMMM  YYYY')}</div>
                                <div className='default-text'> {currentTime}</div>
                            </div>
                        }
                        {_displayCurrentWeatherLoading()}

                    </div>

                    <div className='card'>
                        {weather && !currentWeatherPending &&
                            <>
                            <div className='card-inner'>
                                <div className='weather-day'>{capitalizeFirstLetter(moment(date).format('dddd'))}</div>
                                <div  className='row'>
                                    <div className='col-md-6' >
                                            <img src={images.transparent} alt=''
                                                className='weather-image'
                                                width={60} height={60}
                                                style={{backgroundImage: `url("http://openweathermap.org/img/w/${weather.icon}.png")`}} />

                                    </div>
                                    <div className='col-md-6 weather-value temp-value'>
                                        {weather.temp} <span className='degree'>°C</span>
                                    </div>
                                </div>
                                <span className='default-text'>{weather.description}</span>
                            </div>
                            <div className='divider'></div>
                            <div className='card-row'>
                                <img src={icons.pressure} alt=''
                                    className='icon'/>
                                <div className='card-inner'>
                                    <div className='weather-title'>Pression</div>
                                    <div className='weather-value'>{weather.pressure} hpa</div>
                                </div>
                            </div>
                            <div className='card-row'>
                                <img src={icons.wind} alt=''
                                    className='icon'/>
                                <div className='card-inner'>
                                <div className='weather-title'>Vent</div>
                                <div className='weather-value'>{weather.wind} m/s</div>
                                </div>
                            </div>
                            <div className='card-row'>
                                <img src={icons.humidity} alt=''
                                    className='icon'/>
                                <div className='card-inner'>
                                <div className='weather-title'>Humidité</div>
                                <div className='weather-value'>{weather.humidity} %</div>
                                </div>
                            </div>
                            </>
                        }
                        {_displayCurrentWeatherLoading()}

                    </div>

                </div>
                <div className='col-md-8'>
                    <div className='top-bar'>
                        <div className='search-container'>

                        <CountrySearchInput/>
                        <img src={icons.search} alt=''/>
                        </div>
                        <div className='buttons-container'>

                            <NavLink exact to="/" activeClassName='selected'>
                                <button className='img-button'>
                                    <img src={icons.chart} alt=''/>
                                </button>
                            </NavLink>
                            <NavLink exact to="/map" activeClassName='selected'>
                                <button className='img-button'>
                                    <img src={icons.map} alt=''/>
                                </button>
                            </NavLink>
                        </div>
                    </div>
                    <Switch>
                        <Route exact path="/">
                            <div>chart</div>
                        </Route>
                        <Route exact path="/map">
                            <Map/>
                        </Route>

                    </Switch>
                </div>
                <div className='col-md-2 daily-weather'>
                {
                    dailyWeather && !dailyWeatherPending &&
                    dailyWeather.daily.map((weather:any,index:number)=>{
                        return (
                            <div key={index} className={selectedDay === index ? 'card selected' : 'card'}
                                onClick={()=>_selectDate(index, moment(weather.date,"YYYY-MM-DD").format('YYYY-MM-DD'))}>
                                <div className='card-inner'>
                                    <div className='weather-day'>{capitalizeFirstLetter(moment(weather.date,"YYYY-MM-DD").format('dddd'))}</div>
                                    <div className='default-text'>{moment(weather.date,"YYYY-MM-DD").format('Do MMMM  YYYY')}</div>
                                    <div  className='card-row' >
                                        <img src={images.transparent} alt=''
                                            className='weather-image'
                                            width={60} height={60}
                                            style={{backgroundImage: `url("http://openweathermap.org/img/w/${weather.icon}.png")`}} />
                                        <div className='max-temp'>
                                            {weather.temp_max}°
                                        </div>
                                        <div className='min-temp'>
                                            {weather.temp_min}°
                                        </div>
                                    </div>
                                    <div className='default-text'>
                                        {weather.description}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

                {_displayDailyWeatherLoading()}
                </div>
            </div>
        }
        {isLoading &&
            <div className='loading-app-container'><MagicSpinner color={'#B43E5A'}/></div>
        }
        </div>
    );

}

function mapState(state:any) {
    const { currentLocationPending, currentLocationError} = state.location;
    const { currentWeather, currentWeatherPending, currentWeatherError,
            dailyWeather, dailyWeatherPending, dailyWeatherError} = state.weather;
    return { currentLocationPending, currentLocationError,
            currentWeather, currentWeatherPending, currentWeatherError,
            dailyWeather, dailyWeatherPending, dailyWeatherError };
}

const actionCreators = {
    getCurrentLocation: locationActions.getCurrentLocation,
    getCurrentWeather: weatherActions.getCurrentWeatherByGeograpgicCoordinates,
    getDailyWeather: weatherActions.getDailyWeatherByGeograpgicCoordinates,
}

export default connect(mapState, actionCreators)(App);
