import { useNavigate } from 'react-router-dom';

// Css
import './../css/header.css';
import { Button } from '@mui/material';
import { Home } from '@mui/icons-material';

function Header({ children, authorized, url }) {

  const navigate = useNavigate();

  return (
    <header className='d-row jc-between'>
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