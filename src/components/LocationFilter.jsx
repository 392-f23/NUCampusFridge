import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput } from '@mui/material';

const LocationFilter = ({ data, onLocationChange }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    onLocationChange(selectedLocations);
  }, [selectedLocations, onLocationChange]);

  const handleChange = (event) => {
    setSelectedLocations(event.target.value);
  };

  const locations = data ? [...new Set(Object.values(data).map(item => item.Location))] : [];
  
  return (
    <FormControl sx={{ m: 1, width: 200 }}>
      <InputLabel id="location-multiple-checkbox-label">Location</InputLabel>
      <Select
        labelId="location-multiple-checkbox-label"
        multiple
        value={selectedLocations}
        onChange={handleChange}
        input={<OutlinedInput label="Location" />}
        renderValue={(selected) => selected.join(', ')}
      >
        {locations.map((location) => (
          <MenuItem key={location} value={location}>
            <Checkbox checked={selectedLocations.indexOf(location) > -1} />
            <ListItemText primary={location} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationFilter;
