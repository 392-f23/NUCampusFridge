import React, { useState, useEffect } from "react";
import { LineChart, Line, PieChart, Pie, Tooltip, XAxis, YAxis, Cell, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Switch, FormControlLabel, Button } from '@mui/material';
import { getDbData } from "../utilities/firebase";
import { DatePicker } from '@mui/x-date-pickers'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const MetricsPage = () => {
    const [items, setItems] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [graphType, setGraphType] = useState('daily');
    const [pieDataCategory, setPieDataCategory] = useState([]);
    const [pieDataLocation, setPieDataLocation] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(new Date());
    const [tableData, setTableData] = useState([]);

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
        processData(items, startDate, endDate);
    }, [items, graphType, startDate, endDate]);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.length !== 8) {
            return null;
        }

        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        // Optionally, you can add further validation to check if year, month, and day are numeric

        return `${month}/${day}/${year}`;
    };

    const processData = (items, startDate, endDate) => {
        let filteredItems = items;
        // Filter items based on date range
        if (startDate < endDate && startDate && endDate) {
            filteredItems = Object.entries(items).filter(([key, item]) => {
                const itemDate = new Date(formatDate(item['Date Recovered']));
                return itemDate >= startDate && itemDate <= endDate;
            });
            filteredItems = Object.fromEntries(filteredItems);
        }

        let sortedData = Object.entries(filteredItems).sort((a, b) => a[1]['Date Recovered'] - b[1]['Date Recovered']);
        let lineChartData = {};
        let categoryCounts = {};
        let locationCounts = {};
        let cumulativePounds = 0;
        let cumulativePackages = 0;

        sortedData.forEach(([key, item]) => {
            const rawDate = item['Date Recovered'];
            const formattedDate = formatDate(rawDate);

            if (!formattedDate) {
                return; // Skip this iteration if the date is invalid
            }

            // Line chart data
            if (!lineChartData[rawDate]) {
                lineChartData[rawDate] = { poundsCollected: 0, prepackagedGoods: 0, rawDate, formattedDate };
            }

            const itemPounds = item['Weight (in lbs)'] || 0;
            const itemPackages = item['If prepackaged, Quantity'] || 0;
            cumulativePounds += itemPounds;
            cumulativePackages += itemPackages;

            lineChartData[rawDate].poundsCollected = graphType === 'cumulative' ? cumulativePounds : lineChartData[rawDate].poundsCollected + itemPounds;
            lineChartData[rawDate].prepackagedGoods = graphType === 'cumulative' ? cumulativePackages : lineChartData[rawDate].prepackagedGoods + itemPackages;

            // Pie chart data
            const category = item['Category'];
            const location = item['Location'];

            if (category) {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
            if (location) {
                locationCounts[location] = (locationCounts[location] || 0) + 1;
            }
        });

        // Find top category
        const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
        // Find top location
        const topLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];

        setTableData([
            { title: 'Items Collected', value: cumulativePackages },
            { title: 'Total Weight Collected', value: `${cumulativePounds} lbs` },
            { title: 'Top Category', value: topCategory ? topCategory[0] : 'N/A' },
            { title: 'Top Location', value: topLocation ? topLocation[0] : 'N/A' },
        ]);

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
        <div className="mt-16 flex flex-col p-4 md:p-8">
            <Typography variant="h4" className="text-center text-2xl md:text-3xl lg:text-4xl py-4 mb-5 text-gray-800">
                Metrics
            </Typography>

            <div className="flex flex-col md:flex-row justify-center gap-4 pb-5">
                <DatePicker
                    disableFuture
                    openTo="day"
                    format="MM/dd/yyyy"
                    label="Start Date"
                    views={['year', 'month', 'day']}
                    value={startDate}
                    onChange={setStartDate}
                />
                <DatePicker
                    disableFuture
                    openTo="day"
                    startDate={startDate}
                    format="MM/dd/yyyy"
                    label="End Date"
                    views={['year', 'month', 'day']}
                    value={endDate}
                    onChange={setEndDate}
                />
                <Button variant="contained" onClick={() => { setStartDate(null); setEndDate(new Date()); }}>Reset</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Paper elevation={3} className="p-4">
                    <Typography variant="h6" className="pb-5 text-center text-xl text-gray-800">
                        Summary for {startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : 'All Time Data'}
                    </Typography>                    
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><div className="font-semibold">Metric</div></TableCell>
                                    <TableCell align="left"><div className="font-semibold">Value</div></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="left">{row.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>


                <Paper elevation={3} className="p-4">
                    <Typography variant="h6" className="mb-5 text-center text-xl text-gray-800">
                        Collection Counts
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={graphType === 'cumulative'} onChange={() => setGraphType(graphType === 'daily' ? 'cumulative' : 'daily')} />}
                        label="Cumulative"
                    />
                    <ResponsiveContainer width="90%" height="80%" className="mx-auto">
                        <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="formattedDate" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="poundsCollected" name="Pounds Collected" stroke="#8884d8" />
                            <Line type="monotone" dataKey="prepackagedGoods" name="Packages Collected" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>

                <Paper elevation={3} className="p-4">
                    <Typography variant="h6" className="mb-5 text-center text-xl text-gray-800">
                        Category Distribution
                    </Typography>
                    <ResponsiveContainer width="90%" height="90%" className="mx-auto">
                        <PieChart>
                            <Pie
                                dataKey="value"
                                isAnimationActive={true}
                                data={pieDataCategory}
                                fill="#8884d8"
                                label
                                labelLine={false}
                            >
                                {
                                    pieDataCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))
                                }
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>

                <Paper elevation={3} className="p-4">
                    <Typography variant="h6" className="mb-5 text-center text-xl text-gray-800">
                        Location Distribution
                    </Typography>
                    <ResponsiveContainer width="90%" height="90%" className="mx-auto">
                        <PieChart>
                            <Pie
                                dataKey="value"
                                isAnimationActive={true}
                                data={pieDataLocation}
                                fill="#8884d8"
                                label
                                labelLine={false}
                            >
                                {
                                    pieDataLocation.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))
                                }
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </div>
        </div>
    );
};

export default MetricsPage;
