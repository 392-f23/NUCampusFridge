import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateFilter = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const formatDateForFilter = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}${(date.getMonth()).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleStartDateChange = (newStartDate) => {
    const formattedStartDate = newStartDate ? formatDateForFilter(newStartDate) : null;
    console.log("DateFilter - Setting Start Date:", formattedStartDate);
    setStartDate(newStartDate);
    onDateChange([formattedStartDate, endDate ? formatDateForFilter(endDate) : null]);
  };
  
  const handleEndDateChange = (newEndDate) => {
    const formattedEndDate = newEndDate ? formatDateForFilter(newEndDate) : null;
    console.log("DateFilter - Setting End Date:", formattedEndDate);
    setEndDate(newEndDate);
    onDateChange([startDate ? formatDateForFilter(startDate) : null, formattedEndDate]);
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
