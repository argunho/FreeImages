import * as React from 'react';

// Installed
import { AddAPhoto, Check } from '@mui/icons-material';

// Components
import List from '../components/List';

const columns = [
  { field: 'viewName', headerName: 'Name', width: 200 },
  { field: 'author?.name', headerName: 'Author', width: 200 },
  {
    field: 'date',
    headerName: 'Date',
    width: 200,
    valueGetter: (params) => new Date(params.row.date.toString()).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" })
  },
  {
    field: 'visible', 
    headerName: 'Visible', 
    width: 100,
    filterable: false,
    disableColumnMenu: true, disableColumnSelector: true, disableColumnFilter: true,
    renderCell: (params) => <Check color={params?.visible ? "success" : "disabled"} style={{margin: "auto"}}/>
  },
];

function ImagesList() {
  ImagesList.displayName = "ImagesList";
  
  return (
    <List api="image" columns={columns} title="Images" columnWidth={400} view={true} button={{
      title: "Upload an image",
      url: "upload",
      icon: <AddAPhoto />
    }} />
  );
}

export default ImagesList;