
// Installed
import { useNavigate } from 'react-router-dom';
import { Button, Container, IconButton, TextField } from '@mui/material';
import { Close, Home, Search } from '@mui/icons-material';

// Css
import './../assets/css/header.css';

// Json
import jsonConfig from "../assets/json/configuration.json";
import { useState } from 'react';

function Header({ children, authorized, cls, styles }) {
  Header.displayName = "Header";

  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();

  const search = () => {
    navigate(`/search/${searchKeyword}`)
  }

  return (
    <header className={`d-column ${cls}`} style={styles}>

        {/* Logo, navigation */}
        <div className='d-row jc-between'>
          <p className='logotype d-column' style={{ color: !!styles ? (jsonConfig?.TextColor || "#FFFFFF") : "#000000" }} onClick={() => navigate("/")}>
            {jsonConfig?.Name}
            {jsonConfig?.Text && <span>{jsonConfig?.Text}</span>}
          </p>

          <div className='header-buttons d-row'>
            {!authorized && <Button className='d-row' onClick={() => navigate("/")}>
              <Home />
            </Button>}

            {!!children && children}
          </div>
        </div>

        {/* Search */}
        <div className="d-row search-wrapper">
          <TextField
            placeholder="Find image ..."
            className="search-input"
            variant="outlined"
            name="searchKeywords"
            value={searchKeyword}
            style={searchKeyword.length > 0 ? { backgroundColor: "#FFFFFF"} : null}
            inputProps={{
              maxLength: 30
            }}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setSearchKeyword(e.target.value);
            }} />

          <div className='search-buttons d-row'>
            {/* Reset search */}
            {searchKeyword?.length > 3 && <IconButton
              className='reset-search'
              onClick={() => setSearchKeyword("")}
              disabled={searchKeyword.length < 3}>
              <Close />
            </IconButton>}

            {/* Search */}
            <IconButton
              className='search-button'
              onClick={() => search()}
              disabled={searchKeyword.length < 3}>
              <Search />
            </IconButton>
          </div>
        </div>

        {/* Background */}
        <div className='background'></div>

    </header>
  )
}

export default Header;