import React, { Component } from 'react'

class Footer extends Component {
  render() {
    return (
        <div className='text-center p-3' style={{ backgroundColor: '#30333d'}}>
        <a className='text-light' href='https://fidenz.com/'>&copy; {new Date().getFullYear()}  &nbsp;
        
            Fidenz Technologies
        </a>
      </div>
    )
  }
}
export default Footer