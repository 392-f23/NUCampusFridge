import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import ItemsDisplay from "../components/ItemsDisplay";
import { getDbData } from "../utilities/firebase";
import AppSpeedDial from "../components/SpeedDial";

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getDbData("/Data")
      .then((fetchedItems) => {
        setItems(fetchedItems);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  if (items.length === 0) {
    return <div>Loading items...</div>;
  }

  return (
    <>
      <Banner handleSearch={setSearchQuery} />
      <div className="mt-32 mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ItemsDisplay items={items} searchQuery={searchQuery} />
      </div>
      <AppSpeedDial />
    </>
  );
};

export default ItemPage;
