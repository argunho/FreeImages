import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppRoutes from './AppRoutes';

// Installed

// Components
import Loading from './components/Loading';

// Css
import './assets/css/styles.css';
import './assets/css/fonts.css';

function App() {
  App.displayName = "App";

  const [currentLayout, setLayout] = useState(null);

  const loc = useLocation();


  useEffect(() => {
    setLayout(AppRoutes[loc.pathname.indexOf("sp/") === -1 ? 0 : 1]);
  }, [loc])

  if (!currentLayout)
    return <Loading />;

  return (
    // <Layout>
    //   <Routes>
    //     {AppRoutes.map((route, index) => {
    //       const { element, ...rest } = route;
    //       return <Route key={index} {...rest} element={element} />;
    //     })}
    //   </Routes>
    // </Layout>
    <currentLayout.layout>
      <Routes>
        {currentLayout.routes.map((route, ind) => {
          const { element, path } = route;
          return <Route key={ind} path={path} element={element} />
        })}
      </Routes>
    </currentLayout.layout>
  );
}

export default App;