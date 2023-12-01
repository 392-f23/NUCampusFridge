import React, { useState } from "react";
import ItemCard from "./ItemCard";
import Masonry from '@mui/lab/Masonry';
import Pagination from '@mui/material/Pagination';

const PAGE_SIZE = 30; // Number of deals per page

const ItemsDisplay = ({ items, searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter items based on search query
  const filteredItems = Object.values(items).filter(item => 
    item.Location && item.Location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE); // Use filteredItems for pagination

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE); // Use filteredItems for slicing

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
          {currentItems.map((item) => (
            <div key={`deal-${item.id}`} className="event-card flex justify-center">
              <ItemCard item={item} />
            </div>
          ))}
        </Masonry>
      </div>
      {totalPages > 1 && (
        <div className="pagination-container flex justify-center my-6">
          <Pagination
            count={totalPages}
            onChange={handlePageChange}
            color="secondary"
          />
        </div>
      )}
    </div>
  );
};

export default ItemsDisplay;
