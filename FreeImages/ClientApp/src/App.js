import React, { Component } from 'react';
import { Route, Router } from 'react-router';
import { Layout } from './components/Layout';
import { withRouter, Switch } from "react-router-dom";

// Layout
import Home from './components/public7/Home';

// Support
import SupportLayout  from './components/SupportLayout';
import UploadFileForm from './components/support/UploadFileForm';
import ImagesList from './components/support/ImagesList';

import './css/styles.css';
import Users from './components/support/Users';
import Logout from './components/support/Logout';

const routesLayout = [
  {
    layout: Layout,
    url: "",
    routes: [
      {
        path: "/",
        component: Home
      }
    ]
  },
  {
    layout: SupportLayout,
    url: "/support",
    routes: [
      {
        path: '/users',
        component: Users
      },
      {
        path: '/images',
        component: ImagesList
      },
      {
        path: '/upload-image',
        component: UploadFileForm
      },
      {
        path: '/logout',
        component: Logout
      }
    ]
  }
]

class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Router history={this.props.history}>
        <Switch>
          {routesLayout.map((l, index) => (
            l.routes.map((r, ind) => (
              <Route exact
                path={l.url + r.path}
                render={props => (
                  <l.layout history={props.history}>
                    <r.component {...props} />
                  </l.layout>
                )}
              />
            ))))}
        </Switch>
      </Router>
    );
  }
}

export default withRouter((props) => <App {...props} />);