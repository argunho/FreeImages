import React from 'react'
import List from './blocks/List'

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'author', headerName: 'Author', width: 130 }
]

export default function Users(props) {
  console.log(props)
  return (
    <List api="user" columns={columns} title="Users"/>
  )
}
