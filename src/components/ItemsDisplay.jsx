import React, { useState } from "react";
import ItemCard from "./ItemCard";
import Masonry from '@mui/lab/Masonry';
import Pagination from '@mui/material/Pagination';

const PAGE_SIZE = 30; // Number of deals per page

const ItemsDisplay = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItem = items.slice(startIndex, startIndex + PAGE_SIZE);

  if (items.length === 0) {
    return (
      <div className="deals-container">
        <div className="flex justify-center w-full p-6">
          <h1 className="text-xl text-center">No items found.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="deals-container">
      <div className="events-grid flex justify-center w-full mt-6 px-6">
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} >
          {currentItem.map((item) => (
            <div key={`deal-${item.id}`} className="event-card flex justify-center">
              <DealCard item={item} />
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

export default DealsDisplay;
