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
import LoginWithHash from "./support/LoginWithHash";

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
        path: "/sp/login/:hash",
        element: <LoginWithHash />
      },
      {
        path: '/sp/logout',
        element: <Logout />
      },
      {
        path: "/sp/users/edit/:id",
        element: <UserEdit api="user" />
      },
      {
        path: "/sp/users/edit/password/:id",
        element: <UserEdit api="user/changePassword" inputs={{ 
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
