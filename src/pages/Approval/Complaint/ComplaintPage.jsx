import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { emptyComplaintForm, mockComplaintList } from "./ComplaintData";
import { ComplaintTable } from "./ComplaintTable";
import { ComplaintForm } from "./ComplaintForm";
import { FormTabs, useToast } from "../../../components/common";

const COMPLAINT_TABS = [
  { value: "view", label: "View Complaints" },
  { value: "add", label: "Add Complaint" },
];

export default function ComplaintPage() {
  const { success } = useToast();
  const [mainTab, setMainTab] = useState("view");
  const [viewPane, setViewPane] = useState("list");
  const [formMode, setFormMode] = useState("add");
  const [formValues, setFormValues] = useState(() => emptyComplaintForm);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const patchForm = (patch) => setFormValues((prev) => ({ ...prev, ...patch }));

  const formFromRow = (row) => {
    const foundRow = mockComplaintList.find((r) => r.id === row.id);
    if (foundRow) {
      return { ...emptyComplaintForm, ...foundRow };
    }
    return { ...emptyComplaintForm };
  };

  const openViewDocument = (row, e) => {
    if (e) e.stopPropagation();
    setFormValues(formFromRow(row));
    setSelectedRowId(row.id);
    setFormMode("view");
    setViewPane("document");
    setMainTab("view");
  };

  const openUpdate = (row, e) => {
    if (e) e.stopPropagation();
    setFormValues(formFromRow(row));
    setSelectedRowId(row.id);
    setFormMode("update");
    setMainTab("add");
  };

  const openAdd = () => {
    setFormValues(emptyComplaintForm);
    setSelectedRowId(null);
    setFormMode("add");
    setMainTab("add");
  };

  const handleTabChange = (tab) => {
    setMainTab(tab);
    if (tab === "view") {
      setViewPane("list");
    } else {
      setFormMode("add");
      setFormValues(emptyComplaintForm);
      setSelectedRowId(null);
    }
  };

  const handleSaveDraft = () => {
    console.log("=== DRAFT SAVED ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    success("Draft saved successfully");
  };

  const handleSubmit = () => {
    console.log("=== SUBMITTED ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    success("Complaint submitted successfully");
  };

  const docTitle =
    formMode === "add"
      ? "Add Complaint Form"
      : formMode === "update"
        ? "Update Complaint Form"
        : "View Complaint Form";

  return (
    <Box>
      <FormTabs
        value={mainTab}
        onChange={handleTabChange}
        tabs={COMPLAINT_TABS}
      />

      {mainTab === "view" && viewPane === "list" && (
        <ComplaintTable
          onAdd={openAdd}
          onView={openViewDocument}
          onUpdate={openUpdate}
        />
      )}

      {mainTab === "view" && viewPane === "document" && (
        <Box>
          <Button
            sx={{ mb: 2 }}
            variant="outlined"
            onClick={() => setViewPane("list")}
          >
            ← Back to list
          </Button>
          <ComplaintForm
            mode="view"
            values={formValues}
            onChange={patchForm}
            title={docTitle}
          />
        </Box>
      )}

      {mainTab === "add" && (
        <ComplaintForm
          mode={formMode === "update" ? "update" : "add"}
          values={formValues}
          onChange={patchForm}
          title={docTitle}
          onSaveDraft={handleSaveDraft}
          onSubmitApproval={handleSubmit}
        />
      )}
    </Box>
  );
}
