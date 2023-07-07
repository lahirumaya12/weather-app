import React, { Component } from 'react'
import './style.css';

class Footer extends Component {
  render() {
    return (
        <div className='footer text-center p-3'>
        <a className='text-light' href='https://fidenz.com/'>&copy; {new Date().getFullYear()}  &nbsp;
        
            Fidenz Technologies
        </a>
      </div>
    )
  }
}
export default Footer