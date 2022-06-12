import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/public/Home';
import ImagesList from './components/support/ImagesList';

// Support
import UploadFileForm from './components/support/UploadFileForm';


import './css/styles.css';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/support/upload-file' component={UploadFileForm} />
        <Route path='/support/images' component={ImagesList} />
      </Layout>
    );
  }
}
