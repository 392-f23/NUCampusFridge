import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { v4 as uuid } from "uuid";
import useItemsStore from "../utilities/stores";

const DEFAULT_ITEM = {
  "Arrival Temperature (in F)": "",
  Category: "",
  "Check after prepped for delivery": "",
  "Date Prepped": "",
  "Date Recovered": "",
  Day: "",
  Item: "",
  Location: "",
  "Weight (in lbs)": "",
  "If prepackaged, Quantity": "",
  ImageURL: "",
  WeightOrQuantity: "weight", // New state for tracking the user's choice
};

const ItemEditor = () => {
  const addItem = useItemsStore(state => state.addItem);
  const [newItem, setNewItem] = useState(DEFAULT_ITEM);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const onSave = () => {
    // Check if the Item field is empty
    if (!newItem.Item.trim()) {
      // If Item is empty, show an error message and stop the save process
      alert("Please fill out the Item field.");
      return;
    }
    // Check if the Category field is empty
    if (!newItem.Category.trim()) {
      // If Category is empty, show an error message and stop the save process
      alert("Please fill out the Category field.");
      return;
    }
    // Check if day prepped is empty
    if (!newItem["Date Prepped"]) {
      alert("Please fill out the Date Prepped field.");
      return;
    }
    // Check if day prepped or day recovered is in the future
    if (newItem["Date Prepped"] && new Date(newItem["Date Prepped"]) > new Date()) {
      alert("Date prepped cannot be in the future.");
      return;
    }
    // Check if day recovered is in the future
    if (newItem["Date Recovered"] && new Date(newItem["Date Recovered"]) > new Date()) {
      alert("Date recovered cannot be in the future.");
      return;
    }
    // Check if day recovered is before day prepped
    if (newItem["Date Prepped"] && newItem["Date Recovered"]) {
      if (new Date(newItem["Date Prepped"]) > new Date(newItem["Date Recovered"])) {
        alert("Date recovered cannot be before date prepped.");
        return;
      }
    }
    // Check if the arrival temperature is a number and is between degrees fahrenheit for food
    if (newItem["Arrival Temperature (in F)"]) {
      if (isNaN(newItem["Arrival Temperature (in F)"])) {
        alert("Arrival temperature must be a number.");
        return;
      }
      if (newItem["Arrival Temperature (in F)"] < 0 || newItem["Arrival Temperature (in F)"] > 500) {
        alert("Arrival temperature must be between 0 and 500 degrees Fahrenheit.");
      }
    }

    // Copy the current state to a new object
    let itemToAdd = { ...newItem };

    // Set default values for fields if they are empty
    itemToAdd.ImageURL = itemToAdd.ImageURL || "";
    itemToAdd['Arrival Temperature (in F)'] = itemToAdd['Arrival Temperature (in F)'] || 'N/A';
    itemToAdd['Check after prepped for delivery'] = itemToAdd['Check after prepped for delivery'] || 'TBC';
    // Get the day of the week from the Date Prepped field
    itemToAdd.Day = itemToAdd['Date Prepped'] ? new Date(itemToAdd['Date Prepped']).toLocaleDateString('en-US', { weekday: 'long' }) : '';
    itemToAdd.Location = itemToAdd.Location || 'Unknown Location';
    if (itemToAdd.WeightOrQuantity === "weight") {
      itemToAdd['If prepackaged, Quantity'] = '';
    } else {
      itemToAdd['Weight (in lbs)'] = '';
    }

    // Format dates
    if (itemToAdd['Date Prepped']) {
      itemToAdd['Date Prepped'] = new Date(itemToAdd['Date Prepped']).toISOString();
    }
    if (itemToAdd['Date Recovered']) {
      itemToAdd['Date Recovered'] = new Date(itemToAdd['Date Recovered']).toISOString();
    }
    itemToAdd.Category = itemToAdd.Category ? itemToAdd.Category.split(",").map(cat => cat.trim()) : [];
    itemToAdd.id = "ITEM-" + uuid();
    addItem(itemToAdd);
    setNewItem(DEFAULT_ITEM);
    setOpenSuccess(true);
  };



  const formatDate = (date) => {
    if (date) {
      return new Date(date).toISOString().split("T")[0]; // Format to YYYY-MM-DD
    }
    return "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card className="p-4 flex flex-col gap-4 bg-white shadow-lg rounded">
        <Typography variant="h6" className="text-center text-lg font-semibold">Create a New Item</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Item Name"
            helperText="Required"
            variant="outlined"
            value={newItem.Item}
            onChange={(event) =>
              setNewItem({ ...newItem, Item: event.target.value })
            }
            fullWidth
            required
          />
          <TextField
            label="Category"
            variant="outlined"
            helperText="Separate categories with commas"
            value={newItem.Category}
            onChange={(event) =>
              setNewItem({ ...newItem, Category: event.target.value })
            }
            fullWidth
            required
          />
          <DateTimePicker
            label="Date Prepped"
            value={newItem["Date Prepped"] ? new Date(newItem["Date Prepped"]) : null}
            onChange={(date) =>
              setNewItem({ ...newItem, "Date Prepped": date ? formatDate(date) : "" })
            }
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DateTimePicker
            label="Date Recovered"
            value={newItem["Date Recovered"] ? new Date(newItem["Date Recovered"]) : null}
            onChange={(date) =>
              setNewItem({ ...newItem, "Date Recovered": date ? formatDate(date) : "" })
            }
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="weight-or-quantity"
              name="weight-or-quantity"
              value={newItem.WeightOrQuantity}
              onChange={(event) =>
                setNewItem({ ...newItem, WeightOrQuantity: event.target.value })
              }
            >
              <FormControlLabel value="weight" control={<Radio />} label="Weight (in lbs)" />
              <FormControlLabel value="quantity" control={<Radio />} label="Quantity" />
            </RadioGroup>
          </FormControl>
          {newItem.WeightOrQuantity === "weight" ? (
            <TextField
              label="Weight (in lbs)"
              variant="outlined"
              value={newItem["Weight (in lbs)"]}
              onChange={(event) =>
                setNewItem({ ...newItem, "Weight (in lbs)": event.target.value })
              }
              fullWidth
            />
          ) : (
            <TextField
              label="Quantity"
              variant="outlined"
              value={newItem["If prepackaged, Quantity"]}
              onChange={(event) =>
                setNewItem({ ...newItem, "If prepackaged, Quantity": event.target.value })
              }
              fullWidth
            />
          )}
          <TextField
            label="Location"
            variant="outlined"
            value={newItem.Location}
            onChange={(event) =>
              setNewItem({ ...newItem, Location: event.target.value })
            }
            fullWidth
          />
          <TextField
            label="Arrival Temperature (in F)"
            variant="outlined"
            value={newItem["Arrival Temperature (in F)"]}
            onChange={(e) => setNewItem({ ...newItem, "Arrival Temperature (in F)": e.target.value })}
            fullWidth
          />
          <TextField
            label="Image URL"
            variant="outlined"
            value={newItem.ImageURL}
            onChange={(event) =>
              setNewItem({ ...newItem, ImageURL: event.target.value })
            }
            fullWidth
          />
        </div>

        <Divider />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" color="error" onClick={() => setNewItem(DEFAULT_ITEM)}>
            Discard
          </Button>
          <Button variant="contained" color="primary" onClick={onSave}>
            Submit
          </Button>
        </div>
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
            Item successfully saved!
          </Alert>
        </Snackbar>
      </Card>
    </LocalizationProvider>
  );
};

export default ItemEditor;


