import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row, Button, Form, Modal } from "react-bootstrap";
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
  import "./../WeatherApp/style.css";
  import locationIco from "../../assets/images/location.png";

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}, ${currentDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })}`;

const WeatherCard = ({ weatherData }) => {
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
    <div
              className={`weather-item ${getWeatherCardClass(
                weatherData.weather[0].description
              )}`}
              key={weatherData.id}
            >
              <div>
                <Row>
                  <Col>
                    <h3 className="card-country">
                      {weatherData.name}, {weatherData.sys.country}
                    </h3>
                    <p>
                      <div className="regular-fontset">{formattedDate}</div>
                    </p>
                  </Col>
                  <Col>
                    <h2 className="temp">{Math.round(weatherData.main.temp)}°c</h2>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col>
                    <p className="weather">
                      <FontAwesomeIcon
                        icon={
                          weatherIconMapping[weatherData.weather[0].id] ||
                          faCloudSun
                        }
                        size="xl"
                      />
                      &nbsp;
                      <span className="bold">
                        {weatherData.weather[0].description}
                      </span>
                    </p>
                  </Col>
                  <Col className="mm-temp">
                    <p className="line-height light-font">
                      <span className="bold min-temp">Temp Min: </span>
                      {Math.round(weatherData.main.temp_min)}°C
                    </p>
                    <p className="line-height light-font">
                      <span className="bold">Temp Max: </span>{" "}
                      {Math.round(weatherData.main.temp_max)}°C
                    </p>
                  </Col>
                </Row>
              </div>
              <div className="underback">
                <Row>
                  <Col className="phv">
                    <p className="line-height">
                      <span className="bold">Pressure: </span>
                      {weatherData.main.pressure}hPa
                    </p>
                    <p className="line-height">
                      <span className="bold">Humidity: </span>
                      {weatherData.main.humidity}%
                    </p>
                    <p className="line-height">
                      <span className="bold">Visibility: </span>
                      {weatherData.visibility}km
                    </p>
                  </Col>

                  <Col className="degree">
                    <div className="vl-left">
                      <div className="vl-right">
                        <img src={locationIco} className="locationIco"/>
                        <div className="bold">
                          {weatherData.wind.speed}m/s {weatherData.wind.deg} Degree
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col className="sun">
                    <p className="line-height">
                      <span className="bold">Sunrise: </span>
                      {new Date(
                        weatherData.sys.sunrise * 1000
                      ).toLocaleTimeString()}
                    </p>
                    <p className="line-height">
                      <span className="bold">Sunset: </span>
                      {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          
  );
};

export default WeatherCard;
