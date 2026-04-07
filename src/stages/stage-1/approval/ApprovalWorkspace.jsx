import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PrintIcon from "@mui/icons-material/Print";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { IconButton, InputAdornment } from "@mui/material";
import { FormTabs, ContentCard } from "../../../components/layout";
import {
  CustomAutocomplete,
  DataTable,
  FilterBar,
  StatusBadge,
  CustomTextField,
  useToast,
} from "../../../components/common";
import { emptyApprovalForm } from "../data/approvalFormDefaults";
import mockDashboard from "../data/mockDashboard.json";
import { sampleFilledForm } from "../data/sampleApprovalForm";
import { matchRoute } from "../../../app/routeConfig";
import {
  boiBlue,
  boiOrange,
  boiBorder,
  boiTableHeaderBg,
} from "../../../theme/theme";

const labelCell = {
  width: "28%",
  bgcolor: boiTableHeaderBg,
  fontWeight: 600,
  fontSize: 13,
  borderColor: boiBorder,
  verticalAlign: "top",
};

const valueCell = {
  borderColor: boiBorder,
  p: 0,
};

const yesNoOptions = ["Yes", "No", "Pending"];

// Form Configuration
const approvalFormConfig = {
  sections: [
    {
      id: "reference",
      title: "1. Reference:",
      type: "table",
      fields: [
        {
          label: "Name of Account/Complainant",
          name: "nameOfAccount",
          type: "text",
        },
        {
          label: "Date of Complaint/NPA",
          name: "dateOfComplaint",
          type: "text",
        },
        { label: "Type of complaint", name: "typeOfComplaint", type: "text" },
        {
          label: "Source/received through",
          name: "sourceOfComplaint",
          type: "text",
        },
        { label: "Letter reference No & date", name: "npaDate", type: "text" },
        {
          label: "Date of declaration of Fraud",
          name: "presentAccountStatus",
          type: "text",
        },
        {
          label: "Fraud/Complaint Resignation No.",
          name: "lendingBranch",
          type: "text",
        },
        { label: "Date of receipt", name: "staffInvolved", type: "text" },
      ],
    },
    {
      id: "complainantDetails",
      title: "2. Details of complainant / Account",
      type: "complex-table",
      layout: [
        { label: "Name", name: "complainantName", colSpan: 3, type: "text" },
        { label: "Address", name: "address", type: "text", multiline: true },
        // { label: "State", name: "state", type: "text" },
        { label: "Email", name: "email", type: "text" },
        // { label: "Mobile No.", name: "mobile", type: "text" },
        { label: "Amount Involved", name: "amountInvolved", type: "text" },
        // { label: "Probable Loss", name: "probableLoss", type: "text" },
        { label: "Pin", name: "pin", type: "text" },
      ],
    },
    {
      id: "kyc",
      title: "3. Establishment of KYC",
      type: "table",
      fields: [
        { label: "1st Letter", name: "kycLetter1", type: "text" },
        { label: "2nd Letter", name: "kycLetter2", type: "text" },
        { label: "Reply Received", name: "kycLetter3", type: "text" },
        { label: "KYC Establishment", name: "kycStatus", type: "text" },
        { label: "KYC No", name: "kycRemarks", type: "text" },
      ],
    },
    {
      id: "allegation",
      title: "4. Allegation / Modus operandi",
      type: "complex-table",
      layout: [
        { label: "Branch", name: "branchOffice", type: "text" },
        { label: "Zone", name: "zoneNbg", type: "text" },
        {
          label: "Whether involvement of Bank`s official?",
          name: "officialInvolvement",
          type: "textarea",
          multiline: true,
          colSpan: 3,
        },
        {
          label: "If yes, details",
          name: "allegationDetails",
          type: "textarea",
          multiline: true,
          colSpan: 3,
        },
        {
          label: "Modus operandi",
          name: "modusOperandi",
          type: "textarea",
          multiline: true,
          colSpan: 3,
        },
      ],
    },
    {
      id: "scope",
      title: "5. Scope of Investigation",
      type: "dynamic-table",
      fields: [
        { label: "S.No", name: "sno", type: "number", width: 180 },
        { label: "Particulars", name: "particulars", type: "textarea" },
      ],
    },
    {
      id: "allotment",
      title: "6. Allotment and timeline of investigation",
      type: "complex-table",
      layout: [
        {
          label: "Name of Officer & PF No",
          name: "officerDetails",
          type: "compound",
          fields: [
            { name: "officerName", placeholder: "Name", type: "text" },
            { name: "officerPf", placeholder: "PF No", type: "text" },
          ],
        },
        { label: "Designation", name: "designation", type: "text" },
        { label: "Present Posting", name: "posting", type: "text" },
        {
          label: "Proposed completion date",
          name: "proposedDate",
          type: "text",
        },
      ],
    },
    {
      id: "deptObservation",
      title: "7. Department Observation",
      type: "textarea",
      name: "deptObservation",
    },
    {
      id: "cvoComments",
      title:
        "8. Comments / advise / instruction of the Chief Vigilance Officer",
      type: "textarea",
      name: "cvoComments",
    },
  ],
};

const STATUS_OPTS = [
  "All Statuses",
  "Approved",
  "Draft",
  "Pending",
  "Not approved",
];
const TYPE_OPTS = [
  "All Types",
  "Fraud",
  "PIDPI",
  "CVC",
  "Whistle blower",
  "Misconduct",
  "NPA",
];
const SOURCE_OPTS = [
  "All Sources",
  "Internal",
  "Customer",
  "RBI",
  "Agency",
  "FRMD",
  "Whistleblower",
];

function initialApprovalTab() {
  if (typeof window === "undefined") return "add";
  const hit = matchRoute(window.location.pathname);
  return hit?.route?.approvalDefaultTab === "view" ? "view" : "add";
}

function ApprovalFormDocument({
  mode,
  values,
  onChange,
  title,
  onSaveDraft,
  onSubmitApproval,
  onFinalSubmit,
  onPrint,
}) {
  const readOnly = mode === "view";
  const showViewActions = mode === "view";
  const showAddActions = mode === "add" || mode === "update";

  const set = (field, v) => onChange({ [field]: v });

  const renderField = (fieldConfig, value, onChangeHandler, readOnlyFlag) => {
    if (fieldConfig.type === "textarea") {
      return (
        <CustomTextField
          cellVariant
          multiline
          minRows={fieldConfig.multiline ? 1 : 4}
          value={value || ""}
          onChange={(e) => onChangeHandler(e.target.value)}
          inputProps={{ readOnly: readOnlyFlag }}
        />
      );
    }
    return (
      <CustomTextField
        cellVariant
        value={value || ""}
        onChange={(e) => onChangeHandler(e.target.value)}
        inputProps={{ readOnly: readOnlyFlag }}
        placeholder={fieldConfig.placeholder}
      />
    );
  };

  const renderTableSection = (section) => {
    return (
      <Table size="small" sx={{ border: `1px solid ${boiBorder}`, mb: 2 }}>
        <TableBody>
          {section.fields.map((field) => (
            <TableRow key={field.name}>
              <TableCell sx={labelCell}>{field.label}</TableCell>
              <TableCell sx={valueCell}>
                {renderField(
                  field,
                  values[field.name],
                  (v) => set(field.name, v),
                  readOnly,
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderComplexTableSection = (section) => {
    return (
      <Table size="small" sx={{ border: `1px solid ${boiBorder}`, mb: 2 }}>
        <TableBody>
          {section.layout.map((field, idx) => {
            if (field.type === "compound") {
              return (
                <TableRow key={field.name}>
                  <TableCell sx={labelCell}>{field.label}</TableCell>
                  <TableCell sx={valueCell} colSpan={field.colSpan || 3}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {field.fields.map((subField) => (
                        <CustomTextField
                          key={subField.name}
                          cellVariant
                          placeholder={subField.placeholder}
                          value={values[subField.name] || ""}
                          onChange={(e) => set(subField.name, e.target.value)}
                          inputProps={{ readOnly }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={field.name}>
                <TableCell sx={labelCell}>{field.label}</TableCell>
                <TableCell
                  sx={valueCell}
                  colSpan={field.colSpan || (field.label === "Name" ? 3 : 1)}
                >
                  {field.name === "address" ? (
                    <CustomTextField
                      cellVariant
                      multiline
                      minRows={1}
                      value={values[field.name] || ""}
                      onChange={(e) => set(field.name, e.target.value)}
                      inputProps={{ readOnly }}
                    />
                  ) : field.type === "textarea" ? (
                    <CustomTextField
                      cellVariant
                      multiline
                      minRows={1}
                      value={values[field.name] || ""}
                      onChange={(e) => set(field.name, e.target.value)}
                      inputProps={{ readOnly }}
                    />
                  ) : (
                    <CustomTextField
                      cellVariant
                      value={values[field.name] || ""}
                      onChange={(e) => set(field.name, e.target.value)}
                      inputProps={{ readOnly }}
                    />
                  )}
                </TableCell>
                {field.label === "Address" && (
                  <>
                    <TableCell sx={labelCell}>State</TableCell>
                    <TableCell sx={valueCell}>
                      <CustomTextField
                        cellVariant
                        value={values.state || ""}
                        onChange={(e) => set("state", e.target.value)}
                        inputProps={{ readOnly }}
                      />
                    </TableCell>
                  </>
                )}
                {field.label === "Email" && (
                  <>
                    <TableCell sx={labelCell}>Mobile No.</TableCell>
                    <TableCell sx={valueCell}>
                      <CustomTextField
                        cellVariant
                        value={values.mobile || ""}
                        onChange={(e) => set("mobile", e.target.value)}
                        inputProps={{ readOnly }}
                      />
                    </TableCell>
                  </>
                )}
                {field.label === "Amount Involved" && (
                  <>
                    <TableCell sx={labelCell}>Probable Loss</TableCell>
                    <TableCell sx={valueCell}>
                      <CustomTextField
                        cellVariant
                        value={values.probableLoss || ""}
                        onChange={(e) => set("probableLoss", e.target.value)}
                        inputProps={{ readOnly }}
                      />
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  const renderDynamicTableSection = (section) => {
    return (
      <Table
        size="small"
        sx={{
          border: `1px solid ${boiBorder}`,
          mb: 2,
          "& td, & th": {
            border: `1px solid ${boiBorder}`,
          },
        }}
      >
        <TableBody>
          <TableRow sx={{ bgcolor: boiTableHeaderBg }}>
            {section.fields.map((field) => (
              <TableCell
                key={field.name}
                sx={{
                  fontWeight: 700,
                  width: field.width,
                  textAlign: "center",
                }}
              >
                {field.label}
              </TableCell>
            ))}
          </TableRow>
          {values.scopeRows.map((row, i) => (
            <TableRow key={row.sno}>
              <TableCell>{row.sno}</TableCell>
              <TableCell sx={valueCell}>
                <CustomTextField
                  cellVariant
                  value={row.particulars}
                  onChange={(e) => {
                    const next = [...values.scopeRows];
                    next[i] = { ...next[i], particulars: e.target.value };
                    onChange({ scopeRows: next });
                  }}
                  inputProps={{ readOnly }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderTextareaSection = (section) => {
    return (
      <CustomTextField
        multiline
        minRows={4}
        fullWidth
        value={values[section.name] || ""}
        onChange={(e) => set(section.name, e.target.value)}
        inputProps={{ readOnly }}
        sx={{ mb: 2 }}
      />
    );
  };

  const renderSection = (section) => {
    switch (section.type) {
      case "table":
        return renderTableSection(section);
      case "complex-table":
        return renderComplexTableSection(section);
      case "dynamic-table":
        return renderDynamicTableSection(section);
      case "textarea":
        return renderTextareaSection(section);
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "12px",
        border: `1px solid ${boiBorder}`,
        boxShadow: "0 2px 16px rgba(0, 45, 90, 0.06)",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: 700, mb: 0.25, fontSize: "1.05rem" }}
      >
        Bank of India
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ mb: 1.5, color: "text.secondary" }}
      >
        Head Office, Vigilance Department
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          px: 1,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Ref. No-HO:
          </Typography>
          <CustomTextField
            size="small"
            value={values.refNo}
            onChange={(e) => set("refNo", e.target.value)}
            inputProps={{ readOnly }}
            disabled={readOnly}
            sx={{ width: 200 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Date:</Typography>
          <DatePicker
            label=""
            value={values.date ? dayjs(values.date) : null}
            onChange={(d) => set("date", d ? d.format("YYYY-MM-DD") : "")}
            disabled={readOnly}
            slotProps={{
              textField: {
                size: "small",
                sx: { width: 160 },
              },
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 2,
          textDecoration: "underline",
          textUnderlineOffset: 5,
          fontSize: "1.1rem",
        }}
      >
        Approval for detailed Vigilance Investigation
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, mb: 1, color: boiBlue }}
      >
        {title}
      </Typography>

      {approvalFormConfig.sections.map((section) => (
        <Box key={section.id}>
          <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: 14 }}>
            {section.title}
          </Typography>
          {renderSection(section)}
        </Box>
      ))}

      {showViewActions && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "rgba(0, 86, 150, 0.06)",
            borderColor: boiBlue,
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 2 }}>
            Generation of Complaint Number
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={onPrint}
              sx={{ flex: 1 }}
            >
              Print Approval Form
            </Button>

            <Box sx={{ flex: 1 }}>
              <CustomAutocomplete
                options={yesNoOptions}
                value={values.isFormApproved || null}
                onChange={(_, v) => onChange({ isFormApproved: v ?? "" })}
                label="Is Form Approved?"
                readOnly={readOnly}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
            }}
          >
            <CustomTextField
              label="Date of Approval"
              type="date"
              size="small"
              value={values.dateOfApproval || ""}
              onChange={(e) =>
                onChange({
                  dateOfApproval: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />

            <Box sx={{ flex: 1 }}>
              <CustomTextField
                label="Attach Document"
                size="small"
                value={values.attachDocument?.name || ""}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton component="label">
                        <CloudUploadIcon color="primary" />
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            onChange({
                              attachDocument: e.target.files[0],
                            })
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button variant="contained" color="primary" onClick={onFinalSubmit}>
              Final Submit
            </Button>
          </Box>
        </Paper>
      )}

      {showAddActions && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, pt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={onSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onSubmitApproval}
          >
            Submit to approval
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export function ApprovalWorkspace() {
  const { success } = useToast();
  const [mainTab, setMainTab] = useState(initialApprovalTab);
  const [viewPane, setViewPane] = useState("list");
  const [formMode, setFormMode] = useState("add");
  const [formValues, setFormValues] = useState(() => emptyApprovalForm());

  // Filter states
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [filterReference, setFilterReference] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [filteredRows, setFilteredRows] = useState(mockDashboard.approvalList);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const patchForm = (patch) => setFormValues((prev) => ({ ...prev, ...patch }));

  const formFromRow = (row) => {
    if (row.id === "1") return sampleFilledForm();
    return {
      ...emptyApprovalForm(),
      refNo: row.referenceNumber,
      typeOfComplaint: row.typeOfComplaint,
      sourceOfComplaint: row.sourceOfComplaint,
      date: new Date().toISOString().slice(0, 10),
    };
  };

  // Filter function combining all filters
  const applyFilters = () => {
    let filtered = [...mockDashboard.approvalList];

    if (filterStatus !== "All Statuses") {
      filtered = filtered.filter((row) => row.status === filterStatus);
    }

    if (filterReference.trim() !== "") {
      filtered = filtered.filter((row) =>
        row.referenceNumber
          .toLowerCase()
          .includes(filterReference.toLowerCase()),
      );
    }

    if (filterType !== "All Types") {
      filtered = filtered.filter((row) => row.typeOfComplaint === filterType);
    }

    if (filterSource !== "All Sources") {
      filtered = filtered.filter(
        (row) => row.sourceOfComplaint === filterSource,
      );
    }

    setFilteredRows(filtered);
  };

  const handleSearch = (searchParams) => {
    setFilterStatus(searchParams.status);
    setFilterReference(searchParams.reference);
    setFilterType(searchParams.type);
    setFilterSource(searchParams.source);
    setSearchTriggered(true);

    let filtered = [...mockDashboard.approvalList];

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
    success(`Search applied - Found ${filtered.length} records`);
  };

  const handleReset = () => {
    setFilterStatus("All Statuses");
    setFilterReference("");
    setFilterType("All Types");
    setFilterSource("All Sources");
    setFilteredRows(mockDashboard.approvalList);
    setSearchTriggered(false);
    success("Filters reset");
  };

  useEffect(() => {
    if (searchTriggered) {
      applyFilters();
    }
  }, [
    filterStatus,
    filterReference,
    filterType,
    filterSource,
    searchTriggered,
  ]);

  const openViewDocument = (row, e) => {
    if (e) e.stopPropagation();
    setFormValues(formFromRow(row));
    setFormMode("view");
    setViewPane("document");
    setMainTab("view");
  };

  const openUpdate = (row, e) => {
    if (e) e.stopPropagation();
    setFormValues(formFromRow(row));
    setFormMode("update");
    setMainTab("add");
  };

  const openAdd = () => {
    setFormValues(emptyApprovalForm());
    setFormMode("add");
    setMainTab("add");
  };

  const handleTabChange = (tab) => {
    setMainTab(tab);
    if (tab === "view") setViewPane("list");
    else {
      setFormMode("add");
      setFormValues(emptyApprovalForm());
    }
  };

  const handleRowClick = (row) => {
    openViewDocument(row);
  };

  const handleSaveDraft = () => {
    console.log("=== DRAFT SAVED ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", formMode);
    console.log("Timestamp:", new Date().toISOString());
    success("Draft saved");
  };

  const handleSubmitApproval = () => {
    console.log("=== SUBMITTED FOR APPROVAL ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", formMode);
    console.log("Submission Date:", new Date().toISOString());
    console.log("Status: Pending Approval");
    success("Submitted for approval");
  };

  const handleFinalSubmit = () => {
    console.log("=== FINAL SUBMITTED ===");
    console.log("Complete Form Data:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", formMode);
    console.log("Submission Date:", new Date().toISOString());
    console.log("Is Form Approved:", formValues.isFormApproved);
    console.log("Date of Approval:", formValues.dateOfApproval);
    console.log(
      "Attached Document:",
      formValues.attachDocument?.name || "No document attached",
    );
    success("Final submit");
  };

  const handlePrint = () => {
    console.log("=== PRINT REQUEST ===");
    console.log("Printing Form:", formValues.refNo);
    console.log("Timestamp:", new Date().toISOString());
    success("Print dialog");
  };

  const docTitle =
    formMode === "add"
      ? "Add Approval Forms"
      : formMode === "update"
        ? "Update Approval Form"
        : "View Approval Forms";

  const columns = [
    {
      id: "sn",
      label: "S.N.",
      format: (_r, sn) => String(sn).padStart(2, "0"),
    },
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
      format: (r, index, row) => (
        <Box
          sx={{ display: "flex", gap: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="small"
            variant="text"
            sx={{ color: boiBlue, fontWeight: 600 }}
            onClick={(e) => openViewDocument(r, e)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="text"
            color="secondary"
            onClick={(e) => openUpdate(r, e)}
          >
            Update
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <ContentCard>
      <FormTabs value={mainTab} onChange={handleTabChange} />
      {mainTab === "view" && viewPane === "list" && (
        <Box>
          <Typography
            sx={{ fontWeight: 700, mb: 2, color: boiBlue, fontSize: "1.15rem" }}
          >
            View Approval Forms
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
              sx={{ width: 4, height: 28, bgcolor: boiOrange, borderRadius: 1 }}
            />
            <Typography
              variant="h6"
              sx={{ flex: 1, fontWeight: 700, fontSize: "1.05rem" }}
            >
              Approval List ({filteredRows.length} records)
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openAdd}
              sx={{ borderRadius: "10px" }}
            >
              + Add Approval Form
            </Button>
          </Box>
          <DataTable
            columns={columns}
            rows={filteredRows}
            getRowId={(r) => r.id}
            onRowClick={handleRowClick}
          />
        </Box>
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
          <ApprovalFormDocument
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
        <ApprovalFormDocument
          mode={formMode === "update" ? "update" : "add"}
          values={formValues}
          onChange={patchForm}
          title={docTitle}
          onSaveDraft={handleSaveDraft}
          onSubmitApproval={handleSubmitApproval}
        />
      )}
    </ContentCard>
  );
}
