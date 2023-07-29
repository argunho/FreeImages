import React from 'react'

// Components
import List from '../components/List'

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'author', headerName: 'Author', width: 130 }
]

function Users(props) {
  return (
    <List api="user" columns={columns} title="Users"/>
  )
}

export default Users;