import React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { useNavigate } from "react-router-dom";

const AppSpeedDial = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/newitem");
  };

  return (
    <SpeedDial
      ariaLabel="App SpeedDial"
      onClick={handleAddClick}
      sx={{
        position: "fixed",
        bottom: { xs: 25, sm: 50 },
        right: { xs: 25, sm: 50 },
      }}
      icon={<SpeedDialIcon />}
    ></SpeedDial>
  );
};

export default AppSpeedDial;
