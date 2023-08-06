import { useState } from 'react';
import { TextField, Button, FormControl } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {

  const [imgs, setImgs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const storage = "https://uploadfilerepository.blob.core.windows.net/uploadfilecontainer/";

  useEffect(() => {
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const get = async () => {
    const res = await fetch(`image/${page}/${perPage}`);
    setImgs(await res.json());
  }

  const search = async () => {
    if (searchKeyword.length < 3) return;
    const res = await fetch(`image/search/${page}/${perPage}/${searchKeyword}`)
    setImgs(await res.json());
  }


  return (
    <>
      <FormControl className="search-wrapper d-row">
        <TextField
          placeholder="Find image ..."
          className="search-input"
          variant="outlined"
          name="searchKeywords"
          value={searchKeyword}
          inputProps={{
            maxLength: 30
          }}
          onChange={(e) => setSearchKeyword(e.target.value)} />
        <Button variant='text'
          className='search-button'
          onClick={() => search()}
          disabled={loading || searchKeyword.length < 3}>
          <Search />
        </Button>
      </FormControl>

      <div className='gallery'>
        {imgs.map((i, index) => (
          <img src={i.path}
            className="gallery-img"
            key={index}
            onClick={() => navigate(i.imgName.slice(i.imgName.lastIndexOf(".") + 1))}
            alt={window.location.origin} />
        ))}
      </div>
    </>
  );
}

export default Home;