import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormTabs } from "../../components/common/FormTabs";
import { useToast } from "../../components/common/ToastContext";
import { emptyApprovalForm, mockDashboard } from "./ApprovalData";
import { ApprovalTable } from "./ApprovalTable";
import { ApprovalForm } from "./ApprovalForm";

function initialApprovalTab() {
  return "view";
}

export default function ApprovalPage() {
  const { success } = useToast();
  const [mainTab, setMainTab] = useState(initialApprovalTab);
  const [viewPane, setViewPane] = useState("list");
  const [formMode, setFormMode] = useState("add");
  const [formValues, setFormValues] = useState(() => emptyApprovalForm);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const patchForm = (patch) => setFormValues((prev) => ({ ...prev, ...patch }));

  const formFromRow = (row) => {
    const foundRow = mockDashboard.approvalList.find((r) => r.id === row.id);
    if (foundRow) {
      return { ...foundRow };
    }
    return {
      ...emptyApprovalForm,
      refNo: row.referenceNumber,
      typeOfComplaint: row.typeOfComplaint,
      sourceOfComplaint: row.sourceOfComplaint,
      date: new Date().toISOString().slice(0, 10),
    };
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
    setFormValues(emptyApprovalForm);
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
      setFormValues(emptyApprovalForm);
      setSelectedRowId(null);
    }
  };

  const handleSaveDraft = () => {
    console.log("=== DRAFT SAVED ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", formMode);
    success("Draft saved successfully");
  };

  const handleSubmitApproval = () => {
    console.log("=== SUBMITTED FOR APPROVAL ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", formMode);
    success("Submitted for approval");
  };

  const handleFinalSubmit = () => {
    console.log("=== FINAL SUBMITTED ===");
    console.log("Complete Form Data:", JSON.stringify(formValues, null, 2));
    success("Final submitted successfully");
  };

  const handlePrint = () => {
    console.log("=== PRINT REQUEST ===");
    console.log("Printing Form:", formValues.refNo);
    window.print();
    success("Print dialog opened");
  };

  const docTitle =
    formMode === "add"
      ? "Add Approval Forms"
      : formMode === "update"
        ? "Update Approval Form"
        : "View Approval Forms";

  const APPROVAL_TABS = [
    { value: "view", label: "View Approval Forms" },
    { value: "add", label: "Add Approval Form" },
  ];

  return (
    <Box>
      <FormTabs
        value={mainTab}
        onChange={handleTabChange}
        tabs={APPROVAL_TABS}
      />

      {mainTab === "view" && viewPane === "list" && (
        <ApprovalTable
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
          <ApprovalForm
            mode="view"
            values={formValues}
            onChange={patchForm}
            title={docTitle}
            onPrint={handlePrint}
            onFinalSubmit={handleFinalSubmit}
          />
        </Box>
      )}

      {mainTab === "add" && (
        <ApprovalForm
          mode={formMode === "update" ? "update" : "add"}
          values={formValues}
          onChange={patchForm}
          title={docTitle}
          onSaveDraft={handleSaveDraft}
          onSubmitApproval={handleSubmitApproval}
        />
      )}
    </Box>
  );
}
