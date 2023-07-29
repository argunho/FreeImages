import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(!!token)
    if (!!token) navigate(-1);
  }, [navigate])

  const handleClick = () => {
    setVisible(!visible);
  }

  return (
    <>
      <Header>
        {/* Menu button for authorized users */}
        <Button
          className={'menu-button' + (visible ? " menu-open" : "")}
          onClick={handleClick}
          disabled={visible}
        >
          {visible ? <MenuOpen color='#ccc' /> : <Menu />}
        </Button>
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