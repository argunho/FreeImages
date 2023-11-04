import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Installed 
import { Button, Container } from '@mui/material';
import { Login, Settings } from '@mui/icons-material';

// Components
import Header from '../components/Header';

// Json
import config from '../assets/json/configuration.json';
import jsonBackground from "../assets/json/background.json";

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
      <Header styles={{ background: `url(${jsonBackground?.ImgString})` }}>
        {(isReliable || authorized) && <Button className='d-row' onClick={() => navigate(!!authorized ? "/sp/images" : "/sp/login")}>
          {authorized ? <Settings /> : <Login />}
        </Button>}
      </Header>
      <Container className='container d-column jc-between'>
        {children}
    
        <footer>
            
        </footer>
      </Container>
    </>
  );
}

export default Layout;