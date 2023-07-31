import React from 'react';

// Components
import Header from '../components/Header';
import { Button, Container } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { Home, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Layout({ children }) {
  Layout.displayName = "Layout";

  const defButtons = [{ icon: <Home />, url: "/" }];
  const [buttons, setButtons] = useState(defButtons);
  const navigate = useNavigate();

  useEffect(() => {
    if (!!(localStorage.getItem("reliable")))
      setButtons(oldButtons => [...oldButtons, { icon: <Login />, url: "/sp/login" }])
    else if (buttons.length > defButtons.length)
      setButtons(defButtons);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header>
        {buttons?.map((b, index) => (
          <Button key={index} className='d-row' onClick={() => navigate(b.url)}>
            {b.icon}
          </Button>
        ))}
      </Header>
      <Container className='d-column container'>
        {children}
      </Container>
    </>
  );
}

export default Layout;