import { useState, useEffect } from 'react';

// Installed
import { TextField, Pagination, IconButton } from '@mui/material';
import { Close, ImageNotSupportedOutlined, Search } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FlatList from 'flatlist-react/lib';

// Components
import Loading from '../components/Loading';

// Css
import '../assets/css/gallery.css';
// import '../assets/gallery.css';

function Home() {
  Home.displayName = "Home";

  const [imgs, setImgs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loc = useLocation();
  const { num, keyword } = useParams();
  const perPage = 20;

  useEffect(() => {
    setLoading(true);
    if (!!num)
      setPage(parseInt(num));
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc])

  const get = async () => {
    setImgs([]);

    const res = await fetch(`image/${page}/${perPage}` + (!!keyword ? `/${keyword}` : ""));
    const data = await res.json();
    if (!!data) {
      const imgs = data?.images;
      const images = [[], [], [], []];
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
      setPageCount(countOfPages(data?.count));
      setImgs(images);
      setSearchKeyword("");
    }
  }

  const countOfPages = (count) => {
    let number = count / perPage;

    if (Number(number) === number && number % 1 !== 0)
      number = Math.floor(number) + 1;

    return number;
  }

  const search = () => {
    navigate(`/search/${searchKeyword}${page > 1 ? "/" + page : ""}`)
  }

  const renderImg = (img, ind) => {
    if (!img?.base64)
      return null;
    return <div key={ind} className='gallery-img-wrapper d-column'>
      <img src={img?.base64String}
        className="gallery-img"
        onClick={() => navigate(`/view/img/${img.imageId}`)}
        alt={window.location.origin} /></div>
  }

  const paginate = (e, value) => {
    setPage(value);
    if (!!keyword)
      search();
    else
      navigate("/" + (value > 1 ? value : ""));
  }

  return (
    <div className='gallery-container'>

      {/* Search */}
      <div className="search-wrapper d-row">
        <TextField
          placeholder="Find image ..."
          className="search-input"
          variant="outlined"
          name="searchKeywords"
          value={searchKeyword}
          inputProps={{
            maxLength: 30
          }}
          disabled={loading || (!keyword && imgs?.length === 0)}
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
            disabled={loading || searchKeyword.length < 3}>
            <Close />
          </IconButton>}

          {/* Search */}
          <IconButton
            className='search-button'
            onClick={() => search()}
            disabled={loading || searchKeyword.length < 3}>
            <Search />
          </IconButton>
        </div>
      </div>

      {/* Gallery */}
      {/* <div className="gallery-wrapper" >
          <FlatList
            list={imgs[0]?.concat(imgs[1])?.concat(imgs[2])?.concat(imgs[3])}
            renderItem={(img) => {
              return <div className="gallery-img-wrapper" key={img.id}>
                <img
                  className="gallery-img"
                  src={img.base64String}
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
        {pageCount > 1 && <div className='buttons-wrapper d-row'>
          <Pagination variant="outlined" color="secondary" count={pageCount} page={page} onChange={paginate} />
        </div>}

      </div>}

      {loading && <Loading><p>Images loads ...</p></Loading>}
    </div>
  );
}

export default Home;