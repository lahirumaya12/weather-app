import axios from "axios";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const apiClient = axios.create({
  baseURL: 'http://api.openweathermap.org/data/2.5',
});

export const getWeatherData = async (cityCodes) => {
  try {
    const response = await apiClient.get(`/group?id=${cityCodes}&units=metric&appid=${API_KEY}`);
    return response.data.list;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
};


