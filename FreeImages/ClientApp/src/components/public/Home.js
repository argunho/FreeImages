import React, { Component, useState } from 'react';
import { TextField, Button, FormControl } from '@mui/material';
import { Search, SettingsRemoteSharp } from '@mui/icons-material';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Home(props) {

  const [imgs, setImgs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const storage = "https://uploadfilerepository.blob.core.windows.net/uploadfilecontainer/";
  
  useEffect(() => {
    get();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const get = async () => {
    const res = (searchKeyword.length >= 3) ?
      await fetch(`image/search/${page}/${perPage}/${searchKeyword}`)
      : await fetch(`image/images/${page}/${perPage}`);
    const data = await res.json();
    console.log(data)
  }


    return (
      <div>
        <FormControl className="search-wrapper">
          <TextField
            label="Search"
            className="search-input"
            variant="outlined"
            name="searchKeywords"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)} />
          <Button variant='text'
            className='search-button'
            onClick={() => get()}
            disabled={loading || searchKeyword.length < 3}>
            <Search />
          </Button>
        </FormControl>

        <div className='gallery'>
          {imgs.map((i, index) => (
            <img src={storage + i.imgName} 
            className="gallery-img"
            onClick={() => history.push(i.imgName.slice(i.imgName.lastIndexOf(".") + 1))} 
            alt={window.location.origin} />
          ))} 
        </div>
      </div>
    );
}