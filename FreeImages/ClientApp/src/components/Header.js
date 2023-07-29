import { Button } from '@mui/material';
import { Home, Login } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Css
import './../css/header.css';

function Header({ children, url }) {

  const defButtons = [{ icon: <Home />, url: "/ " }];
  const [buttons, setButtons] = useState(defButtons);

  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!!children)
      return;
    const isReliable = localStorage.getItem("reliable");
    if (!!isReliable && loc.pathname.indexOf("login") === -1)
      setButtons(oldButtons => [...oldButtons, { icon: <Login />, url: "/login" }]);
    else
      setButtons(defButtons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc])

  return (
    <header className='d-row jc-between'>
      <p className='logotype d-column' onClick={() => navigate("/")}>
        Free images
        <span>Hobby photo online</span>
      </p>
      <div className='header-buttons d-row'>

        {!children && buttons?.map((b, index) => (
          <Button key={index} className='d-row' onClick={() => navigate(b.url)}>
            {b.icon}
          </Button>
        ))}

        {!!children && children}
      </div>
    </header>
  )
}

export default Header;