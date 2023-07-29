import React from 'react';

// Components
import Header from '../components/Header';
import { Container } from '@mui/material';

function Layout({children}) {
  Layout.displayName = "Layout";

  return (
    <>
      <Header />
      <Container className='d-column container'>
        {children}
      </Container>
    </>
  );
}

export default Layout;