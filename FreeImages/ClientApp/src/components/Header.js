
// Installed
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Home } from '@mui/icons-material';

// Css
import './../assets/css/header.css';

// Json
import jsonConfig from "../assets/json/configuration.json";
import jsonBackground from "../assets/json/background.json";

function Header({ children, authorized, cls }) {
  Header.displayName = "Header";

  const navigate = useNavigate();


  return (
    <header className={`d-row jc-between ${cls}`} style={{ background: `url(${jsonBackground?.ImgString})` }}>
        <p className='logotype d-column' style={{color: !authorized ? jsonConfig?.TextColor || "#FFFFFF" : "#000000"}} onClick={() => navigate("/")}>
          {jsonConfig.Name}
          {jsonConfig?.Text && <span>{jsonConfig?.Text}</span>}
        </p>

        <div className='header-buttons d-row'>
          {!authorized && <Button className='d-row' onClick={() => navigate("/")}>
            <Home />
          </Button>}

          {!!children && children}
        </div>
        <div className='background'></div>
    </header>
  )
}

export default Header;