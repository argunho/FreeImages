import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert } from '@mui/material';
import Heading from './blocks/Heading';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'author', headerName: 'Author', width: 130 },
  {
    field: 'date',
    headerName: 'Date',
    type: 'string',
    width: 90
  }
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.name || ''} ${params.row.lastName || ''}`,
  // },
];



export default function ImagesList() {

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    getImages();
  }, [])

  const getImages = async () => {
    const _token = localStorage.getItem("token");
    const _config = {
      headers: { 'Authorization': `Bearer ${_token}` }
    };

    const response = await fetch("image", _config);
    const data = await response.json();

    setRows(data || []);
  }

  return (

    <div className='wrapper'>
      <Heading title="Images" />
      {rows.length > 0 ? <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      /> : <Alert severity='info'>Nothing is found.</Alert>}
    </div>
  );
}