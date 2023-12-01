import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TableFilter = ({ label, options, value, onChange }) => {
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.sort().map((option, index) => (
          <MenuItem key={index} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TableFilter;
