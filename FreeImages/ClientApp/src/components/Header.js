
import { useEffect, useState } from 'react';

// Installed
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import axios from 'axios';

// Css
import './../css/header.css';

function Header({ children, authorized, url }) {

  const [bgImg, setBgImg] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const bg = localStorage.getItem("bg");
    if (!!bg)
      setBgImg(bg);
    (async () => {
      const res = await axios.get("image/bg");

      if (res.status === 200) {
        setBgImg(res.data);
        localStorage.setItem("bg", res.data);
      }
    })();
  }, [])

  return (
    <header className='d-row jc-between' style={!!bgImg ? { background: `url(${bgImg})` } : null}>
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