import React from "react";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Checkbox, TableRow, TableCell, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import CardModal from "./CardModal";
import { Image } from "@nextui-org/react";

function Row(props) {
  const { row, isItemSelected, labelId, handleClick } = props;
  const [open, setOpen] = React.useState(false);
  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${month}/${day}/${year}`;
  };
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const foodItem = row.Item ? capitalizeWords(row.Item) : "";

  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
            onClick={(event) => handleClick(event, row.id)}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {foodItem}
        </TableCell>
        <TableCell align="left">{row.Category}</TableCell>
        <TableCell align="left">{row.Location}</TableCell>
        <TableCell align="left">{row.weightOrQuantity}</TableCell>
        <TableCell>
          <div className="flex justify-between space-x-1">
            <CardModal item={row} />
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Item Details
              </Typography>
              <Typography variant="body2">
                More info about {row.Item}
              </Typography>
              {row.ImageURL && (
                <Image
                  src={row.ImageURL}
                  alt={row.Item}
                  width={300}
                  height={300}
                />
              )}
              <div>
                {row["Arrival Temperature (in F)"] && (
                  <p className="text-sm text-gray-500">
                    Arrival Temperature: {row["Arrival Temperature (in F)"]} °F
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Date Recovered: {formatDate(row["Date Recovered"])}
                </p>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default Row;
