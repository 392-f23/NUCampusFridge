import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CardModal = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        size="small"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Learn More
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center text-gray-900"
          >
            {item.Location}
          </Typography>
          <div className="mt-2 px-7 py-3">
            {item["Weight (in lbs)"] && (
              <p className="text-sm text-gray-500">
                Weight: {item["Weight (in lbs)"]} lbs
              </p>
            )}
            {item["Arrival Temperature (in F)"] && (
              <p className="text-sm text-gray-500">
                Arrival Temperature: {item["Arrival Temperature (in F)"]} °F
              </p>
            )}
            {item["If prepackaged, Quantity"] && (
              <p className="text-sm text-gray-500">
                {" "}
                Quantity: {item["If prepackaged, Quantity"]}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Date Recovered: {item["Date Recovered"]}
            </p>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CardModal;
