import { Link } from 'react-router-dom';
import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <Link to="/support/upload">Upload</Link>
    );
  }
}
