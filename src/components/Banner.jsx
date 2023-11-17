import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import SearchBar from './SearchBar';

const Banner = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (query) => {
    // Update the search query state
    setSearchQuery(query);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 50 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SearchBar
            handleSearch={handleSearch}
            className="p-2"
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Banner;
