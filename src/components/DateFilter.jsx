import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateFilter = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (newStartDate) => {
    const formattedStartDate = formatDate(newStartDate);
    setStartDate(formattedStartDate);
    onDateChange([formattedStartDate, endDate]);
  };

  const handleEndDateChange = (newEndDate) => {
    const formattedEndDate = formatDate(newEndDate);
    setEndDate(formattedEndDate);
    onDateChange([startDate, formattedEndDate]);
  };

  // Format date to a standard format or any specific format you need
  const formatDate = (date) => {
    if (!date) return null;
    // Format the date to 'YYYY-MM-DD' or any format you need
    const dateString = date.toISOString().split('T')[0];
    return new Date(dateString);
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
