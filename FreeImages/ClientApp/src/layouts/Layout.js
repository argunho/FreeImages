import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Installed 
import { Button, Container } from '@mui/material';
import {  Login } from '@mui/icons-material';

// Components
import Header from '../components/Header';

function Layout({ children }) {
  Layout.displayName = "Layout";

  const [isReliable, setReliable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setReliable(!!(localStorage.getItem("reliable")));
  }, [])

  return (
    <>
      <Header>
        {isReliable && <Button className='d-row' onClick={() => navigate("/sp/login")}>
            <Login />
          </Button>}
      </Header>
      <Container className='d-column container'>
        {children}
      </Container>
    </>
  );
}

export default Layout;