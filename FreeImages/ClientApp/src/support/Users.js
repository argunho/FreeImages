// Installed
// Components
import List from '../components/List'
import { AddModerator } from '@mui/icons-material';

const columns = [
  { field: 'name', headerName: 'Name', width: 250 },
  {
    field: 'roles',
    headerName: 'Roles',
    width: 300,
    sortable: false,
    disableColumnMenu: true,
    disableColumnSelector: true,
    disableColumnFilter: true,
  }
]

function Users() {
  return (
    <List api="user" columns={columns} title="Users" width={550} button={{
      title: "Register a new user",
      url: "/sp/register",
      icon: <AddModerator />
    }} view={false} />
  )
}

export default Users;