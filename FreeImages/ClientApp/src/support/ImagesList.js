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

function ImagesList() {
  return (
    <List api="image" columns={columns} title="Images" actionsWidth={530} view={true} button={{
      title: "Upload an image",
      url: "/sp/upload-image",
      icon: <AddAPhoto />
    }}/>
  );
}

export default ImagesList;