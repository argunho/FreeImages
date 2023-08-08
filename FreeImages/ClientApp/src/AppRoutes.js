// Layouts
import Layout from "./layouts/Layout";
import SupportLayout from "./layouts/SupportLayout";

// Support
import ImagesList from "./support/ImagesList";
import Logout from "./support/Logout";
import Users from "./support/Users";
import Login from "./support/Login";
import UploadFile from "./support/UploadFile";
import UserEdit from "./support/UserEdit";
import Register from "./support/Register";

// Pages
import Home from "./pages/Home";

const AppRoutes = [
  {
    layout: Layout,
    routes: [
      {
        path: "/",
        element: <Home />
      }
    ]
  },
  {
    layout: SupportLayout,
    routes: [
      {
        path: '/sp/users',
        element: <Users />
      },
      {
        path: '/sp/images',
        element: <ImagesList />
      },
      {
        path: '/sp/upload-image',
        element: <UploadFile />
      },
      {
        path: '/sp/register',
        element: <Register />
      },
      {
        path: "/sp/login",
        element: <Login />
      },
      {
        path: '/sp/logout',
        element: <Logout />
      },
      {
        path: "/sp/users/edit/:id",
        element: <UserEdit inputs={{
          name: "",
          email: ""
        }} />
      },
      {
        path: "/sp/users/edit/password/:id",
        element: <UserEdit inputs={{ 
          currentPassword: "", 
          password: "", 
          confirmPassword: "" }} confirmInputs={["password", "confirmPassword"]} />
      },
      {
        path: '/sp/images/edit/:id',
        element: <Logout />
      }
    ]
  }
]

export default AppRoutes;
