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
  console.log(this.props)
    return (
      <div>
        <Header url={"freeimages"}/>
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
