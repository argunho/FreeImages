import Layout from "./layouts/Layout";
import SupportLayout from "./layouts/SupportLayout";

// Support
import ImagesList from "./support/ImagesList";
import Logout from "./support/Logout";
import Register from "./support/Register";
import UploadFileForm from "./support/UploadFileForm";
import Users from "./support/Users";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";

const AppRoutes = [
  {
    layout: Layout,
    routes: [
      {
        path: "/",
        component: Home
      }
    ]
  },
  {
    layout: SupportLayout,
    routes: [
      {
        path: '/sp/users',
        component: Users
      },
      {
        path: '/sp/images',
        component: ImagesList
      },
      {
        path: '/sp/upload-image',
        component: UploadFileForm
      },
      {
        path: '/sp/register',
        component: Register
      },
      {
        path: "/sp/login",
        component: Login
      },
      {
        path: '/sp/logout',
        component: Logout
      }
    ]
  }
]

export default AppRoutes;
