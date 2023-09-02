import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Installed 
import { Button, Container } from '@mui/material';
import {  Login, Settings } from '@mui/icons-material';

// Components
import Header from '../components/Header';

function Layout({ children }) {
  Layout.displayName = "Layout";

  const [isReliable, setReliable] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setAuthorized(!!localStorage.getItem("token"))
    setReliable(!!(localStorage.getItem("reliable")));
  }, [])

  return (
    <>
      <Header>
        {(isReliable || authorized) && <Button className='d-row' onClick={() => navigate(!!authorized ? "/sp/images" : "/sp/login")}>
            {authorized ? <Settings/> : <Login />}
          </Button>}
      </Header>
      <Container className='container d-column jc-start'>
        {children}
      </Container>
    </>
  );
}

export default Layout;