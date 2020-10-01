import React, { useState } from 'react';
import './CountrySearchInput.css';
import { locationActions, weatherActions } from '../../actions';
import { countryCodes, countryLocations } from '../../constants';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';

const CountrySearchInput: React.FC = ({ updateLocation, getCurrentWeather, getDailyWeather }: any) => {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const options = _mapCountries()

  function _mapCountries() {
    return countryLocations.map((country: any) => ({
      code: country.country_code,
      name: countryCodes[country.country_code],
      latitude: country.latlng[0],
      longitude: country.latlng[1]
    }))
  }

  const _getSuggestions = (value: any):any[] => {
    let inputValue = value.trim().toLowerCase();
    let inputLength = inputValue.length;

    return inputLength === 0 ? [] : options.filter((option: any) =>
      option.name && option.name.toLowerCase().slice(0, inputLength) === inputValue
    )
  }

  const _getSuggestionValue = (suggestion: any) => suggestion;

  function _renderSuggestionsContainer({ containerProps, children, query }: any) {
    return (
      <div {...containerProps}>
        {children}
      </div>
    );
  }
  const _renderSuggestion = (suggestion: any) => (
    <div>
      {suggestion.name}
    </div>
  )

  const onChange = (event: any, change: any) => {
    if (change.method === 'click') {
      setValue(change.newValue.name)
      const { longitude, latitude } = change.newValue
      updateLocation({ longitude, latitude })
      getCurrentWeather(longitude, latitude)
      getDailyWeather(longitude, latitude)
    } else {
      setValue(change.newValue)
    }

    //updateLocation()

  }


  const onSuggestionsFetchRequested = ({ valuey }: any) => {
    setSuggestions(_getSuggestions(value))
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  };

  const inputProps = {
    placeholder: 'Rechercher un pays..',
    value,
    onChange: onChange
  };
  return (
    <Autosuggest
      renderSectionTitle={()=><p>titre</p>}
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={_getSuggestionValue}
      
      renderSuggestion={_renderSuggestion}
      renderSuggestionsContainer={_renderSuggestionsContainer}
      inputProps={inputProps}
    />
  )
}

const actionCreators = {
  updateLocation: locationActions.updateLocation,
  getCurrentWeather: weatherActions.getCurrentWeatherByGeograpgicCoordinates,
  getDailyWeather: weatherActions.getDailyWeatherByGeograpgicCoordinates,
}

export default connect(() => ({}), actionCreators)(CountrySearchInput);

