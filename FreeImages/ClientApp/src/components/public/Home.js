import React, { Component } from 'react';
import { TextField, Button, AlertTitle, Alert, CircularProgress, FormControl } from '@mui/material';
import { Search } from '@mui/icons-material';

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);

    this.state = {
      imgs: [],
      searchKeyword: "",
      loading: false
    }
  }

  componentDidMount() {
    this.get();
  }

  git = async () => {
    const { searchKeyword } = this.state;
    const res = (searchKeyword.length >= 3) ?
      await fetch("image/" + searchKeyword)
      : await fetch("image/images");
    const data = await res.json();
    console.log(data)
  }

  render() {
    const { searchKeyword, loading } = this.state;
    return (
      <div>
        <FormControl className="search-wrapper">
          <TextField
            label="Search"
            className="search-input"
            variant="outlined"
            name="searchKeywords"
            value={searchKeyword}
            onChange={(e) => this.setState({ searchKeyword: e.target.value })} />
          <Button variant='text'
            className='search-button'
            onClick={() => this.get()}
            disabled={loading || searchKeyword.length < 3}>
            <Search />
          </Button>
        </FormControl>

      </div>
    );
  }
}
