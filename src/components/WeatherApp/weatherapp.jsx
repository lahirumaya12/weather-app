import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Button, Form, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faCloudArrowDown, faCloudArrowUp, faCloudMeatball, faCloudMoon, faCloudRain, faCloudShowersHeavy, faCloudShowersWater, faCloudSun, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getWeatherData } from '../../RestApi/apiClient';
import 'reactjs-popup/dist/index.css';
import { CACHE_EXPIRATION } from '../../constants';



const WeatherApp = () => {
  
  const [weatherData, setWeatherData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  

  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData) {
      setWeatherData(cachedData);
    } else {
      fetchData();
    }
  }, []);


  const fetchData = async () => {
  try {
    const response = await axios.get('cities.json');
    if (response.status === 200) {
      const cityCodes = response.data.map(city => city.CityCode);
      const cityData = await getWeatherData(cityCodes);
      setWeatherData(cityData);
      cacheData(cityData);
    } else if (response.status === 304) {
      // Use cached data
      console.log('Using cached data');
      // Process the cached data as needed
    }
  } catch (error) {
    console.log(`Error fetching cities.json: ${error.message}`);
  }
};

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

  const handleCityClick = async (city) => {
    try {

      
      setSelectedCity(city);
      setShowModal(true);
      // Fetch weather data for the selected city
      const weatherData = await getWeatherData(city.CityCode);
    // Update the state with weatherData
    setWeatherData(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCity(null);
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
              <Form className="d-flex form-home">
                <Form.Control
                  type=""
                  placeholder="Enter a city"
                  className="me-2 form-control-cl border-0"
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
          <a href='#' className="loactionhandler" key={getWeatherData.cityCode} onClick={() => handleCityClick(weather)}><div className="weather-item" key={weather.id}>
          <div>
            <Row>
                <Col>
                <h3>{weather.name}, {weather.sys.country}</h3>
                <p><b>{new Date(weather.sys.timezone * 1000).toLocaleTimeString()}</b></p>
                </Col>
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
                <Col>
                <p><b>Temp Min</b> {Math.round(weather.main.temp_min)}°C</p>
                <p><b>Temp Max</b> {Math.round(weather.main.temp_max)}°C</p>
                </Col>
            </Row>
          </div>
        <div className="underback">
        <Row >
        <Col className="phv"> 
        <p><b>Pressure</b> {weather.main.pressure}hPa</p>
        <p><b>Humidity</b> {weather.main.humidity}%</p>
        <p><b>Visibility</b> {weather.visibility}km</p></Col>

        <Col className="degree">
        <FontAwesomeIcon icon={faLocationArrow} size="2xl"/><br></br><b>{weather.wind.speed}m/s {weather.wind.deg} Degree</b>
        </Col>

        <Col className="sun">
        <p><b>Sunrise</b> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p><b>Sunset</b> {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
        </Col>
      </Row>
      
      </div>
          </div></a>

          
        ))}
        <Modal
      
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered show={showModal} onHide={closeModal} className="weather-m"
    >
      <div className="weather-modal">
      {selectedCity && (
      <div>
        <h3 className="modal-country text-center">{selectedCity.name}, {selectedCity.sys.country}</h3>
        <p className="country-time text-center">{new Date(selectedCity.sys.timezone * 1000).toLocaleTimeString()}</p>

        <Row className="weather-row">
        <Col>
        <p className="modal-weather-icon">
                {selectedCity.weather[0].id === 800 ? (
                  <FontAwesomeIcon icon={faCloudSun} size="2xl"/>
                  ) : selectedCity.weather[0].id === 500 ? (
                    <FontAwesomeIcon icon={faCloudRain} size="2xl"/>
                    ) :  selectedCity.weather[0].id === 501 ? (
                      <FontAwesomeIcon icon={faCloudShowersHeavy} size="2xl"/>
                      ) :  selectedCity.weather[0].id === 803 ? (
                        <FontAwesomeIcon icon={faCloud} size="2xl"/>
                        ) :  selectedCity.weather[0].id === 804 ? (
                          <FontAwesomeIcon icon={faCloudArrowUp} size="2xl"/>
                          ) :  selectedCity.weather[0].id === 801 ? (
                            <FontAwesomeIcon icon={faCloudMoon} size="2xl"/>
                            ) :  selectedCity.weather[0].id === 741 ? (
                            <FontAwesomeIcon icon={faCloudMeatball} size="2xl"/>
                            ) :  selectedCity.weather[0].id === 701 ? (
                            <FontAwesomeIcon icon={faCloudArrowDown} size="2xl"/>
                            ) :  selectedCity.weather[0].id === 520 ? (
                            <FontAwesomeIcon icon={faCloudShowersWater} size="2xl"/>
                           ) : (
                            <FontAwesomeIcon icon={faCloudSun} size="xl"/>
                            )

        }

        
          &nbsp;</p><p className="modal-weather"><b>{selectedCity.weather[0].description}</b></p></Col>
          
        <Col>
        <h2 className="temp"><b>{Math.round(selectedCity.main.temp)}°c</b></h2>
        <p className="mn-temp"><b>Temp Min</b> {Math.round(selectedCity.main.temp_min)}°c</p>
        <p className="mn-temp"><b>Temp Max</b> {Math.round(selectedCity.main.temp_max)}°c</p>
        
        </Col>
      </Row>
      <div className="modal-underback">
      <Row >
      
        <Col className="modal-phv">
        <p><b>Pressure</b> {selectedCity.main.pressure}hPa</p>
        <p><b>Humidity</b> {selectedCity.main.humidity}%</p>
        <p><b>Visibility</b> {selectedCity.visibility}km</p>
        </Col>

        <Col className="modal-degree">
        <FontAwesomeIcon icon={faLocationArrow} size="2xl"/><br></br><b>{selectedCity.wind.speed}m/s {selectedCity.wind.deg} Degree</b>
        </Col>

        <Col className="modal-sun">
        <p><b>Sunrise</b> {new Date(selectedCity.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p><b>Sunset</b> {new Date(selectedCity.sys.sunset * 1000).toLocaleTimeString()}</p>
        </Col>
      </Row>
      </div>
      </div>
    )}
      </div>
      
    </Modal>
      </div>
      
    </div>
    
  );
};


export default WeatherApp;
