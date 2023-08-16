import { useState, useEffect } from 'react';

// Installed
import { TextField, Button, FormControl, CardMedia } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FlatList from 'flatlist-react/lib';

// Css
import '../css/gallery.css';

function Home() {

  const [imgs, setImgs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const get = async () => {
    const res = await fetch(`image/${page}/${perPage}`);
    const data = await res.json();
    if (!!data) {
      const images = {
        arr01: [],
        arr02: [],
        arr03: [],
        arr04: [],
      }
      for (var i = 0; i < data.length; i++) {
        if ([3, 7, 11, 15, 19].indexOf(i) > -1)
          images.arr04.push(data[i])
        else if ([2, 6, 10, 14,18].indexOf(i) > -1)
          images.arr03.push(data[i])
        else if ([1, 5, 9, 13,17].indexOf(i) > -1)
          images.arr02.push(data[i])
        else
          images.arr01.push(data[i])
      }
      setImgs(images);
    }

  }

  const search = async () => {
    if (searchKeyword.length < 3) return;
    const res = await fetch(`image/search/${page}/${perPage}/${searchKeyword}`)
    setImgs(await res.json());
  }

  const renderImg = (img, ind) => {
    return <div key={ind} className='gallery-img-wrapper d-column'>
      <img src={img.path}
        className="gallery-img"
        onClick={() => navigate(`view/img/${img.imageId}`)}
        alt={window.location.origin} /></div>
  }

  return (
    <div className='gallery-container'>
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

      {/* Gallery */}
      {/* <div className="gallery-wrapper" >
          <FlatList
            list={imgs}
            renderItem={(img) => {
              return <div className="gallery-img-wrapper" key={img.id}>
                <img
                  className="gallery-img"
                  src={img.path.replace("resized_", "")}
                  alt={img.name}
                />
              </div>
            }}
            renderWhenEmpty={() => <div className='not-found'>Not found</div>}
          />
        </div> */}

      <div className='gallery-row'>

        {Array(4).fill().map((v, ind) => {
          const index = ind + 1;
          return <div className='gallery-column d-column jc-start' key={ind}>
            <FlatList
              list={imgs[`arr0${index}`]}
              renderItem={renderImg}
              renderWhenEmpty={() => <div className='not-found'>Not found</div>}
            />
          </div>
        })}

      </div>
    </div>
  );
}

export default Home;