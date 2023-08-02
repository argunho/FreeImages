// Installed
// Components
import List from '../components/List'
import { AddModerator } from '@mui/icons-material';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'roles', headerName: 'Role', width: 130 }
]

function Users() {
  return (
    <List api="user" columns={columns} title="Users" button={{
      title: "Register a new user",
      url: "/sp/register",
      icon: <AddModerator />
    }}/>
  )
}

export default Users;