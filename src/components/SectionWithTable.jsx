import React, { useRef, useState } from "react";
import {
  BOITable,
  BOIButton,
  showBOIToast,
  BOICard,
  BOIDialog,
  BOILoader,
} from "./common";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import DynamicForm from "./DynamicForm";
import {
  metaDataFields,
  decisionFields,
  getOptionsMap,
  getInitialFormState,
} from "./config/formConfig";

const SectionWithTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      fileName: "Vigilance Report Q1",
      fileTitle: "Quarterly Vigilance Report",
      docType: "pdf",
      cateType: "financial",
      classType: "confidential",
      tagsType: ["urgent", "important"],
      keyword: "vigilance, report",
      decision: "Approved",
      status: "Active",
    },
    {
      id: 2,
      fileName: "Audit Findings",
      fileTitle: "Annual Audit Report",
      docType: "word",
      cateType: "legal",
      classType: "secret",
      tagsType: ["review"],
      keyword: "audit, findings",
      decision: "Under Review",
      status: "Pending",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const optionsMap = getOptionsMap();

  const columns = [
    { field: "id", headerName: "Case ID", sortable: true },
    { field: "fileName", headerName: "File Name", sortable: true },
    { field: "fileTitle", headerName: "File Title", sortable: true },
    {
      field: "docType",
      headerName: "Document Type",
      sortable: true,
      render: (value) =>
        optionsMap.documentOptions.find((opt) => opt.id === value)?.label ||
        value,
    },
    {
      field: "decision",
      headerName: "Decision",
      sortable: true,
      render: (value) => (
        <span
          style={{
            color:
              value === "Approved"
                ? "#2e7d32"
                : value === "Rejected"
                  ? "#f44336"
                  : "#ff9800",
            fontWeight: "bold",
          }}
        >
          {value}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      render: (value) => (
        <span
          style={{
            color: value === "Active" ? "#2e7d32" : "#ff9800",
            backgroundColor: value === "Active" ? "#e8f5e9" : "#fff3e0",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedRow(null);
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setDialogMode("edit");
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleView = (row) => {
    setDialogMode("view");
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setData(data.filter((item) => item.id !== row.id));
    showBOIToast({
      message: `${row.fileName} has been removed`,
      type: "success",
      title: "Case Deleted",
    });
  };

  const handleSubmit = async () => {
    if (formRef.current) {
      const isValid = formRef.current.validateForm();
      if (!isValid) return;

      const formData = formRef.current.getFormData();
      setLoading(true);

      setTimeout(() => {
        if (dialogMode === "add") {
          const newId = Math.max(...data.map((item) => item.id), 0) + 1;
          const newData = {
            id: newId,
            ...formData,
            status: "Active",
          };
          setData([...data, newData]);
          showBOIToast({
            message: "Case added successfully",
            type: "success",
            title: "Success",
          });
        } else if (dialogMode === "edit") {
          const updatedData = data.map((item) =>
            item.id === selectedRow.id ? { ...item, ...formData } : item,
          );
          setData(updatedData);
          showBOIToast({
            message: "Case updated successfully",
            type: "success",
            title: "Success",
          });
        }
        setLoading(false);
        setOpenDialog(false);
      }, 1000);
    }
  };

  const getInitialValues = () => {
    if (dialogMode === "edit" && selectedRow) {
      return selectedRow;
    }
    return getInitialFormState();
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case "add":
        return "Add New Vigilance Case";
      case "edit":
        return "Edit Vigilance Case";
      case "view":
        return "View Vigilance Case Details";
      default:
        return "Vigilance Case";
    }
  };

  const actions = [
    {
      icon: <ViewIcon />,
      onClick: handleView,
      color: "#4caf50",
    },
    {
      icon: <EditIcon />,
      onClick: handleEdit,
      color: "#1976d2",
    },
    {
      icon: <DeleteIcon />,
      onClick: handleDelete,
      color: "#f44336",
    },
  ];

  return (
    <>
      <BOICard
        title="Vigilance Case Management"
        subtitle="Manage and track all vigilance cases with metadata"
        headerAction={
          <BOIButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            color="primary"
          >
            Add New Case
          </BOIButton>
        }
      >
        <BOITable
          columns={columns}
          rows={data}
          actions={actions}
          onRowClick={(row) => console.log("Row clicked:", row)}
          showSearch={true}
          showPagination={true}
        />
      </BOICard>

      <BOIDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={getDialogTitle()}
        maxWidth="lg"
        fullWidth
        actions={
          dialogMode !== "view" && !loading ? (
            <>
              <BOIButton
                variant="outlined"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </BOIButton>
              <BOIButton
                variant="contained"
                onClick={handleSubmit}
                color="primary"
                startIcon={<SaveIcon />}
              >
                {dialogMode === "add" ? "Add Case" : "Save Changes"}
              </BOIButton>
            </>
          ) : dialogMode === "view" ? (
            <BOIButton variant="contained" onClick={() => setOpenDialog(false)}>
              Close
            </BOIButton>
          ) : null
        }
      >
        {loading ? (
          <BOILoader message="Processing..." />
        ) : (
          <Stack spacing={3}>
            <Typography
              variant="h6"
              sx={{ color: "#1976d2", fontWeight: "bold" }}
            >
              Metadata Information
            </Typography>
            <DynamicForm
              ref={formRef}
              fields={metaDataFields}
              optionsMap={optionsMap}
              initialValues={getInitialValues()}
              columns={2}
              readOnly={dialogMode === "view"}
              showActions={false}
            />

            <Typography
              variant="h6"
              sx={{ color: "#1976d2", fontWeight: "bold", mt: 2 }}
            >
              Decision Information
            </Typography>
            <DynamicForm
              fields={decisionFields}
              optionsMap={optionsMap}
              initialValues={getInitialValues()}
              columns={2}
              readOnly={dialogMode === "view"}
              showActions={false}
            />
          </Stack>
        )}
      </BOIDialog>
    </>
  );
};

export default SectionWithTable;
