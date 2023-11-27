import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import ItemsDisplay from "../components/ItemsDisplay";
import { getDbData } from "../utilities/firebase";

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
    <div>
      <Banner handleSearch={setSearchQuery} />
      <ItemsDisplay items={items} searchQuery={searchQuery} />
    </div>
  );
};

export default ItemPage;
