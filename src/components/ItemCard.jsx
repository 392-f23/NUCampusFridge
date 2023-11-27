import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia"; // Import CardMedia
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardModal from "./CardModal";

export default function ItemCard({ item }) {
  const defaultPictureUrl =
    "https://cdn.britannica.com/36/123536-050-95CB0C6E/Variety-fruits-vegetables.jpg";
  const imageUrl =
    item.ImageURL && item.Item !== "..." ? item.ImageURL : defaultPictureUrl;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.Location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.Category}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="194"
        image={imageUrl}
        alt={item.Location || "Default Image"} // Fallback alt text if Location is not available
      />
      <CardActions>
        <Button size="small">Share</Button>
        <CardModal item={item} />
      </CardActions>
    </Card>
  );
}
