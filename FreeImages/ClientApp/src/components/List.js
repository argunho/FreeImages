// Components
import { useEffect, useState } from 'react';

// Installed 
import { Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Components
import Heading from './Heading';

// Functions
import HeaderConfig from '../functions/HeaderConfig';
import Loading from './Loading';


function List(props) {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([
    { field: 'actions', headerName: 'Actions', sortable: false, width: "auto" }
  ])

  useEffect(() => {
    setLoading(true);
    const arr = props.columns.concat(columns);
    setColumns(arr);
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getList = async () => {
    const response = await fetch(props.api, HeaderConfig);
    const data = await response.json();
    setLoading(false);
    setRows(data);
  }



  return (
    <div className='wrapper'>
      <Heading title={props.title} button={props.button} />
      {!!loading && <Loading />}
      {rows.length > 0 ? <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      /> : <Alert severity='info'>Nothing is found.</Alert>}
    </div>
  )
}

export default List;