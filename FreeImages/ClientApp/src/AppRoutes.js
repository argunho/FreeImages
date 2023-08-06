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
import UploadFile from "./support/UploadFile";

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
        element: <Users/>
      },
      {
        path: '/sp/images',
        element: <ImagesList/>
      },
      {
        path: '/sp/upload-image',
        element: <UploadFile/>
      },
      {
        path: '/sp/register',
        element: <Register/>
      },
      {
        path: "/sp/login",
        element: <Login/>
      },
      {
        path: '/sp/logout',
        element: <Logout/>
      },
      {
        path: "/sp/users/edit/:id",
        element: <Login/>
      },
      {
        path: '/sp/images/edit/:id',
        element: <Logout/>
      }
    ]
  }
]

export default AppRoutes;
