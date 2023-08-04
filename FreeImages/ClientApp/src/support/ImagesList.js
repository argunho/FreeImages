import * as React from 'react';

// Components
import List from '../components/List';
import { AddAPhoto} from '@mui/icons-material';

const columns = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'author', headerName: 'Author', width: 200 },
  {
    field: 'date',
    headerName: 'Date',
    width: 200,
    valueGetter: (params) => new Date(params.row.date.toString()).toLocaleDateString([],{year: "numeric", month: "long", day: "numeric"})
  }
];

function ImagesList() {
  return (
    <List api="image" columns={columns} title="Images" columnWidth={430} view={true} button={{
      title: "Upload an image",
      url: "/sp/upload-image",
      icon: <AddAPhoto />
    }}/>
  );
}

export default ImagesList;