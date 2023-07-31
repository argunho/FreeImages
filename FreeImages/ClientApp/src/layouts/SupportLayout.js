import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { MenuOpen, Menu } from '@mui/icons-material';

// Components
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

// Css
import './../css/support.css';

function SupportLayout({ children }) {
  SupportLayout.displayName = "SupportLayout";

  const [visible, setVisible] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && loc.pathname.indexOf("login") === -1 && loc.pathname.indexOf("register") === -1)
      navigate(-1);
    else if (!!token)
      setAuthorized(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc])

  const handleClick = () => {
    setVisible(!visible);
  }

  return (
    <>
      <Header authorized={authorized}>
        {/* Menu button for authorized users */}
        {authorized && <Button
          className={'menu-button' + (visible ? " menu-open" : "")}
          onClick={handleClick}
          disabled={visible}
        >
          {visible ? <MenuOpen color='#ccc' /> : <Menu />}
        </Button>}
      </Header>
      <Container>
        {children}
      </Container>

      {/* <div className='curtain'></div> */}
      {visible ? <SideMenu visible={visible} hide={(value) => setVisible(value)} /> : null}
    </>
  );
}

export default SupportLayout;