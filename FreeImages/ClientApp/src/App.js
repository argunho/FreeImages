import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/public/Home';

// Support
import UploadFile from './components/support/UploadFile';


import './css/styles.css';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/support/upload-file' component={UploadFile} />
      </Layout>
    );
  }
}
