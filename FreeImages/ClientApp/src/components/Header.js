import { useNavigate } from 'react-router-dom';

// Css
import './../css/header.css';

function Header({ children, url }) {

  const navigate = useNavigate();

  return (
    <header className='d-row jc-between'>
      <p className='logotype d-column' onClick={() => navigate("/")}>
        Free images
        <span>Hobby photo online</span>
      </p>

      <div className='header-buttons d-row'>

        {!!children && children}
     
      </div>
    </header>
  )
}

export default Header;