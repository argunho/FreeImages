import * as React from 'react';
import List from './blocks/List';

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
  return (
    <List api="image" columns={columns} title="Images"/>
  );
}