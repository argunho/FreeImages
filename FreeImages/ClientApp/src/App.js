import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Counter } from './components/Counter';

// Support
import { SupportLayout } from './components/support/SupportLayout';
import UploadFile from './components/support/UploadFile';


import './css/styles.css';


export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
       <Route path='/support/upload' component={UploadFile} />
      </Layout>
    );
  }
}
