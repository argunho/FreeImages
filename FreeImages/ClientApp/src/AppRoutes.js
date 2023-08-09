// Layouts
import Layout from "./layouts/Layout";
import SupportLayout from "./layouts/SupportLayout";

// Support
import ImagesList from "./support/ImagesList";
import Logout from "./support/Logout";
import Users from "./support/Users";
import Login from "./support/Login";
import UploadFile from "./support/UploadFile";
import UserEdit from "./support/UserFormPagejs";
import Register from "./support/Register";
import LoginWithHash from "./support/LoginWithHash";

// Pages
import Home from "./pages/Home";
import UserFormPage from "./support/UserFormPagejs";

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
        element: <Register post={true} />
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
        path: "/sp/users/new",
        element: <UserFormPage api="account/register"
          inputs={{
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
          }} 
          post={true} />
      },
      {
        path: "/sp/users/edit/:id",
        element: <UserFormPage api="user" />
      },
      {
        path: "/sp/users/edit/password/:id",
        element: <UserFormPage api="user/changePassword" inputs={{
          currentPassword: "",
          password: "",
          confirmPassword: ""
        }} />
      },
      {
        path: '/sp/images/edit/:id',
        element: <Logout />
      }
    ]
  }
]

export default AppRoutes;
