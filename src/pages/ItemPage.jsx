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
      .then((fetchedData) => {
        if (fetchedData) {
          const formattedItems = fetchedData.map(item => ({
            ...item,
            date: item["Date Recovered"] ? new Date(item["Date Recovered"].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')) : null
          }));
          setItems(formattedItems);
        } else {
          setItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const handleFiltersChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const filteredItems = items.filter((item) => {
    const matchesSearchQuery = item.name ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesLocation = filters.location.length === 0 || (item.Location && filters.location.includes(item.Location));
    const matchesCategory = filters.category.length === 0 || (item.Category && filters.category.includes(item.Category));
    const [startDate, endDate] = filters.dateRange;
    const itemDate = item.date instanceof Date ? item.date : null;
    const matchesDateRange = (!startDate || (itemDate && itemDate >= startDate)) && (!endDate || (itemDate && itemDate <= endDate));

    return matchesSearchQuery && matchesLocation && matchesCategory && matchesDateRange;
  });

  return (
    <div>
      <Banner 
        handleSearch={setSearchQuery} 
        data={items}
        onFiltersChange={handleFiltersChange}
      />
      <ItemsDisplay items={filteredItems} />
    </div>
  );
};

export default ItemPage;
