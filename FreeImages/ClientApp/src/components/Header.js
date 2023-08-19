
import { useState } from 'react';

// Installed
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Home } from '@mui/icons-material';

// Css
import './../assets/css/header.css';

// Json
import jsonConfig from "../assets/json/configuration.json";

function Header({ children, authorized, cls }) {
  Header.displayName = "Header";

  const navigate = useNavigate();


  return (
    <header className={`d-row jc-between ${cls}`} style={{ background: `url(${jsonConfig.headerBackground})` }}>
      <p className='logotype d-column' onClick={() => navigate("/")}>
        {jsonConfig.name}
        <span>100% free to use</span>
      </p>

      <div className='header-buttons d-row'>
        {!authorized && <Button className='d-row' onClick={() => navigate("/")}>
          <Home />
        </Button>}

        {!!children && children}
      </div>
    </header>
  )
}

export default Header;