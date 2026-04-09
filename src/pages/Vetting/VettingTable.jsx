import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { DataTable, FilterBar, StatusBadge } from "../../components/common";
import { commonOrange, commonBlue } from "../../theme/theme";
import {
  STATUS_OPTS,
  TYPE_OPTS,
  SOURCE_OPTS,
  mockDashboard,
} from "./VettingData";

const columns = [
  { id: "sn", label: "S.N.", format: (_r, sn) => String(sn).padStart(2, "0") },
  { id: "referenceNumber", label: "Reference Number" },
  { id: "typeOfComplaint", label: "Type of Complaint" },
  { id: "sourceOfComplaint", label: "Source of Complaint" },
  {
    id: "status",
    label: "Status",
    format: (r) => <StatusBadge status={r.status} />,
  },
  {
    id: "id",
    label: "Actions",
    format: (r, index, row, onView, onUpdate) => (
      <Box
        sx={{ display: "flex", gap: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="small"
          variant="text"
          sx={{ color: commonBlue, fontWeight: 600 }}
          onClick={(e) => onView(r, e)}
        >
          View
        </Button>
        <Button
          size="small"
          variant="text"
          color="secondary"
          onClick={(e) => onUpdate(r, e)}
        >
          Update
        </Button>
      </Box>
    ),
  },
];

export function VettingTable({ onAdd, onView, onUpdate }) {
  const [filteredRows, setFilteredRows] = useState(mockDashboard.vettingList);

  const handleSearch = (searchParams) => {
    let filtered = [...mockDashboard.vettingList];

    if (searchParams.status !== "All Statuses") {
      filtered = filtered.filter((row) => row.status === searchParams.status);
    }
    if (searchParams.reference.trim() !== "") {
      filtered = filtered.filter((row) =>
        row.referenceNumber
          .toLowerCase()
          .includes(searchParams.reference.toLowerCase()),
      );
    }
    if (searchParams.type !== "All Types") {
      filtered = filtered.filter(
        (row) => row.typeOfComplaint === searchParams.type,
      );
    }
    if (searchParams.source !== "All Sources") {
      filtered = filtered.filter(
        (row) => row.sourceOfComplaint === searchParams.source,
      );
    }

    setFilteredRows(filtered);
  };

  const handleReset = () => {
    setFilteredRows(mockDashboard.vettingList);
  };

  const enhancedColumns = columns.map((col) => {
    if (col.id === "id") {
      return {
        ...col,
        format: (r, index, row) => col.format(r, index, row, onView, onUpdate),
      };
    }
    return col;
  });

  return (
    <Box>
      <Typography
        sx={{ fontWeight: 700, mb: 2, color: commonBlue, fontSize: "1.15rem" }}
      >
        View Vetting Forms
      </Typography>
      <FilterBar
        statusOptions={STATUS_OPTS}
        typeOptions={TYPE_OPTS}
        sourceOptions={SOURCE_OPTS}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1.5,
          mt: 3,
          gap: 1.25,
        }}
      >
        <Box
          sx={{ width: 4, height: 28, bgcolor: commonOrange, borderRadius: 1 }}
        />
        <Typography
          variant="h6"
          sx={{ flex: 1, fontWeight: 700, fontSize: "1.05rem" }}
        >
          Vetting List ({filteredRows.length} records)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ borderRadius: "10px" }}
        >
          + Add Vetting Form
        </Button>
      </Box>
      <DataTable
        columns={enhancedColumns}
        rows={filteredRows}
        getRowId={(r) => r.id}
        onRowClick={onView}
      />
    </Box>
  );
}
