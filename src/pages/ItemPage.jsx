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
        setItems(fetchedItems);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const handleFiltersChange = ({ type, value }) => {
    const updatedType = type === "date" ? "dateRange" : type;
    console.log(`ItemPage - Received ${type} filter:`, value);
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: value,
    }));
    console.log("changed val: ", filters);
  };
  
  

  return (
    <div>
      <Banner
        handleSearch={setSearchQuery}
        data={items}
        onFiltersChange={handleFiltersChange}
        selectedFilters={filters}
      />
      <ItemsDisplay items={items} searchQuery={searchQuery} filters={filters} />
    </div>
  );
};

export default ItemPage;
