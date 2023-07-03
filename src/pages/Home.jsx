import React, { Component, Fragment } from 'react'
import WeatherApp from '../components/WeatherApp/weatherapp'
import Footer from '../components/Footer/footer'


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
