import axios from "axios";
import { getCities } from '../RestApi/getCities';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;


const cityCodes = getCities;

const apiClient = axios.create({
  baseURL: 'http://api.openweathermap.org/data/2.5',
});

export const getWeatherData = async () => {
    try {
      
      const cityIds = cityCodes.join(',');
      const response = await apiClient.get(`/group?id=${cityIds}&units=metric&appid=${API_KEY}`);
      return response.data.list;
    } catch (error) {
      throw new Error(`Error fetching cities: ${error.message}`);
    }
  };

