import React, { useState } from "react";
import {
  Alert,
  Card,
  FormControl,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { Divider, Button } from "@nextui-org/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { v4 as uuid } from "uuid";
import useItemsStore from "../utilities/stores";

const DEFAULT_ITEM = {
  "Arrival Temperature (in F)": "",
  Category: "",
  "Check after prepped for delivery": "",
  Comp: "",
  "Date Prepped": "",
  "Date Recovered": "",
  Day: "",
  Item: "",
  Location: "",
  "Weight (in lbs)": "",
  ImageURL: "",
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
    // Copy the current state to a new object
    let itemToAdd = { ...newItem };

    // Set default values for fields if they are empty
    itemToAdd.ImageURL = itemToAdd.ImageURL || "https://path.to/your/default/image.jpg";
    itemToAdd['Arrival Temperature (in F)'] = itemToAdd['Arrival Temperature (in F)'] || 'TBC';
    itemToAdd['Check after prepped for delivery'] = itemToAdd['Check after prepped for delivery'] || 'TBC';
    itemToAdd.Comp = itemToAdd.Comp || 'Not Specified';
    itemToAdd.Day = itemToAdd.Day || 'Not Specified';
    itemToAdd.Item = itemToAdd.Item || 'Unnamed Item';
    itemToAdd.Location = itemToAdd.Location || 'Unknown Location';
    itemToAdd['Weight (in lbs)'] = itemToAdd['Weight (in lbs)'] || '0';
    itemToAdd['Date Prepped'] = itemToAdd['Date Prepped'] || 'Unknown time';
    itemToAdd['Date Recovered'] = itemToAdd['Date Recovered'] || 'Unknown time';
    itemToAdd.Category = itemToAdd.Category ? itemToAdd.Category.split(",").map(cat => cat.trim()) : [];
    itemToAdd.id = "ITEM-" + uuid();
    addItem(itemToAdd);
    setNewItem(DEFAULT_ITEM);
    setOpenSuccess(true);
  };



  const formatDate = (date) => {
    if (date) {
      return new Date(date).toISOString().split("T")[0].replace(/-/g, '');
    }
    return "";
  };
  

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Card className="p-4 flex flex-col gap-4 bg-white shadow-lg rounded" style={{ paddingTop: "70px" }}>
        <Typography variant="h6" className="text-center text-lg font-semibold">Create a New Item</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <TextField
            label="Arrival Temperature (in F)"
            variant="outlined"
            value={newItem["Arrival Temperature (in F)"]}
            onChange={(e) => setNewItem({ ...newItem, "Arrival Temperature (in F)": e.target.value })}
            fullWidth
          />
      <TextField
        label="Category"
        variant="outlined"
        value={newItem.Category}
        onChange={(event) =>
          setNewItem({ ...newItem, Category: event.target.value })
        }
        fullWidth
      />
      <TextField
        label="Check after prepped for delivery"
        variant="outlined"
        value={newItem["Check after prepped for delivery"]}
        onChange={(event) =>
          setNewItem({
            ...newItem,
            "Check after prepped for delivery": event.target.value,
          })
        }
        fullWidth
      />
      <TextField
        label="Comp"
        variant="outlined"
        value={newItem.Comp}
        onChange={(event) =>
          setNewItem({ ...newItem, Comp: event.target.value })
        }
        fullWidth
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
      
      <TextField
        label="Day"
        variant="outlined"
        value={newItem.Day}
        onChange={(event) =>
          setNewItem({ ...newItem, Day: event.target.value })
        }
        fullWidth
      />
      <TextField
        label="Item"
        variant="outlined"
        value={newItem.Item}
        onChange={(event) =>
          setNewItem({ ...newItem, Item: event.target.value })
        }
        fullWidth
      />
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
        label="Weight (in lbs)"
        variant="outlined"
        value={newItem["Weight (in lbs)"]}
        onChange={(event) =>
          setNewItem({ ...newItem, "Weight (in lbs)": event.target.value })
        }
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


