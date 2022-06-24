import React, { useEffect, useState } from 'react'
import { Container } from 'reactstrap';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

import logo from './../../../images/logo.png';
import './../../../css/header.css';
import { Home, Menu, MenuOpen, Settings } from '@mui/icons-material';
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
          <div className='header-buttons'>
            <Button onClick={() => history.push("/")}>
              <Home />
            </Button>
            {!authorized ?
              <Button
                className={'menu-button' + (visible ? " menu-open" : "")}
                onClick={() => setVisible(!visible)}
                disabled={visible}
              >
                {visible ? <MenuOpen color='#ccc' /> : <Menu />}
              </Button> : null}
          </div>

        </Container>
      </header>
      {/* <div className='curtain'></div> */}
      {visible ? <SupportMenu authorized={authorized} visible={visible} hide={(value) => setVisible(value)} /> : null}
    </>

  )
}

