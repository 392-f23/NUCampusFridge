import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import Typography from "@mui/material/Typography";
import CardModal from "./CardModal";

export default function ItemCard({ item }) {
  const defaultPictureUrl =
    "https://cdn.britannica.com/36/123536-050-95CB0C6E/Variety-fruits-vegetables.jpg";
  const imageUrl =
    item.ImageURL && item.Item !== "..." ? item.ImageURL : defaultPictureUrl;
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const foodItem = item.Item ? capitalizeWords(item.Item) : "";

  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ padding: 2 }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {foodItem}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.Category}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="194"
        image={imageUrl}
        alt={item.Location || "Default Image"}
        sx={{ objectFit: "cover" }}
      />
      <CardActions sx={{ justifyContent: "space-between", padding: 1 }}>
        <IconButton aria-label="share" size="large">
          <ShareIcon />
        </IconButton>
        <CardModal item={item} />
      </CardActions>
    </Card>
  );
}
