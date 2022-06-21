import React, { useEffect, useState } from 'react'
import { Container } from 'reactstrap';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

import logo from './../../../images/logo.png';
import './../../../css/header.css';
import { Menu } from '@mui/icons-material';
import SupportMenu from '../../support/blocks/SupportMenu';

export default function Header(props) {

  const [authorized, setAuthorized] = useState(false);
  const [visible, setVisible] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthorized(token !== null && token !== undefined);
  }, [])

  return (
    <>
      <header>
        <Container>
          <img className='logotype' onClick={() => history.push("/")} src={logo} alt={props.url} />

          {!authorized ?
            <Button className='menu-button' onClick={() => setVisible(!visible)}>
              <Menu />
            </Button> : null}
        </Container>
      </header>
      {visible ? <div className='curtain'><SupportMenu /></div> : null}
    </>

  )
}

