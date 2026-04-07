import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ContentCard } from "../../../components/layout";
import { FormSectionBar } from "../../../components/forms/FormSectionBar";
import { WorkspaceActionBar } from "../../../components/forms/WorkspaceActionBar";
import {
  CustomAutocomplete,
  CustomTextField,
  useToast,
} from "../../../components/common";
import { boiBlue, boiBorder, boiInputSoftBg } from "../../../theme/theme";

const soft = {
  "& .MuiOutlinedInput-root": { bgcolor: boiInputSoftBg, borderRadius: "10px" },
};

// Form Configuration
const complaintFormConfig = [
  // Complaint Details Section
  {
    section: "01 Complaint Details",
    fields: [
      {
        label: "Complaint Number",
        name: "complaintNumber",
        type: "text",
        required: true,
        maxLength: 100,
        readOnly: false,
        placeholder: "Complaint Number",
      },
      {
        label: "Fraud Reported?",
        name: "fraudReported",
        type: "select",
        required: true,
        optionsKey: "YesNoOptions",
        placeholder: "Select Fraud Reported",
      },
    ],
  },
  {
    section: "Fraud Details",
    fields: [
      {
        label: "Person Type",
        name: "personType",
        type: "select",
        required: true,
        optionsKey: "PersonTypeOptions",
        placeholder: "Enter Person Type",
      },
      {
        label: "Type of Fraud",
        name: "typeOfFraud",
        type: "select",
        required: true,
        optionsKey: "PersonTypeOptions",
        placeholder: "Select Type of Fraud",
      },
      {
        label: "RBI Reference Number",
        name: "rbiReferenceNumber",
        type: "text",
        required: false,
        maxLength: 100,
        readOnly: false,
        placeholder: "Enter RBI Reference",
      },
      {
        label: "Date 1",
        name: "date1",
        type: "date",
        required: true,
        readOnly: false,
        placeholder: "Select Date 1",
      },
      {
        label: "Date 2",
        name: "date2",
        type: "date",
        required: false,
        readOnly: false,
        placeholder: "Select Date 2",
      },
      {
        label: "Date 3",
        name: "date3",
        type: "date",
        required: false,
        readOnly: false,
        placeholder: "Select Date 3",
      },
      {
        label: "Construim / MBA",
        name: "construimMBA",
        type: "select",
        required: true,
        optionsKey: "YesNoOptions",
        placeholder: "Select Construim/MBA",
      },
      {
        label: "Date of Complaint",
        name: "dateOfComplaint",
        type: "date",
        required: true,
        readOnly: false,
        placeholder: "Select Date of Complaint",
      },
      {
        label: "FIR Registered",
        name: "firRegistered",
        type: "text",
        required: true,
        maxLength: 200,
        readOnly: false,
        placeholder: "Enter FIR / RC Number",
      },
      {
        label: "Attachment",
        name: "attachment",
        type: "file",
        required: false,
        readOnly: false,
      },
      {
        label: "Whether ABBBFF Advice Received",
        name: "whetherABBBFFAdviceReceived",
        type: "select",
        required: false,
        optionsKey: "YesNoOptions",
        placeholder: "Select ABBBFF Advice",
      },
    ],
  },
  {
    section: "Other Agencies Details",
    fields: [
      {
        label: "Select Agency",
        name: "selectAgency",
        type: "select",
        required: true,
        optionsKey: "AgencyOptions",
        placeholder: "Select Agency",
      },
      {
        label: "Date of Recipient of Complaint",
        name: "dateOfRecipientComplaint",
        type: "date",
        required: true,
        readOnly: false,
        placeholder: "Select Date of Recipient of Complaint",
      },
      {
        label: "Incident Occurred at",
        name: "incidentOccurredAt",
        type: "select",
        required: true,
        optionsKey: "IncidentOptions",
        placeholder: "Select Incident Occurred at",
      },
      {
        label: "Zone Name",
        name: "zoneName",
        type: "select",
        required: false,
        optionsKey: "ZoneOptions",
        placeholder: "Select Zone Name",
      },
      {
        label: "Branch Name",
        name: "branchName",
        type: "select",
        required: true,
        optionsKey: "BranchOptions",
        placeholder: "Select Branch Name",
      },
      {
        label: "Branch Code",
        name: "branchCode",
        type: "text",
        required: true,
        maxLength: 50,
        readOnly: false,
        placeholder: "Enter Branch Code",
      },
    ],
  },
  {
    section: "Additional Details",
    fields: [
      {
        label: "RBI Reference Number",
        name: "rbiReferenceNumber",
        type: "text",
        required: true,
        maxLength: 100,
        readOnly: false,
        placeholder: "Enter RBI Reference",
      },
      {
        label: "Date 3",
        name: "date3",
        type: "date",
        required: false,
        readOnly: false,
        placeholder: "Select Date 3",
      },
      {
        label: "Amount in Crore",
        name: "amountInCrore",
        type: "number",
        required: true,
        maxLength: 20,
        readOnly: false,
        placeholder: "Enter Amount in Crore",
      },
      {
        label: "Complaint File with CBI",
        name: "complaintFileWithCBI",
        type: "select",
        required: true,
        optionsKey: "YesNoOptions",
        placeholder: "Select Complaint File with CBI",
      },
      {
        label: "Place",
        name: "place",
        type: "text",
        required: true,
        maxLength: 200,
        readOnly: false,
        placeholder: "Enter Place",
      },
      {
        label: "Date",
        name: "date",
        type: "date",
        required: true,
        readOnly: false,
        placeholder: "Select Date",
      },
      {
        label: "Whether Eligible for ABBBFF ?",
        name: "whetherEligibleForABBBFF",
        type: "select",
        required: false,
        optionsKey: "YesNoOptions",
        placeholder: "Select Eligibility",
      },
      {
        label: "Whether Same Complaint Received from Other Agencies?",
        name: "whetherSameComplaintReceived",
        type: "select",
        required: false,
        optionsKey: "YesNoOptions",
        placeholder: "Select Option",
      },
      {
        label: "Description of Complaint",
        name: "descriptionOfComplaint",
        type: "textarea",
        required: false,
        maxLength: 2000,
        readOnly: false,
        placeholder: "Enter Description of Complaint",
      },
    ],
  },
  {
    section: "Account Type & Complainant Details",
    fields: [
      {
        label: "Enter Name of the Complainant",
        name: "complainantName1",
        type: "text",
        required: false,
        maxLength: 200,
        readOnly: false,
        placeholder: "Enter Name of the Complainant",
      },
      {
        label: "Account Type",
        name: "accountType1",
        type: "text",
        required: false,
        maxLength: 100,
        readOnly: false,
        placeholder: "Account Type",
      },
      {
        label: "Mobile Number",
        name: "mobileNumber1",
        type: "tel",
        required: false,
        maxLength: 15,
        readOnly: false,
        pattern: "^[0-9]{10}$",
        errorMessage: "Please enter a valid 10-digit mobile number",
        placeholder: "Enter Mobile Number",
      },
      {
        label: "Enter Name of the Complainant",
        name: "complainantName2",
        type: "text",
        required: false,
        maxLength: 200,
        readOnly: false,
        placeholder: "Enter Name of the Complainant",
      },
      {
        label: "Account Type",
        name: "accountType2",
        type: "text",
        required: false,
        maxLength: 100,
        readOnly: false,
        placeholder: "Account Type",
      },
      {
        label: "Mobile Number",
        name: "mobileNumber2",
        type: "tel",
        required: false,
        maxLength: 15,
        readOnly: false,
        pattern: "^[0-9]{10}$",
        errorMessage: "Please enter a valid 10-digit mobile number",
        placeholder: "Enter Mobile Number",
      },
      {
        label: "Enter Name and Address",
        name: "complainantAddress",
        type: "textarea",
        required: false,
        maxLength: 500,
        readOnly: false,
        placeholder: "Enter Name and Address",
      },
      {
        label: "Enter Name of the Complainant",
        name: "complainantName3",
        type: "text",
        required: false,
        maxLength: 200,
        readOnly: false,
        placeholder: "Enter Name of the Complainant",
      },
      {
        label: "Account Type",
        name: "accountType3",
        type: "text",
        required: false,
        maxLength: 100,
        readOnly: false,
        placeholder: "Account Type",
      },
      {
        label: "Mobile Number",
        name: "mobileNumber3",
        type: "tel",
        required: false,
        maxLength: 15,
        readOnly: false,
        pattern: "^[0-9]{10}$",
        errorMessage: "Please enter a valid 10-digit mobile number",
        placeholder: "Enter Mobile Number",
      },
      {
        label: "Enter Name of the Complainant",
        name: "complainantName4",
        type: "text",
        required: false,
        maxLength: 200,
        readOnly: false,
        placeholder: "Enter Name of the Complainant",
      },
      {
        label: "Account Type",
        name: "accountType4",
        type: "text",
        required: false,
        maxLength: 100,
        readOnly: false,
        placeholder: "Account Type",
      },
      {
        label: "Mobile Number",
        name: "mobileNumber4",
        type: "tel",
        required: false,
        maxLength: 15,
        readOnly: false,
        pattern: "^[0-9]{10}$",
        errorMessage: "Please enter a valid 10-digit mobile number",
        placeholder: "Enter Mobile Number",
      },
      {
        label: "Select Actual Complaint Date",
        name: "actualComplaintDate",
        type: "date",
        required: false,
        readOnly: false,
        placeholder: "Select Actual Complaint Date",
      },
      {
        label: "Select Actual Complaint Date",
        name: "actualComplaintDate2",
        type: "date",
        required: false,
        readOnly: false,
        placeholder: "Select Actual Complaint Date",
      },
    ],
  },
];

// Options mapping for select fields
const complaintFormOptionsMap = {
  YesNoOptions: ["Yes", "No", "Pending"],
  PersonTypeOptions: [
    { label: "Individual", value: "Individual" },
    { label: "Corporate", value: "Corporate" },
    { label: "Trust", value: "Trust" },
  ],
  AgencyOptions: ["CBI", "ED", "Police", "RBI"],
  IncidentOptions: ["Branch", "Zonal Office", "HO"],
  ZoneOptions: ["North", "South", "East", "West"],
  BranchOptions: ["Branch 1", "Branch 2"],
};

// Default form values
const complaintFormDefaults = {
  complaintNumber: "",
  fraudReported: "",
  personType: "",
  typeOfFraud: null,
  date1: null,
  date2: null,
  date3: null,
  date4: null,
  construimMBA: "",
  dateOfComplaint: null,
  firRegistered: "",
  attachment: null,
  whetherABBBFFAdviceReceived: "",
  selectAgency: "",
  dateOfRecipientComplaint: null,
  incidentOccurredAt: "",
  zoneName: "",
  branchName: "",
  branchCode: "",
  rbiReferenceNumber: "",
  amountInCrore: "",
  complaintFileWithCBI: "",
  place: "",
  date: null,
  whetherEligibleForABBBFF: "",
  whetherSameComplaintReceived: "",
  descriptionOfComplaint: "",
  complainantName1: "",
  accountType1: "",
  mobileNumber1: "",
  complainantName2: "",
  accountType2: "",
  mobileNumber2: "",
  complainantAddress: "",
  complainantName3: "",
  accountType3: "",
  mobileNumber3: "",
  complainantName4: "",
  accountType4: "",
  mobileNumber4: "",
  actualComplaintDate: null,
  actualComplaintDate2: null,
};

export function ComplaintWorkspace() {
  const { success } = useToast();

  // Form data state
  const [formData, setFormData] = useState(complaintFormDefaults);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (fieldConfig, value) => {
    if (
      fieldConfig.required &&
      (!value || (typeof value === "string" && !value.trim()))
    ) {
      return `${fieldConfig.label} is required`;
    }
    if (
      fieldConfig.pattern &&
      value &&
      !new RegExp(fieldConfig.pattern).test(value)
    ) {
      return fieldConfig.errorMessage || `Invalid ${fieldConfig.label}`;
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    complaintFormConfig.forEach((section) => {
      section.fields.forEach((field) => {
        const value = formData[field.name];
        const error = validateField(field, value);
        if (error) {
          newErrors[field.name] = error;
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("=== FORM SUBMITTED ===");
      console.log("Complete Form Data:", JSON.stringify(formData, null, 2));
      console.log("Timestamp:", new Date().toISOString());
      success("Form submitted successfully!");
    } else {
      success("Please fix the errors before submitting", "error");
    }
  };

  const handleSave = () => {
    console.log("=== SAVED AS DRAFT ===");
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    console.log("Timestamp:", new Date().toISOString());
    success("Draft saved successfully!");
  };

  const handleCancel = () => {
    console.log("=== FORM CANCELLED ===");
    console.log("Timestamp:", new Date().toISOString());
    success("Form cancelled");
  };

  const renderField = (field, index) => {
    const commonProps = {
      key: index,
      label: field.label,
      name: field.name,
      value: formData[field.name] || (field.type === "date" ? null : ""),
      onChange: (e, value) => {
        if (field.type === "date") {
          updateFormData(field.name, value);
        } else if (field.type === "file") {
          updateFormData(field.name, e.target.files[0]);
        } else {
          updateFormData(field.name, e?.target?.value || value);
        }
      },
      required: field.required,
      error: !!errors[field.name],
      helperText: errors[field.name],
      fullWidth: true,
    };

    if (field.type === "select") {
      const options = complaintFormOptionsMap[field.optionsKey] || [];
      return (
        <CustomAutocomplete
          {...commonProps}
          options={options}
          getOptionLabel={(option) =>
            typeof option === "object" ? option.label : option
          }
          isOptionEqualToValue={(option, value) =>
            typeof option === "object"
              ? option.value === value?.value
              : option === value
          }
          textField
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={field.placeholder}
              size="small"
              error={commonProps.error}
              helperText={commonProps.helperText}
            />
          )}
        />
      );
    }

    if (field.type === "date") {
      return (
        <DatePicker
          {...commonProps}
          value={commonProps.value}
          onChange={(date) => updateFormData(field.name, date)}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              sx: soft,
              placeholder: field.placeholder,
              error: commonProps.error,
              helperText: commonProps.helperText,
            },
          }}
        />
      );
    }

    if (field.type === "file") {
      return (
        <Box>
          <Typography
            sx={{
              mb: 0.75,
              fontSize: 13,
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {field.label}
            {field.required && " *"}
          </Typography>
          <Box
            sx={{
              border: `1px dashed ${boiBorder}`,
              borderRadius: "10px",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#fafcff",
              cursor: "pointer",
              "&:hover": { bgcolor: "#f0f5fa" },
            }}
            onClick={() =>
              document.getElementById(`${field.name}-input`).click()
            }
          >
            <Typography color="text.secondary">
              {formData[field.name]
                ? formData[field.name].name
                : "Upload Attachment"}
            </Typography>
            <CloudUploadIcon sx={{ color: boiBlue }} />
            <input
              id={`${field.name}-input`}
              type="file"
              hidden
              onChange={(e) => updateFormData(field.name, e.target.files[0])}
            />
          </Box>
          {errors[field.name] && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 0.5, display: "block" }}
            >
              {errors[field.name]}
            </Typography>
          )}
        </Box>
      );
    }

    if (field.type === "textarea") {
      return (
        <CustomTextField
          {...commonProps}
          multiline
          minRows={field.name === "descriptionOfComplaint" ? 3 : 2}
          placeholder={field.placeholder}
        />
      );
    }

    return (
      <CustomTextField
        {...commonProps}
        type={field.type}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        inputProps={{ maxLength: field.maxLength }}
      />
    );
  };

  const renderFieldRow = (fields, startIndex) => {
    const rows = [];
    for (let i = 0; i < fields.length; i += 3) {
      rows.push(
        <Box
          key={`row-${startIndex}-${i}`}
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
          }}
        >
          {fields.slice(i, i + 3).map((field, idx) => (
            <Box key={idx} sx={{ flex: 1 }}>
              {renderField(field, startIndex + i + idx)}
            </Box>
          ))}
          {fields.slice(i, i + 3).length < 3 &&
            [...Array(3 - fields.slice(i, i + 3).length)].map((_, idx) => (
              <Box key={`empty-${idx}`} sx={{ flex: 1 }} />
            ))}
        </Box>,
      );
    }
    return rows;
  };

  return (
    <ContentCard>
      {complaintFormConfig.map((section, sectionIndex) => (
        <Box key={sectionIndex} sx={{ mb: sectionIndex === 0 ? 2 : 3 }}>
          {/* Section Header */}
          <Typography
            sx={{
              fontWeight: 700,
              color: boiBlue,
              mb: 2,
              fontSize: "1.1rem",
              borderBottom: `3px solid ${boiBlue}`,
              pb: 0.75,
              display: "inline-block",
            }}
          >
            {section.section}
          </Typography>

          {/* Section Content */}
          {section.section === "01 Complaint Details" ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
              }}
            >
              {section.fields.map((field, idx) => (
                <Box key={idx} sx={{ flex: 1 }}>
                  {renderField(field, idx)}
                </Box>
              ))}
            </Box>
          ) : (
            <>
              {section.section !== "01 Complaint Details" && (
                <FormSectionBar title={section.section} />
              )}
              <Box
                sx={{
                  border:
                    section.section !== "01 Complaint Details"
                      ? `1px solid ${boiBorder}`
                      : "none",
                  borderTop:
                    section.section !== "01 Complaint Details"
                      ? "none"
                      : undefined,
                  borderRadius:
                    section.section !== "01 Complaint Details"
                      ? "0 0 10px 10px"
                      : undefined,
                  p: section.section !== "01 Complaint Details" ? 2 : 0,
                  mb: section.section !== "01 Complaint Details" ? 3 : 0,
                }}
              >
                {renderFieldRow(section.fields, sectionIndex * 100)}
              </Box>
            </>
          )}
        </Box>
      ))}

      {/* Action Buttons */}
      <WorkspaceActionBar
        onCancel={handleCancel}
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </ContentCard>
  );
}
