import { useState, useEffect } from 'react';

// Installed
import { TextField, Button, FormControl } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FlatList from 'flatlist-react/lib';

// Css
import '../css/gallery.css';

function Home() {

  const [imgs, setImgs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(16);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // const storage = "https://uploadfilerepository.blob.core.windows.net/uploadfilecontainer/";

  const widths = [500, 1000, 1600];
  const ratios = [2.2, 4, 6, 8];
  const images = [
    { src: "https://picsum.photos/id/1018/1920/1080/", aspect_ratio: 16 / 9 },
    { src: "https://picsum.photos/id/1015/1920/1080/", aspect_ratio: 16 / 9 },
  ]

  useEffect(() => {
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const get = async () => {
    const res = await fetch(`image/${page}/${perPage}`);
    const data = await res.json();
    console.log(data)
    setImgs(data);
  }

  const search = async () => {
    if (searchKeyword.length < 3) return;
    const res = await fetch(`image/search/${page}/${perPage}/${searchKeyword}`)
    setImgs(await res.json());
  }

  const renderImg = (img, ind) => {
    console.log(img)
    return <div className='divs'><img key={ind} src={img.path}
      className="gallery-img"
      onClick={() => navigate(`view/img/${img.imageId}`)}
      alt={window.location.origin} />
        </div>
  }
  const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];

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

      <div className='gallery-row'>
        {Array(4).fill().map((v, ind) => {
          const firstNumber = ind * 6 + (ind % 2 === 0 ? 0 : 1);
          const lastNumber = firstNumber + 6 + (ind % 2 === 0 ? 0 : 1);
          console.log("sliced", arr.slice(firstNumber, lastNumber))
          return <div className='gallery-column' key={ind}>
            <FlatList
              list={imgs.slice(firstNumber, lastNumber)}
              renderItem={renderImg}
              renderWhenEmpty={() => <div className='not-found'>Not found</div>}
            />
          </div>
        })}
      </div>

      {/* <div className="gallery-wrapper">
                <FlatList
              list={imgs}
              renderItem={renderImg}
              renderWhenEmpty={() => <div className='not-found'>Not found</div>}
            />
      </div> */}
    </div>
  );
}

export default Home;