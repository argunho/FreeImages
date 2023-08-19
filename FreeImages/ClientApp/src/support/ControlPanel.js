
import { useState, useEffect } from 'react';

// Installed
import { IconButton } from '@mui/material';
import { Close, List } from '@mui/icons-material';
import axios from 'axios';

// Pages
import UploadFile from './UploadFile';

// Components
import Heading from '../components/Heading';

// Json
import configJson from '../assets/json/configuration.json';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

const dropdownMenu = [
  { name: "Header background", value: "bg" },
  { name: "Ads", value: "ads" },
  { name: "Paypal account", value: "paypal" },
  { name: "Seo", value: "seo" }
];

function ControlPanel() {
  ControlPanel.displayName = "ControlPanel";

  const [dropdown, setDropdown] = useState(false);
  const [overflow, setOverflow] = useState(true);
  const [form, setForm] = useState("bg");
  const [response, setResponse] = useState();
  // const [jsonContent, setJsonContent] = useState(JSON.stringify(configJson, null, 2));

  useEffect(() => {
console.log(configJson)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dropdownHandle = (value) => {
    setDropdown(!dropdown)
    if (value) {
      setTimeout(() => {
        setOverflow(!overflow);
      }, 1000)
    } else
      setOverflow(!overflow);
  }

  const clickHandle = (e) => {
    setForm(e.target.name);
    setDropdown(false);
  }

  const onSubmitImage = async (value) => {
    const data = {
      jsonString: value,
      fileName: "configuration.json",
      name: "headerBackground"
    }

    onSubmit(data);
  }

  const onSubmit = async (data) => {
    await axios.post("data/updateJsonFile", data, HeaderConfig).then(res => {
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
              return <p key={ind} name={i.value} onClick={clickHandle}
                className={i.value === form ? "active" : ""}> - {i.name}</p>
            })}
          </div>
        </div>
      </Heading>

      {form === "bg" && <UploadFile import={true} submit={onSubmitImage} response={response} />}
    </div>
  )
}

export default ControlPanel
