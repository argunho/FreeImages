import React, { Component } from 'react';
import { Route, Router } from 'react-router';
import { withRouter, Switch } from "react-router-dom";

// Layout
import { Layout } from './components/Layout';
import Home from './components/public/Home';
import Login from './components/public/Login';

// Support
import SupportLayout  from './components/SupportLayout';
import UploadFileForm from './components/support/UploadFileForm';
import ImagesList from './components/support/ImagesList';
import Users from './components/support/Users';
import Logout from './components/support/Logout';

import './css/styles.css';
import './css/fonts.css';
import Register from './components/support/Register';

const routesLayout = [
  {
    layout: Layout,
    url: "",
    routes: [
      {
        path: "/",
        component: Home
      },
      {
        path: "/login",
        component: Login,
        props: {
          displayWidth: window.innerWidth,
          displayHeight: window.innerHeight,
          menu: JSON.parse(sessionStorage.getItem("menu")) || [],
          handleClick: (link) => this.props.history.push(link)
      }
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
        path: '/register',
        component: Register
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
                key={ind}
                path={l.url + r.path}
                render={props => (
                  <l.layout history={props.history}>
                    <r.component {...r.props} />
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