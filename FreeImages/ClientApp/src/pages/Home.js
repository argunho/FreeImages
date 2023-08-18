import { useState, useEffect } from 'react';

// Installed
import { TextField, Button, FormControl, Pagination } from '@mui/material';
import { ImageNotSupportedOutlined, Search } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FlatList from 'flatlist-react/lib';

// Components
import Loading from '../components/Loading';


// Css
import '../css/gallery.css';

function Home() {
  Home.displayName = "Home";

  const [imgs, setImgs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loc = useLocation();
  const { number, keywords } = useParams();
  const perPage = 4;

  useEffect(() => {
    setLoading(true);
    console.log(number)
    if (!!number)
      setPage(parseInt(number));
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc])

  const get = async () => {
    setImgs(null);
    const res = (!!keywords) ? await fetch(`image/${number || page}/${perPage}/${keywords}`)
      : await fetch(`image/${number || page}/${perPage}`);
    const data = await res.json();
    if (!!data) {
      const imgs = data?.images;
      const images = [[],[],[],[]];
      for (var i = 0; i < imgs?.length; i++) {
        if ([3, 7, 11, 15, 19].indexOf(i) > -1)
          images[3].push(imgs[i])
        else if ([2, 6, 10, 14, 18].indexOf(i) > -1)
          images[2].push(imgs[i])
        else if ([1, 5, 9, 13, 17].indexOf(i) > -1)
          images[1].push(imgs[i])
        else
          images[0].push(imgs[i])
      }
      setLoading(false);
      setCount(data?.count);
      setImgs(images);
    }
  }

  const search = () => {
    navigate(`/${searchKeyword}/${page > 1 ? page : ""}`)
  }

  const renderImg = (img, ind) => {
    if (!img?.base64)
      return null;
    return <div key={ind} className='gallery-img-wrapper d-column'>
      <img src={img?.base64String}
        className="gallery-img"
        onClick={() => navigate(`view/img/${img.imageId}`)}
        alt={window.location.origin} /></div>
  }

  const paginate = (e, value) => {
    setPage(value);
    if (!!keywords)
      search();
    else
      navigate("/" + (value > 1 ? value : ""));
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
          disabled={loading && (!keywords && imgs?.length === 0)}
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

      {!loading && <div className='gallery-row'>

        {Array(4).fill().map((v, ind) => {
          return <div className='gallery-column d-column jc-start' key={ind}>
            {imgs[ind]?.length > 0 && <FlatList
              list={imgs[ind]}
              renderItem={renderImg}
              renderWhenEmpty={() => <div className='not-found d-column'><ImageNotSupportedOutlined /></div>}
            />}
          </div>
        })}

        {/* Pagination */}
        {count > perPage && <div className='buttons-wrapper d-row'>
          <Pagination variant="outlined" color="secondary" count={count % perPage} page={page} onChange={paginate} />
        </div>}

      </div>}

      {loading && <Loading><p>Images loads ...</p></Loading>}
    </div>
  );
}

export default Home;