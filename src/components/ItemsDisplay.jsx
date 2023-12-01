import React, { useState } from "react";
import ItemCard from "./ItemCard";
import Masonry from '@mui/lab/Masonry';
import Pagination from '@mui/material/Pagination';

const PAGE_SIZE = 30; // Number of deals per page

const ItemsDisplay = ({ items, searchQuery, filters }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Convert items object to array
  const itemsArray = Object.values(items);

  const parseDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return null;
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    return new Date(year, month, day);
  };

  function debounce(fn, delay) {
    let timeoutID = null;
    return function () {
      clearTimeout(timeoutID);
      let args = arguments;
      let that = this;
      timeoutID = setTimeout(function () {
        fn.apply(that, args);
      }, delay);
    }
  }

  const debouncedLog = debounce(console.log, 1000);
  

  const filteredItems = itemsArray.filter(item => {
    // Search query filter
    const matchesSearch = item.Location.toLowerCase().includes(searchQuery.toLowerCase());
  
    // Location filter
    const matchesLocation = !filters.location.length || filters.location.includes(item.Location);
  
    // Category filter
    const matchesCategory = !filters.category.length || filters.category.some(category => item.Category.includes(category));
  
    // Date filter
    let matchesDateRange = true;
    const itemDate = parseDate(item.Date);
  
    const [startDate, endDate] = filters.dateRange;
    const parsedStartDate = startDate ? parseDate(startDate) : null;
    const parsedEndDate = endDate ? parseDate(endDate) : null;
  
    if (parsedStartDate || parsedEndDate) {
      matchesDateRange = (!parsedStartDate || (itemDate && itemDate >= parsedStartDate)) && (!parsedEndDate || (itemDate && itemDate <= parsedEndDate));
    }

    debouncedLog("date range: ", filters.dateRange, "filters: ", filters);
  
    return matchesSearch && matchesLocation && matchesCategory && matchesDateRange;
  });
  

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);

  if (filteredItems.length === 0) {
    return (
      <div className="deals-container">
        <div className="flex justify-center w-full p-6">
          <h1 className="text-xl text-center">No items found.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="deals-container" style={{ paddingTop: '75px' }}>
      <div className="events-grid flex justify-center w-full mt-6 px-6">
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
          {currentItems.map((item, index) => (
            <div key={`deal-${index}`} className="event-card flex justify-center">
              <ItemCard item={item} />
            </div>
          ))}
        </Masonry>
      </div>
      {totalPages > 1 && (
        <div className="pagination-container flex justify-center my-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
          />
        </div>
      )}
    </div>
  );
};

export default ItemsDisplay;
