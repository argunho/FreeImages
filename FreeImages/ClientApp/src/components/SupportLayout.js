import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { withRouter } from "react-router-dom";
import Header from './public/blocks/Header';

import './../css/support.css';

class SupportLayout extends Component {
  static displayName = SupportLayout.name;

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!(token === null || token === undefined))
      this.props.history.push("/");
  }

  render() {
    return (
      <>
        <Header />
        <Container>
          {this.props.children}
        </Container>
      </>
    );
  }
}

export default withRouter(SupportLayout);