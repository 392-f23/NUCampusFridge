import React, { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import TableFilter from './TableFilter';
import Row from './Row';
import { FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
import useItemsStore from '../utilities/stores';

const processWeightOrQuantity = (row) => {
  if (row["Weight (in lbs)"]) {
    return row["Weight (in lbs)"];
  } else if (row["If prepackaged, Quantity"]) {
    return row["If prepackaged, Quantity"];
  } else {
    return "N/A";
  }
};

const generateRows = (items) => {
  return Object.entries(items).map(([key, value], index) => ({
    ...value,
    id: index,
    weightOrQuantity: processWeightOrQuantity(value),
  }));
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  { id: 'Item', numeric: false, disablePadding: true, label: 'Item', sorted: true },
  { id: 'Category', numeric: false, disablePadding: false, label: 'Category', sorted: true },
  { id: 'Location', numeric: false, disablePadding: false, label: 'Location', sorted: true },
  { id: 'weightOrQuantity', numeric: true, disablePadding: false, label: 'Weight / Quantity', sorted: true },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', sorted: false },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all items' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={headCell.sorted && orderBy === headCell.id ? order : false}
          >
            {headCell.sorted ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label // Render label without sort label for non-sorted columns
            )}
          </TableCell>
        ))
        }
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, onDeleteSelected, onPrepSelected, onUnprepSelected, onFilterClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Items
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton onClick={onDeleteSelected}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Unmark as Prepped for Delivery">
            <IconButton onClick={onUnprepSelected}>
              <DoNotDisturbOnIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Prepped for Delivery">
            <IconButton onClick={onPrepSelected}>
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filters">
          <IconButton onClick={onFilterClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const ItemsDisplay = ({ items }) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('item');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showFilters, setShowFilters] = React.useState(false);
  const searchQuery = useItemsStore((state) => state.searchQuery);
  const [rows, setRows] = React.useState(generateRows(items));

  const [filters, setFilters] = React.useState({
    Category: '',
    Location: '',
    Quantity: '',
    CheckPrepped: false,
    DateRecovered: ''
  });

  useEffect(() => {
    setRows(
      generateRows(items).filter(row => {
        const matchesSearchQuery = searchQuery === '' || row.Item.toLowerCase().includes(searchQuery.toLowerCase())
          || (row.Category && row.Category.join(' ').toLowerCase().includes(searchQuery.toLowerCase()))
          || row.Location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filters.Category === '' || (row.Category && row.Category.includes(filters.Category));
        const matchesLocation = filters.Location === '' || row.Location === filters.Location;
        const matchesQuantity = filters.Quantity === '' || (row.weightOrQuantity >= parseFloat(filters.Quantity));
        const matchesCheckPrepped = row["Check after prepped for delivery"] === (filters.CheckPrepped ? true : false);
        const matchesDateRecovered = filters.DateRecovered === '' || row["Date Recovered"] === filters.DateRecovered;

        return matchesCategory && matchesLocation && matchesQuantity && matchesCheckPrepped && matchesDateRecovered && matchesSearchQuery;
      }));
  }, [items, searchQuery, filters]);


  // Handle filter change
  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  const getFilterOptions = (field) => {
    return [...new Set(Object.values(items).map(item => item[field]))];
  };

  const getCategoryOptions = () => {
    const allCategories = Object.values(items).flatMap(item => item.Category || []);
    return [...new Set(allCategories)];
  };

  useEffect(() => {
    // enable dense mode for smaller screens
    if (window.innerWidth < 600) {
      setDense(true);
    } else {
      setShowFilters(true);
    }
  }, []);

  const handleDeleteSelected = () => {
    // Implement deletion logic here
    console.log('Selected items to delete:', selected);
  };

  const handlePrepSelected = () => {
    // Implement prep logic here
    console.log('Selected items to prep:', selected);
  };

  const handleUnprepSelected = () => {
    // Implement unprep logic here
    console.log('Selected items to unprep:', selected);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  const handleRequestSort = (event, property) => {
    console.log('Sorting by:', property);
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <div className={`${showFilters ? 'flex flex-col md:flex-row gap-4 py-2' : 'hidden'}`}>
        <TableFilter label="Category" options={getCategoryOptions()} value={filters.Category} onChange={handleFilterChange('Category')} />
        <TableFilter label="Location" options={getFilterOptions("Location")} value={filters.Location} onChange={handleFilterChange('Location')} />
        <TextField
          label="Minimum Quantity"
          type="number"
          value={filters.Quantity}
          onChange={handleFilterChange('Quantity')}
          variant="outlined"
          fullWidth
        />
        <TableFilter label="Date Recovered" options={getFilterOptions("Date Recovered")} value={filters.DateRecovered} onChange={handleFilterChange('DateRecovered')} />
        <FormControlLabel
          control={
            <Switch
              checked={filters.CheckPrepped}
              onChange={handleFilterChange('CheckPrepped')}
              name="checkPrepped"
            />
          }
          label="Prepped"
        />
      </div>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length}
          onDeleteSelected={handleDeleteSelected}
          onPrepSelected={handlePrepSelected}
          onUnprepSelected={handleUnprepSelected}
          onFilterClick={handleFilterClick}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;

                  return (
                    <Row key={`row-${row.id}`} row={row} isItemSelected={isItemSelected} labelId={labelId} handleClick={handleClick} />);
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }} key={`empty-${page}-${emptyRows}`} >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={dense} onChange={(event) => setDense(event.target.checked)} />}
          label="Compact Table"
        />
      </FormGroup>
    </Box>
  );
};

export default ItemsDisplay;
