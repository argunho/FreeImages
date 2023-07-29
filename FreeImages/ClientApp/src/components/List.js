import { Alert } from '@mui/material';
import React from 'react'

// Components
import Heading from './Heading';

function List(props) {

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
      getImages();
    }, [])
  
    const getImages = async () => {
      const _token = localStorage.getItem("token");
      const _config = {
        headers: { 'Authorization': `Bearer ${_token}` }
      };
  
      const response = await fetch(props.api, _config);
      const data = await response.json();
  
      setRows(data || []);
    }

  return (
    <div className='wrapper'>
    <Heading title={props.title} />
    {/* {rows.length > 0 ? <DataGrid
      rows={rows}
      columns={props.columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
    /> : <Alert severity='info'>Nothing is found.</Alert>} */}
  </div>
  )
}

export default List;