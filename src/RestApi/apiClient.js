import axios from "axios";
import { getCities } from '../RestApi/getCities';

const API_KEY = '2c064df813f6191a28d9928284677cd7';

const cityCodes = getCities;

console.log(cityCodes);


const apiClient = axios.create({
  baseURL: 'http://api.openweathermap.org/data/2.5',
});

export const getWeatherData = async () => {
    try {
      const response = await apiClient.get(`/group?id=${cityCodes.join(',')}&units=metric&appid=${API_KEY}`);
      return response.data.list;
    } catch (error) {
      throw new Error(`Error fetching cities: ${error.message}`);
    }
  };

