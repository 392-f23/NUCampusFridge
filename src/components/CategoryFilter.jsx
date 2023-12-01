import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput } from '@mui/material';

const CategoryFilter = ({ onCategoryChange, data }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    onCategoryChange(selectedCategories);
  }, [selectedCategories, onCategoryChange]);

  const handleChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  let uniqueCategories = new Set();

  if (data) {
    // Check if data is an array, if not, convert it into an array
    const dataArray = Array.isArray(data) ? data : Object.values(data);

    dataArray.forEach(item => {
      const category = item.Category;
      if (category) {
        for (let c in category) {
          if (category.hasOwnProperty(c)) {
            uniqueCategories.add(category[c]);
          }
        }
      }
    });
  }

  uniqueCategories = [...uniqueCategories];

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
        {uniqueCategories.map((category) => (
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
