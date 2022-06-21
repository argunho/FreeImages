import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Header from './public/blocks/Header';


export class Layout extends Component {
  static displayName = Layout.name;

  constructor(props) {
    super(props);

    this.state = {};
  }


  render () {
    return (
      <>
        <Header url={"freeimages"}/>
        <Container>
          {this.props.children}
        </Container>
      </>
    );
  }
}
