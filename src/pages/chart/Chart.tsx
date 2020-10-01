import React, { useState, useRef } from 'react';
import './Chart.css';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/fr';
import 'chartjs-plugin-datalabels';
import LineChart from '../../components/LineChart';
import { icons } from '../../assets';
import { MagicSpinner } from 'react-spinners-kit';

function Chart(props:any) {

    const [state, setState]=useState({
        selectedChart : 0,
        selectedTiming: 0,
        title : 'Météo par heure'
    })
  
    const chartRef = useRef(null);
    const _initDailyChartProperties=(title:string, keyMin:string,  keyMax:string)=>{
        const { dailyWeather } = props;
        return {
            title : title,
            datasets : [
                {
                    borderColor: '#ccc',
                    //label: 'min',
                    data: dailyWeather.daily.map((weather:any)=>weather[keyMin]),
                },
                {
                    borderColor: '#999',
                    //label: 'max',
                    data: dailyWeather.daily.map((weather:any)=>weather[keyMax]),
                }
            ],
            labels: dailyWeather.daily.map((weather:any)=>moment(weather.date,"YYYY-MM-DD").format('dddd')),
        }
    }

    const _initHourlyChartProperties=(title:string, key:string)=>{

        const { dailyWeather, date } = props;
        const weather=dailyWeather.hourly
            .filter((weather:any)=>new Date(weather.date)>=new Date(date))
            .slice(0, 8)
        return {
            title : title,
            datasets : [
                {
                    borderColor: '#ccc',
                    //label: key,
                    data:weather.map((weather:any)=>weather[key]),
                }
            ],
            labels: weather.map((weather:any)=>weather.hour.slice(0, 5)),
        }
    }

    function _displayChart(){
        const chart = _getChart()
        const {dailyWeatherPending}=props
        if(chart && !dailyWeatherPending){
            return <LineChart  {...chart} />
        }
    }

    function _selectChart(index:number, key:string){
        setState({
            ...state,
            [key] : index,
        })
        setState({
            ...state, 
            title :  state.selectedTiming===0? 'Météo par heure' : 'Météo par jour'
        })
    }

    function _displayDailyWeatherLoading(){
        const {dailyWeather,  dailyWeatherPending, dailyWeatherError,
            currentLocationPending, currentLocationError}=props
        if(dailyWeatherPending || dailyWeatherError
            ||(!dailyWeather && (currentLocationPending || currentLocationError) ))//weather depends on current location
        return (
            <MagicSpinner color={dailyWeatherPending||currentLocationPending ? ' #B43E5A' : '#ddd'}/>
        )
    }

   function  _getChart(){
        const { selectedChart, selectedTiming }=state
        const { dailyWeather }=props
        let chart
        if(dailyWeather){
            switch (selectedChart) {
                case 0:
                    chart=selectedTiming ===0//0 :hourly, 1:daily
                        ? _initHourlyChartProperties('Température (°C)', 'temp')
                        : _initDailyChartProperties('Température (°C)', 'temp_min', 'temp_max')
                    break;
                case 1:
                    chart=selectedTiming ===0
                        ? _initHourlyChartProperties('Pression (hpa)', 'pressure')
                        : _initDailyChartProperties('Pression (hpa)', 'pressure_min', 'pressure_max')
                    break;
                case 2:
                    chart=selectedTiming ===0
                        ? _initHourlyChartProperties('Vent (m/s)', 'wind')
                        : _initDailyChartProperties('Vent (m/s)', 'wind_min', 'wind_max')
                    break;
                case 3:
                    chart=selectedTiming ===0
                        ? _initHourlyChartProperties('Humidité (%)', 'humidity')
                        : _initDailyChartProperties('Humidité (%)', 'humidity_min', 'humidity_max')
                    break;

            }
        }
        return chart;
    }


    const { selectedChart, selectedTiming, title } = state
    return(
        <div>
            <div className='row-container'>
                <div className='timing-container'>
                        <button className={selectedTiming===0 ? 'selected' : ''} onClick={()=>_selectChart(0,'selectedTiming')}>
                            <img src={icons.clock} alt=''/>
                        </button>
                        <button className={selectedTiming===1 ? 'selected' : ''} onClick={()=>_selectChart(1,'selectedTiming')}>
                            <img src={icons.calendar} alt=''/>
                        </button>
                        <h4>{title}</h4>
                </div>
                <div className='filters-container'>
                    <button className={selectedChart===0 ? 'selected' : ''} onClick={()=>_selectChart(0, 'selectedChart')}>Température</button>
                    <button className={selectedChart===1 ? 'selected' : ''} onClick={()=>_selectChart(1, 'selectedChart')}>Pression</button>
                    <button className={selectedChart===2 ? 'selected' : ''} onClick={()=>_selectChart(2, 'selectedChart')}>Vent</button>
                    <button className={selectedChart===3 ? 'selected' : ''} onClick={()=>_selectChart(3, 'selectedChart')}>Humidité</button>
                </div>
            </div>
            {_displayChart()}
            {_displayDailyWeatherLoading()}
        </div>
    )
}

function mapState(state:any) {
    const { currentLocationPending, currentLocationError} = state.location;
    const { dailyWeather, dailyWeatherPending, dailyWeatherError } = state.weather;
    return { currentLocationPending, currentLocationError,
            dailyWeather, dailyWeatherPending, dailyWeatherError };
}

export default connect(mapState)(Chart);
