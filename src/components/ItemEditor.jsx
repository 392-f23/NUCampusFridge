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
import { v4 as uuid } from "uuid";

const DEFAULT_ITEM = {
  "Arrival Temperature (in F)": "",
  Category: "",
  "Check after prepped for delivery": "",
  Comp: "",
  "Date Prepped": null,
  "Date Recovered": "",
  Day: "",
  Item: "",
  Location: "",
  "Weight (in lbs)": "",
  ImageURL: "",
};

const ItemEditor = () => {
  const [newItem, setNewItem] = useState(DEFAULT_ITEM);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const onSave = () => {
    // Here you should add your logic to save the new item
    console.log(newItem); // For example, logging the new item

    // Reset the form
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
    <Card className="p-4 flex flex-col gap-4">
      <Typography variant="h6">Create a New Item</Typography>

      <TextField
        label="Arrival Temperature (in F)"
        variant="outlined"
        value={newItem["Arrival Temperature (in F)"]}
        onChange={(event) =>
          setNewItem({
            ...newItem,
            "Arrival Temperature (in F)": event.target.value,
          })
        }
      />
      <TextField
        label="Category"
        variant="outlined"
        value={newItem.Category}
        onChange={(event) =>
          setNewItem({ ...newItem, Category: event.target.value })
        }
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
      />
      <TextField
        label="Comp"
        variant="outlined"
        value={newItem.Comp}
        onChange={(event) =>
          setNewItem({ ...newItem, Comp: event.target.value })
        }
      />
      <DateTimePicker
        label="Date Prepped"
        value={newItem["Date Prepped"]}
        onChange={(date) =>
          setNewItem({ ...newItem, "Date Prepped": formatDate(date) })
        }
        renderInput={(params) => <TextField {...params} />}
      />
      <TextField
        label="Date Recovered"
        variant="outlined"
        value={newItem["Date Recovered"]}
        onChange={(event) =>
          setNewItem({ ...newItem, "Date Recovered": event.target.value })
        }
      />
      <TextField
        label="Day"
        variant="outlined"
        value={newItem.Day}
        onChange={(event) =>
          setNewItem({ ...newItem, Day: event.target.value })
        }
      />
      <TextField
        label="Item"
        variant="outlined"
        value={newItem.Item}
        onChange={(event) =>
          setNewItem({ ...newItem, Item: event.target.value })
        }
      />
      <TextField
        label="Location"
        variant="outlined"
        value={newItem.Location}
        onChange={(event) =>
          setNewItem({ ...newItem, Location: event.target.value })
        }
      />
      <TextField
        label="Weight (in lbs)"
        variant="outlined"
        value={newItem["Weight (in lbs)"]}
        onChange={(event) =>
          setNewItem({ ...newItem, "Weight (in lbs)": event.target.value })
        }
      />
      <TextField
        label="Image URL"
        variant="outlined"
        value={newItem.ImageURL}
        onChange={(event) =>
          setNewItem({ ...newItem, ImageURL: event.target.value })
        }
      />

      <Divider />
      <div className="flex justify-end gap-4">
        <Button
          color="danger"
          variant="flat"
          className="rounded-md"
          onClick={() => setNewItem(DEFAULT_ITEM)}
        >
          Discard
        </Button>
        <Button
          onClick={onSave}
          className="bg-[#4E2A84] hover:bg-[#4E2A84] text-white font-bold py-2 px-4 rounded-md"
        >
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
  );
};

export default ItemEditor;
