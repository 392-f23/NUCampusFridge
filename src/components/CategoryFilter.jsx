import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput } from '@mui/material';

const CategoryFilter = ({ data, onCategoryChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    onCategoryChange(selectedCategories);
  }, [selectedCategories, onCategoryChange]);

  const handleChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  const categories = data ? [...new Set(data.map(item => item.Category))] : [];

  return (
    <FormControl sx={{ m: 1, width: 200 }}>
      <InputLabel id="category-multiple-checkbox-label">Category</InputLabel>
      <Select
        labelId="category-multiple-checkbox-label"
        multiple
        value={selectedCategories}
        onChange={handleChange}
        input={<OutlinedInput label="Category" />}
        renderValue={(selected) => selected.join(', ')}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            <Checkbox checked={selectedCategories.indexOf(category) > -1} />
            <ListItemText primary={category} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryFilter;
