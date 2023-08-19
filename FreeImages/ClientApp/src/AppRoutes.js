// Layouts
import Layout from "./layouts/Layout";
import SupportLayout from "./layouts/SupportLayout";

// Support
import ImagesList from "./support/ImagesList";
import Logout from "./support/Logout";
import Users from "./support/Users";
import Login from "./support/Login";
import UploadFile from "./support/UploadFile";
import Register from "./support/Register";
import LoginWithHash from "./support/LoginWithHash";
import UserFormPage from "./support/UserFormPage";

// Pages
import Home from "./pages/Home";
import FileFormPage from "./support/FileFormPage";
import ControlPanel from "./support/ControlPanel";

const AppRoutes = [
  {
    layout: Layout,
    routes: [
      {
        path: "/*",
        element: <Home />
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/:num",
        element: <Home />
      },
      {
        path: "/search/:keyword",
        element: <Home />
      },
      {
        path: "search/:keyword/:num",
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
        path: '/sp/images/upload',
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
        path: "/sp/users/new",
        element: <UserFormPage
          api="account/register"
          inputs={{
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
          }}
          heading="New user" />
      },
      {
        path: "/sp/users/edit/:id",
        element: <UserFormPage
          api="user"
          heading="Edit user"
        />
      },
      {
        path: "/sp/users/edit/password/:id",
        element: <UserFormPage
          api="account/changePassword"
          inputs={{
            currentPassword: "",
            password: "",
            confirmPassword: ""
          }}
          heading="Change password" />
      },
      {
        path: '/sp/images/edit/:id',
        element: <FileFormPage />
      },
      {
        path: "/sp/control/panel",
        element: <ControlPanel />
      }
    ]
  }
]

export default AppRoutes;
