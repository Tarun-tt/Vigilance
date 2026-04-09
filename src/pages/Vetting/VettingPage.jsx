import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormTabs } from "../../components/common/FormTabs";
import { useToast } from "../../components/common/ToastContext";
import { emptyVettingForm, mockDashboard } from "./VettingData";
import { VettingTable } from "./VettingTable";
import { VettingForm } from "./VettingForm";

function initialVettingTab() {
  return "view";
}

export default function VettingPage() {
  const { success } = useToast();
  const [mainTab, setMainTab] = useState(initialVettingTab);
  const [viewPane, setViewPane] = useState("list");
  const [formMode, setFormMode] = useState("add");
  const [formValues, setFormValues] = useState(() => emptyVettingForm);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const patchForm = (patch) => setFormValues((prev) => ({ ...prev, ...patch }));

  const formFromRow = (row) => {
    const foundRow = mockDashboard.vettingList.find((r) => r.id === row.id);
    if (foundRow) {
      return { ...foundRow };
    }
    return {
      ...emptyVettingForm,
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
    setFormValues(emptyVettingForm);
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
      setFormValues(emptyVettingForm);
      setSelectedRowId(null);
    }
  };

  const handleSaveDraft = () => {
    console.log("=== DRAFT SAVED ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", formMode);
    success("Draft saved successfully");
  };

  const handleSubmitVetting = () => {
    console.log("=== SUBMITTED FOR VETTING ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", formMode);
    success("Submitted for vetting");
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
      ? "Add Vetting Forms"
      : formMode === "update"
        ? "Update Vetting Form"
        : "View Vetting Forms";

  const VETTING_TABS = [
    { value: "view", label: "View Vetting Forms" },
    { value: "add", label: "Add Vetting Form" },
  ];

  return (
    <Box>
      <FormTabs
        value={mainTab}
        onChange={handleTabChange}
        tabs={VETTING_TABS}
      />

      {mainTab === "view" && viewPane === "list" && (
        <VettingTable
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
          <VettingForm
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
        <VettingForm
          mode={formMode === "update" ? "update" : "add"}
          values={formValues}
          onChange={patchForm}
          title={docTitle}
          onSaveDraft={handleSaveDraft}
          onSubmitVetting={handleSubmitVetting}
        />
      )}
    </Box>
  );
}
