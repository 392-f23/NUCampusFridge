import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import SearchBar from './SearchBar';

const Banner = ({ handleSearch }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 50 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SearchBar handleSearch={handleSearch} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Banner;
