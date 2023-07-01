import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Button, Form, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faCloudArrowDown, faCloudArrowUp, faCloudMeatball, faCloudMoon, faCloudRain, faCloudShowersHeavy, faCloudShowersWater, faCloudSun, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getWeatherData } from '../../RestApi/apiClient';

const API_KEY = '2c064df813f6191a28d9928284677cd7';
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const WeatherApp = () => {
  
  const [weatherData, setWeatherData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData) {
      setWeatherData(cachedData);
    } else {
      fetchData();
    }
  }, []);

  // const fetchData = () => {
  //   axios
  //     .get('cities.json')
  //     .then(response => {
  //       if (response.status === 200) {
  //         let parsedData;
  //         const cityCodes = response.data.map(city => city.CityCode);
  //         // Call API for weather information
  //         getWeatherData(cityCodes);
  //       } else if (response.status === 304) {
  //         // Use cached data
  //         console.log('Using cached data');
  //         // Process the cached data as needed
  //       }
  //     })
  //     .catch(error => {
  //       console.log(`Error fetching cities.json: ${error.message}`);
  //     });
  // };

  const fetchData = async () => {
    try {
      const cityData = await getWeatherData();
      setWeatherData(cityData);
      cacheData(cityData);
    } catch (error) {
      console.log(`Error fetching cities: ${error.message}`);
    }
  };

  // const getWeatherData = cityCodes => {
  //   const apiUrl = `http://api.openweathermap.org/data/2.5/group?id=${cityCodes.join(
  //     ','
  //   )}&units=metric&appid=${API_KEY}`;

  //   axios
  //     .get(apiUrl)
  //     .then(response => {
  //       const weatherData = response.data.list;
  //       setWeatherData(weatherData);
  //       cacheData(weatherData);
  //     })
  //     .catch(error => {
  //       console.log('Error fetching weather data:', error);
  //     });
  // };

  const cacheData = data => {
    const timestamp = new Date().getTime();
    const cachedData = {
      timestamp,
      data
    };
    localStorage.setItem('weatherData', JSON.stringify(cachedData));
  };

  const getCachedData = () => {
    const cachedData = localStorage.getItem('weatherData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const { timestamp, data } = parsedData;
      const currentTime = new Date().getTime();
      if (currentTime - timestamp <= CACHE_EXPIRATION) {
        return data;
      } else {
        localStorage.removeItem('weatherData');
      }
    }
    return null;
  };

  const handleLocationClick = location => {
    setSelectedLocation(location);
    setModalShow(true);
  };

  const buttonStyle = {
    backgroundColor: '#6c5dd3', 
    color: 'white', 
  };

  return (
    <div className="weather-app">
      
      <h1> <FontAwesomeIcon icon={faCloudSun} size='xl' style={{color: "#ffffff"}} />   Weather App</h1>
          <Container className="mt-1 mb-5">
          <Row className="justify-content-center">
            <Col sm={5}>
              <Form className="d-flex">
                <Form.Control
                  type=""
                  placeholder="Enter a city"
                  className="me-2"
                  aria-label=""
                />
                <Button className="w-50" style={buttonStyle}>
                  Add City
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      <div className="weather-list">
        {weatherData.map((weather) => (

          
          <a href='#' className="loactionhandler" onClick={() => handleLocationClick(weather)}><div className="weather-item" key={weather.id}>
          <div>
            <Row>
                <Col><h3>{weather.name}, {weather.sys.country}</h3><p><b>{new Date(weather.sys.timezone * 1000).toLocaleTimeString()}</b></p></Col>
                <Col><h2>{Math.round(weather.main.temp)}°C</h2></Col>
            </Row>
          </div>
          <div>
            <Row>
          
            <Col><p className="weather">
                {weather.weather[0].id === 800 ? (
                  <FontAwesomeIcon icon={faCloudSun} size="xl"/>
                  ) : weather.weather[0].id === 500 ? (
                    <FontAwesomeIcon icon={faCloudRain} size="xl"/>
                    ) :  weather.weather[0].id === 501 ? (
                      <FontAwesomeIcon icon={faCloudShowersHeavy} size="xl"/>
                      ) :  weather.weather[0].id === 803 ? (
                        <FontAwesomeIcon icon={faCloud} size="xl"/>
                        ) :  weather.weather[0].id === 804 ? (
                          <FontAwesomeIcon icon={faCloudArrowUp} size="xl"/>
                          ) :  weather.weather[0].id === 801 ? (
                            <FontAwesomeIcon icon={faCloudMoon} size="xl"/>
                            ) :  weather.weather[0].id === 741 ? (
                            <FontAwesomeIcon icon={faCloudMeatball} size="xl"/>
                            ) :  weather.weather[0].id === 701 ? (
                            <FontAwesomeIcon icon={faCloudArrowDown} size="xl"/>
                            ) :  weather.weather[0].id === 520 ? (
                            <FontAwesomeIcon icon={faCloudShowersWater} size="xl"/>
                           ) : (
                            <FontAwesomeIcon icon={faCloudSun} size="xl"/>
                            )

        }

        
          &nbsp;<b>{weather.weather[0].description}</b></p></Col>
                <Col><p><b>Temp Min</b> {Math.round(weather.main.temp_min)}°C</p><p><b>Temp Max</b> {Math.round(weather.main.temp_max)}°C</p></Col>
            </Row>
          </div>
        <div className="underback">
        <Row >
        <Col className="phv"><p><b>Pressure</b> {weather.main.pressure}hPa</p><p><b>Humidity</b> {weather.main.humidity}%</p><p><b>Visibility</b> {weather.visibility}km</p></Col>
        <Col className="degree"><FontAwesomeIcon icon={faLocationArrow} size="2xl"/><br></br><b>{weather.wind.speed}m/s {weather.wind.deg} Degree</b></Col>
        <Col className="sun"><p><b>Sunrise</b> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p><p><b>Sunset</b> {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p></Col>
      </Row>
      </div>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Location Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLocation && (
            <div>
              <h2>{selectedLocation.name}</h2>
              <p>Temperature: {selectedLocation.main.temp}°C</p>
              <p>Description: {selectedLocation.weather[0].description}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
          </div></a>
        ))}
        
      </div>
      
    </div>
    
  );
};


export default WeatherApp;
