import React from 'react'
import { Container } from 'reactstrap';
import logo from './../../../images/logo.png';
import './../../../css/header.css';

export default function Header(props) {
  console.log(props.url)
  return (
    <header>
      {/* <div className='curtain'></div> */}
      <Container>
        <img className='logotype' src={logo} alt={props.url} />
      </Container>
    </header>
  )
}

