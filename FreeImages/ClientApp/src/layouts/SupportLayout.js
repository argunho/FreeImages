import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Installed
import { Button, Container } from '@mui/material';
import { MenuOpen, Menu } from '@mui/icons-material';
import jwt_decode from "jwt-decode";

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
    if (!!token) {
      const decoded = jwt_decode(token);
      console.log(29, (decoded.exp * 1000) < Date.now())
      if ((decoded.exp * 1000) < Date.now()) {
        localStorage.removeItem("token");
        navigate("/");
      } else
        setAuthorized(true);
    } else if (!token && loc.pathname.indexOf("login") === -1 && loc.pathname.indexOf("register") === -1)
      navigate(-1);

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