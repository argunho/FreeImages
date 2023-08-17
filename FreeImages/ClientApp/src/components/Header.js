
import { useEffect, useState } from 'react';

// Installed
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import axios from 'axios';

// Css
import './../css/header.css';

function Header({ children, authorized, cls }) {

  const [bgImg, setBgImg] = useState();

  const navigate = useNavigate();


  return (
    <header className={`d-row jc-between ${cls}`} style={!!bgImg ? { background: `url(${bgImg})` } : null}>
      <p className='logotype d-column' onClick={() => navigate("/")}>
        Free images
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