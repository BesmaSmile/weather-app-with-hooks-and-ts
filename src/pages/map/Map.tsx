import React, { useEffect, useRef } from 'react';
import './Map.css';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';
import { connect } from 'react-redux';
import { locationActions, weatherActions } from '../../actions';
import { apiConstants } from '../../constants';

mapboxgl.accessToken =apiConstants.MAPBOX_KEY;

function Map(props:any) {
    let map:any, positionMarker: any;

    useEffect(()=>{
        _displayMap()
        _addCurrentLocationControl()
        _addNavControl()
    }, [])

    useEffect(()=>{
        const { location }=props
        if(location){
            console.log("showing new location")
            _showLocation()
        }
    }, props.location)

    function _displayMap(){
        const {updateLocation}=props
        map = new mapboxgl.Map({
            //container: mapContainer,
            container:'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ 3.042048, 36.752887],//Algiers geographical coordinates are used by default as map center
            zoom: 5
        });

        map.on('click', (e:any)=> {
            //update center and current location marker
            map.flyTo({ center: e.lngLat });
            const {lng, lat}=e.lngLat;
            updateLocation({longitude :lng, latitude: lat})
            _updateWeather(lng,lat)
        });
    }

    //button to move to current location
    function _addCurrentLocationControl(){
        const { updateLocation }= props
        const userLocationControl=new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                showUserLocation:false,
                trackUserLocation: true
            })
        userLocationControl.on('geolocate',(data:any)=>{
            const { longitude, latitude}=data.coords
            updateLocation(data.coords)
            _updateWeather(longitude,latitude)
        })
        map.addControl(userLocationControl)
    }

    //zoom in and zoom out control
    function _addNavControl(){
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');
    }

    //Display a Marker on the current or selected location
    function _showLocation(){
        const { longitude, latitude }=props.location
        _setUpMarker(longitude, latitude)
    }

    function _setUpMarker(longitude:number, latitude:number){
        const { updateLocation }=props
        if(positionMarker){
            console.log("update")
            positionMarker.setLngLat([longitude,latitude])
        }
        else{
            positionMarker = new mapboxgl.Marker({color:'#B43E5A'})
              .setLngLat([longitude, latitude])
              .addTo(map);
             positionMarker.setDraggable(true)
             positionMarker.on('dragend', (result:any)=>{
                 const { lng, lat }=result.target._lngLat
                 updateLocation({longitude :lng, latitude: lat})
                 _setUpMarker(lng, lat)
                 _updateWeather(lng,lat)
             })
         }
        map.flyTo({ center: [longitude ,latitude]});
    }

    function _updateWeather(longitude:number,latitude:number){
        const { getCurrentWeather, getDailyWeather } =props
        getCurrentWeather(longitude,latitude)
        getDailyWeather(longitude,latitude)
    }


    return (
        <div className='main-container'>
            <div id="map" className='map-container' />
        </div>
    )
}

function mapState(state:any) {
    const { location, currentLocationPending, currentLocationError} = state.location;
    return { location, currentLocationPending, currentLocationError};
}

const actionCreators = {
    updateLocation: locationActions.updateLocation,
    getCurrentWeather: weatherActions.getCurrentWeatherByGeograpgicCoordinates,
    getDailyWeather: weatherActions.getDailyWeatherByGeograpgicCoordinates,
}

export default connect(mapState, actionCreators)(Map);
