
import { useState } from 'react';

// Installed
import { IconButton } from '@mui/material';
import { Close, List } from '@mui/icons-material';
import axios from 'axios';

// Pages
import UploadFile from './UploadFile';

// Components
import Heading from '../components/Heading';
import Form from '../components/Form';


// Json
import configJson from '../assets/json/configuration.json';
import backgroundJson from '../assets/json/background.json';
import seoJson from '../assets/json/seo.json';

// Functions
import HeaderConfig from '../functions/HeaderConfig';
import { useNavigate, useParams } from 'react-router-dom';

const dropdownMenu = [
  { name: "Page settings", value: "page" },
  { name: "Storage connection", value: "storage" },
  { name: "Seo data", value: "seo" }
];

function ControlPanel() {
  ControlPanel.displayName = "ControlPanel";

  const { param } = useParams();
  const navigate = useNavigate();

  const [dropdown, setDropdown] = useState(false);
  const [overflow, setOverflow] = useState(true);
  const [response, setResponse] = useState();

  const dropdownHandle = (value) => {
    setDropdown(!dropdown)
    if (value) {
      setTimeout(() => {
        setOverflow(!overflow);
      }, 1000)
    } else
      setOverflow(!overflow);
  }

  const clickHandle = (value) => {
    navigate("/sp/control/panel/" + value);
    setDropdown(false);
    setOverflow(!overflow);
  }

  const onSubmit = async (data) => {
    if(param === "seo")
      data.url = window.location.href;
      await axios.post(`data/${param}`, data, HeaderConfig).then(res => {
        setResponse(res.data);
      }, error => {
        console.log(error);
      })
  }

  return (
    <div className='wrapper'>
      <Heading title="Control panel" visible={!overflow}>
        <div className='dropdown-wrapper d-row'>
          <IconButton onClick={() => dropdownHandle(dropdown)}>
            {dropdown ? <Close /> : <List />}
          </IconButton>
          <div className={'dropdown-list' + (dropdown ? " open" : "")}>
            {dropdownMenu.map((i, ind) => {
              return <p key={ind} onClick={() => clickHandle(i.value)}
                className={i.value === param ? "active" : ""}> - {i.name}</p>
            })}
          </div>
        </div>
      </Heading>

      {/* Page configuration form */}
      {param === "page" && 
        <UploadFile inputs={{
                name: configJson?.Name,
                text: configJson?.Text,
                textColor: configJson?.TextColor,
                searchColor: configJson?.SearchColor,
                adsApi: configJson?.AdsApi,
                paypal: configJson?.Paypal,
                instagram: configJson?.Instagram
              }}  label="Page configuration" image={backgroundJson?.ImgString} response={response} submit={onSubmit} />}

      {/* Seo form */}
      {param === "seo" && 
        <UploadFile inputs={{
                title: seoJson?.Title,
                keywords: seoJson?.Keywords,
                description: seoJson?.Description,
                type: seoJson?.Type
              }} label="Page seo" image={seoJson?.ImgString} response={response} submit={onSubmit} />}

      {/* Storage */}
      {param === "storage" && 
        <Form inputs={{connection: ""}}
              heading={"Storage configuration"}                
              response={response}
              required={true}
              onSubmit={onSubmit} />}

    </div>
  )
}

export default ControlPanel
