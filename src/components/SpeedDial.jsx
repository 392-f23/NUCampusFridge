import React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";

const AppSpeedDial = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <FavoriteIcon />,
      name: "favorites",
      onClick: () => navigate("/favorites"),
    },
    { icon: <AddIcon />, name: "Add", onClick: () => navigate("/newevent") },
  ];

  return (
    <SpeedDial
      ariaLabel="App SpeedDial"
      sx={{
        position: "fixed",
        bottom: { xs: 25, sm: 50 },
        right: { xs: 25, sm: 50 },
      }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
          tooltipOpen
        />
      ))}
    </SpeedDial>
  );
};

export default AppSpeedDial;
