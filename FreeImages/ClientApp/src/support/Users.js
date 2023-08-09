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
    <List api="user" columns={columns} title="Users" columnWidth={550} button={{
      title: "Register a new user",
      url: "new",
      icon: <AddModerator />
    }} view={false} />
  )
}

export default Users;