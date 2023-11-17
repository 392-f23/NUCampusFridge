

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardModal from "./CardModal";


export default function ItemCard({ item }) {
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
      <CardActions>
        <Button size="small">Share</Button>
        <CardModal item={item} />
        
      </CardActions>
    </Card>
  );
}