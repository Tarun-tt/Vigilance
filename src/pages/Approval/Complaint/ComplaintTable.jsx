// ComplaintTable.js
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { DataTable, FilterBar, StatusBadge } from "../../../components/common";
import {
  COMPLAINT_STATUS_OPTS,
  COMPLAINT_TYPE_OPTS,
  mockComplaintList,
} from "./ComplaintData";
import { boiBlue, boiOrange } from "../../../theme/theme";

const columns = [
  { id: "sn", label: "S.N.", format: (_r, sn) => String(sn).padStart(2, "0") },
  { id: "complaintNumber", label: "Complaint Number" },
  { id: "personType", label: "Person Type" },
  { id: "typeOfFraud", label: "Type of Fraud" },
  {
    id: "dateOfComplaint",
    label: "Date of Complaint",
    format: (r) => new Date(r.dateOfComplaint).toLocaleDateString(),
  },
  { id: "amountInCrore", label: "Amount (Cr.)" },
  {
    id: "status",
    label: "Status",
    format: (r) => <StatusBadge status={r.status} />,
  },
  {
    id: "id",
    label: "Actions",
    format: (r, sn, index, row, onView, onUpdate) => (
      <Box
        sx={{ display: "flex", gap: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="small"
          variant="text"
          sx={{ color: boiBlue, fontWeight: 600 }}
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

export function ComplaintTable({ onAdd, onView, onUpdate }) {
  const [filteredRows, setFilteredRows] = useState(mockComplaintList);

  const handleSearch = (searchParams) => {
    let filtered = [...mockComplaintList];

    if (searchParams.status && searchParams.status !== "All Statuses") {
      filtered = filtered.filter((row) => row.status === searchParams.status);
    }
    if (searchParams.reference && searchParams.reference.trim() !== "") {
      filtered = filtered.filter((row) =>
        row.complaintNumber
          .toLowerCase()
          .includes(searchParams.reference.toLowerCase()),
      );
    }
    if (searchParams.type && searchParams.type !== "All Types") {
      filtered = filtered.filter(
        (row) => row.typeOfFraud === searchParams.type,
      );
    }

    setFilteredRows(filtered);
  };

  const handleReset = () => {
    setFilteredRows(mockComplaintList);
  };

  const enhancedColumns = columns.map((col) => {
    if (col.id === "id") {
      return {
        ...col,
        format: (r, sn, idx) => col.format(r, sn, idx, null, onView, onUpdate),
      };
    }
    return col;
  });

  return (
    <Box>
      <Typography
        sx={{ fontWeight: 700, mb: 2, color: boiBlue, fontSize: "1.15rem" }}
      >
        View Complaint Forms
      </Typography>
      <FilterBar
        statusOptions={COMPLAINT_STATUS_OPTS}
        typeOptions={COMPLAINT_TYPE_OPTS}
        onSearch={handleSearch}
        onReset={handleReset}
        showSourceFilter={false}
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
          sx={{ width: 4, height: 28, bgcolor: boiOrange, borderRadius: 1 }}
        />
        <Typography
          variant="h6"
          sx={{ flex: 1, fontWeight: 700, fontSize: "1.05rem" }}
        >
          Complaint List ({filteredRows.length} records)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ borderRadius: "10px" }}
        >
          + Add Complaint
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
