import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './public/blocks/NavMenu';

import './../../css/support.css';

export class SupportLayout extends Component {
  static displayName = SupportLayout.name;

  render () {
    return (
      <div>
        <NavMenu />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}