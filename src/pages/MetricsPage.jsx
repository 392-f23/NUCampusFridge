import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import { LineChart, Line, PieChart, Pie, Tooltip, XAxis, YAxis, Cell, Legend, CartesianGrid } from 'recharts';
import { Paper, Typography, Grid, Switch, FormControlLabel } from '@mui/material';

import { getDbData } from "../utilities/firebase";

const MetricsPage = () => {
    const [items, setItems] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [graphType, setGraphType] = useState('daily');
    const [pieDataCategory, setPieDataCategory] = useState([]);
    const [pieDataLocation, setPieDataLocation] = useState([]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        getDbData("/Data")
          .then((fetchedItems) => {
            setItems(fetchedItems);
          })
          .catch((error) => {
            console.error("Error fetching items:", error);
          });
      }, []);

    useEffect(() => {
        processData(items);
    }, [items]);

    const formatDate = (dateStr) => {
        return `${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}/${dateStr.substring(0, 4)}`;
    };

    const processData = (items) => {
        let lineChartData = {};
        let categoryCounts = {};
        let locationCounts = {};

        items.forEach(item => {
            // Process for line chart
            const rawDate = item['Date Recovered'];
            const formattedDate = formatDate(rawDate);
            if (rawDate) {
                if (!lineChartData[rawDate]) {
                    lineChartData[rawDate] = { poundsCollected: 0, prepackagedGoods: 0, rawDate, formattedDate };
                }
                if (item['Weight (in lbs)']) {
                    lineChartData[rawDate].poundsCollected += item['Weight (in lbs)'];
                }
                if (item['If prepackaged, Quantity']) {
                    lineChartData[rawDate].prepackagedGoods += item['If prepackaged, Quantity'];
                }
            }

            // Process for pie charts
            const category = item['Category'];
            const location = item['Location'];

            const lineDataArray = Object.values(lineChartData);

            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });

        // Convert objects to arrays for chart compatibility
        const lineDataArray = Object.values(lineChartData);
        const pieDataCategory = Object.keys(categoryCounts).map(key => ({ name: key, value: categoryCounts[key] }));
        const pieDataLocation = Object.keys(locationCounts).map(key => ({ name: key, value: locationCounts[key] }));

        // Update state
        setLineData(lineDataArray);
        setPieDataCategory(pieDataCategory);
        setPieDataLocation(pieDataLocation);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                    Food Collection Metrics
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3}>
                    <LineChart width={600} height={300} data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="formattedDate" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="poundsCollected" name="Pounds Collected"stroke="#8884d8" />
                        <Line type="monotone" dataKey="prepackagedGoods" name= "Packages Collected" stroke="#82ca9d" />
                    </LineChart>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={3}>
                    <Typography variant="h6" gutterBottom>
                        Category Distribution
                    </Typography>
                    <PieChart width={800} height={400}>
                        <Pie 
                            dataKey="value" 
                            isAnimationActive={true} 
                            data={pieDataCategory} 
                            cx={400} 
                            cy={200} 
                            outerRadius={150} 
                            fill="#8884d8" 
                            label 
                            labelLine={false}
                        >
                            {
                                pieDataCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))
                            }
                        </Pie>
                        <Tooltip />
                    </PieChart>

                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={3}>
                    <Typography variant="h6" gutterBottom>
                        Location Distribution
                    </Typography>
                    <PieChart width={800} height={400}>
                        <Pie 
                            dataKey="value" 
                            isAnimationActive={true} 
                            data={pieDataLocation} 
                            cx={400} 
                            cy={200} 
                            outerRadius={150} 
                            fill="#8884d8" 
                            label 
                            labelLine={false}
                        >
                            {
                                pieDataLocation.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))
                            }
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default MetricsPage;