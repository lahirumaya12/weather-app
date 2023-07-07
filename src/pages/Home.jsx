import React, { Component, Fragment } from 'react';
import WeatherApp from '../components/WeatherApp/WeatherApp';
import Footer from '../components/Footer/Footer';

class Home extends Component {
  render() {
    return (
        <Fragment>
        <WeatherApp/>
        <Footer/>
        </Fragment>
    )
  }
}

export default Home
