import axios from "axios";
import { getWeatherData } from '../RestApi/apiClient';

export const getCities = () => {
    axios
      .get('cities.json')
      .then(response => {
        if (response.status === 200) {
          let parsedData;
          const cityCodes = response.data.map(city => city.CityCode);
          // Call API for weather information
          getWeatherData(cityCodes);
          
        } else if (response.status === 304) {
          // Use cached data
          console.log('Using cached data');
          // Process the cached data as needed
        }
      })
      .catch(error => {
        console.log(`Error fetching cities.json: ${error.message}`);
      });
  };