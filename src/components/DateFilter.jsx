import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateFilter = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    onDateChange([newStartDate, endDate]);
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
    onDateChange([startDate, newEndDate]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ m: 1, display: 'flex', gap: 2 }}>
        <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateFilter;
