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


// const rows = [
//   { id: 1, lastName: 'Snow', name: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', name: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', name: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', name: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', name: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', name: null, age: 150 },
//   { id: 7, lastName: 'Clifford', name: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', name: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', name: 'Harvey', age: 65 },
// ];

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
    console.log(data);
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