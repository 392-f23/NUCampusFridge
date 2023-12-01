import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import ItemsDisplay from "../components/ItemsDisplay";
import { getDbData } from "../utilities/firebase";

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: [],
    category: [],
    dateRange: [null, null],
  });

  useEffect(() => {
    getDbData("/Data")
      .then((fetchedItems) => {
        setItems(fetchedItems || []);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  if (items.length === 0) {
    return <div>Loading items...</div>;
  }

  const handleFiltersChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const filteredItems = Object.values(items).filter((item) => {
    // Filter by search query
    const matchesSearchQuery = item.name ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;

    // Filter by location
    const matchesLocation = filters.location.length === 0 || (item.Location && filters.location.includes(item.Location));

    // Filter by category
    const matchesCategory = filters.category.length === 0 || (item.Category && filters.category.includes(item.Category));

    // Filter by date range
    const [startDate, endDate] = filters.dateRange;
    const itemDate = item.date instanceof Date ? item.date : null;
    const matchesDateRange = (!startDate || (itemDate && itemDate >= startDate)) && (!endDate || (itemDate && itemDate <= endDate));

    return matchesSearchQuery && matchesLocation && matchesCategory && matchesDateRange;
  });

  return (
    <div>
      <Banner 
        handleSearch={setSearchQuery} 
        data={items} // Ensure that 'items' data is passed here
        onFiltersChange={handleFiltersChange}
      />
      <ItemsDisplay items={filteredItems} />
    </div>
  );
};

export default ItemPage;
