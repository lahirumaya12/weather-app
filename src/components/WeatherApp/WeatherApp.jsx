import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faCloudArrowDown,
  faCloudArrowUp,
  faCloudMeatball,
  faCloudMoon,
  faCloudRain,
  faCloudShowersHeavy,
  faCloudShowersWater,
  faCloudSun,
} from "@fortawesome/free-solid-svg-icons";
import locationIco from "../../assets/images/location.png";
import axios from "axios";
import { getWeatherData } from "../../RestApi/apiClient";
import logo from "../../assets/images/logo.png";
import "./../WeatherApp/style.css";
import { cacheData , getCachedData} from "../../CacheHandler/CacheHandler";
import WeatherCard from "../WeatherCard/WeatherCard";


const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}, ${currentDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })}`;

  const fetchAndUpdateWeatherData = async (cityCode, cacheExpiration) => {
    try {
      const latestWeatherData = await getWeatherData([cityCode]);
      const updatedWeatherData = [...weatherData];
      const cityIndex = updatedWeatherData.findIndex(
        (weather) => weather.CityCode === cityCode
      );
      if (cityIndex !== -1) {
        updatedWeatherData[cityIndex] = latestWeatherData[0];
        setWeatherData(updatedWeatherData);
      }
      cacheData(latestWeatherData, cityCode, cacheExpiration);
    } catch (error) {
      console.error("Error fetching and updating weather data:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("cities.json");
        if (response.status === 200) {
          const cityData = response.data;
          const cityCodes = extractCityCodes(cityData);

          const allCachedData = [];
          for (const city of cityData) {
            const cachedData = getCachedData(city.CityCode);
            if (cachedData) {
              allCachedData.push(...cachedData);
            } else {
              const weatherData = await getWeatherData([city.CityCode]);
              allCachedData.push(...weatherData);
              console.log(city.CityCode);
              cacheData(weatherData, city.CityCode, city.CacheExpiration);
            }
          }

          setWeatherData(allCachedData);

          const interval = setInterval(() => {
            for (const city of cityData) {
              const cachedData = localStorage.getItem(
                `weatherData_${city.CityCode}`
              );
              const parsedData = JSON.parse(cachedData);
              const { timestamp, CacheExpiration } = parsedData;
              const currentTime = new Date().getTime();
              if (currentTime - timestamp > CacheExpiration) {
                fetchAndUpdateWeatherData(city.CityCode, city.CacheExpiration);
              }
            }
          }, 5000);

          return () => {
            clearInterval(interval);
          };
        } else if (response.status === 304) {
          // ...
        }
      } catch (error) {
        console.log(`Error fetching city data: ${error.message}`);
      }
    };

    const cachedData = getCachedData();
    if (cachedData) {
      setWeatherData(cachedData);
    } else {
      fetchData();
    }
  }, []);

  const extractCityCodes = (cityData) => {
    const cityCodes = [];
    for (let i = 0; i < cityData.length; i++) {
      cityCodes.push(cityData[i].CityCode);
    }
    return cityCodes;
  };

  const handleCityClick = async (id) => {
    try {
      console.log(id);
      const latestWeatherData = await getWeatherData(id);
      setSelectedCity(latestWeatherData[0]);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCity(null);
  };

  const getWeatherCardClass = (weatherCondition) => {
    if (weatherCondition === "overcast clouds") {
      return "weather-card-clouds";
    } else if (weatherCondition === "Rain") {
      return "weather-card-rain";
    } else if (weatherCondition === "few clouds") {
      return "weather-card-few-clouds";
    } else if (weatherCondition === "light rain") {
      return "weather-card-light";
    } else if (weatherCondition === "clear sky") {
      return "weather-card-clear";
    } else if (weatherCondition === "scattered clouds") {
      return "weather-card-scattered";
    } else if (weatherCondition === "moderate rain") {
      return "weather-card-moderate-rain";
    } else {
      return "weather-card-sun";
    }
  };

  const weatherIconMapping = {
    800: faCloudSun,
    500: faCloudRain,
    501: faCloudShowersHeavy,
    803: faCloud,
    804: faCloudArrowUp,
    801: faCloudMoon,
    741: faCloudMeatball,
    701: faCloudArrowDown,
    520: faCloudShowersWater,
  };

  return (
    <div className="weather-app">
      <h1 className="app-logo">
        <img className="logo" src={logo} /> Weather App
      </h1>
      <Container className="mt-1 mb-5">
        <Row className="justify-content-center">
          <Col sm={5}>
            <Form className="d-flex form-home">
              <Form.Control
                placeholder="Enter a city"
                className="me-2 form-control-cl border-0"
                aria-label=""
              />
              <Button type="button" className="button w-50">
                Add City
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <div className="weather-list">
        {weatherData && weatherData.map((weather) => (
          <div
            href="#"
            className="loactionhandler"
            key={getWeatherData.cityCode}
            onClick={() => handleCityClick(weather.id)}
          >
          <WeatherCard weatherData={weather} />
            </div>
        ))}
        {selectedCity && (
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={showModal}
            onHide={closeModal}
            ClassName="weather-m"
          >
            <div
              className={`weather-modal ${getWeatherCardClass(
                selectedCity.weather[0].description
              )}`}
            >
              <div>
                <h3 className="modal-country text-center bold">
                  {selectedCity.name}, {selectedCity.sys.country}
                </h3>
                <p className="regular-fontset text-center">
                {formattedDate}
                </p>

                <Row className="weather-row">
                  <Col className="weather-col">
                    <p className="modal-weather-icon">
                      <FontAwesomeIcon
                        icon={
                          weatherIconMapping[selectedCity.weather[0].id] ||
                          faCloudSun
                        }
                        size="2xl"
                      />
                      &nbsp;
                    </p>
                    <p className="modal-weather des-weather">
                      <span className="semibold des-weather">
                        {selectedCity.weather[0].description}
                      </span>
                    </p>
                  </Col>

                  <Col className="modal-v">
                    <div className="vl-left-modal-t">
                      <h2 className="temp-modal">
                        <div className="bold temp">
                          {Math.round(selectedCity.main.temp)}°c
                        </div>
                      </h2>
                      <p className="mn-temp line-height light-font">
                        <span className="bold">Temp Min: </span>
                        {Math.round(selectedCity.main.temp_min)}°c
                      </p>
                      <p className="mn-temp line-height light-font">
                        <span className="bold">Temp Max: </span>
                        {Math.round(selectedCity.main.temp_max)}°c
                      </p>
                    </div>
                  </Col>
                </Row>
                <div className="modal-underback">
                  <Row>
                    <Col className="modal-phv line-height">
                      <p>
                        <span className="bold">Pressure: </span>
                        {selectedCity.main.pressure}hPa
                      </p>
                      <p>
                        <span className="bold">Humidity: </span>
                        {selectedCity.main.humidity}%
                      </p>
                      <p>
                        <span className="bold">Visibility: </span>
                        {selectedCity.visibility}km
                      </p>
                    </Col>

                    <Col className="modal-degree">
                      <div className="vl-left-modal">
                        <div className="vl-right-modal">
                        <img src={locationIco} className="locationIco"/>
                          <div className="bold">
                            {selectedCity.wind.speed}m/s {selectedCity.wind.deg}
                            Degree
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col className="modal-sun">
                      <p className="line-height">
                        <span className="bold">Sunrise: </span>
                        {new Date(
                          selectedCity.sys.sunrise * 1000
                        ).toLocaleTimeString()}
                      </p>
                      <p className="line-height">
                        <span className="bold">Sunset: </span>
                        {new Date(
                          selectedCity.sys.sunset * 1000
                        ).toLocaleTimeString()}
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
