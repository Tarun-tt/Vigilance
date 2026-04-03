import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const BOITable = ({
  columns,
  rows,
  title,
  showSearch = true,
  showPagination = true,
  defaultSortField,
  defaultSortDirection = "asc",
  onRowClick,
  actions,
  rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(
    defaultSortField || columns[0]?.field,
  );
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const filteredRows = rows.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {title && (
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#1976d2", fontWeight: "bold", mb: 3 }}
        >
          {title}
        </Typography>
      )}

      {showSearch && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortField === column.field}
                      direction={
                        sortField === column.field ? sortDirection : "asc"
                      }
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={row.id || index}
                hover
                onClick={() => onRowClick && onRowClick(row)}
                sx={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.render
                      ? column.render(row[column.field], row)
                      : row[column.field]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    {actions.map((action, actionIndex) => (
                      <IconButton
                        key={actionIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        sx={{ color: action.color || "#1976d2" }}
                      >
                        {action.icon}
                      </IconButton>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  align="center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default BOITable;
