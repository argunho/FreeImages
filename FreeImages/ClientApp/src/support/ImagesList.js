import * as React from 'react';

// Installed
import { AddAPhoto} from '@mui/icons-material';

// Components
import List from '../components/List';

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
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
    <List api="image" columns={columns} title="Images" columnWidth={500} view={true} button={{
      title: "Upload an image",
      url: "upload",
      icon: <AddAPhoto />
    }}/>
  );
}

export default ImagesList;