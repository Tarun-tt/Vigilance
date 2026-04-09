import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import {
  CustomAutocomplete,
  CustomTextField,
} from "../../../components/common";
import {
  complaintFormConfig,
  complaintFormOptionsMap,
  getOtherAgenciesTemplate,
  getComplainantTemplate,
  getAccountTemplate,
  getBranchTemplate,
  getZoneTemplate,
  getFGMOTemplate,
} from "./ComplaintData";
import { boiBorder } from "../../../theme/theme";

const formatDate = (value) => {
  if (!value) return null;
  if (typeof value === "object" && value?.$d)
    return value.$d.toISOString().split("T")[0];
  if (typeof value === "string") return value;
  return null;
};

const validateForm = (values) => {
  const errors = {};
  if (!values.complaintNumber) errors.complaintNumber = "Required";
  if (values.fraudReported === "Yes") {
    if (!values.complaintId) errors.complaintId = "Required";
    if (!values.personType) errors.personType = "Required";
    if (!values.typeOfFraud) errors.typeOfFraud = "Required";
    if (!values.rbiReferenceNumber) errors.rbiReferenceNumber = "Required";
    if (!values.date1) errors.date1 = "Required";
    if (!values.date2) errors.date2 = "Required";
    if (!values.amountInCrore) errors.amountInCrore = "Required";
    if (!values.consortiumMBA) errors.consortiumMBA = "Required";
    if (values.consortiumMBA === "Yes" && !values.leadBankHolder)
      errors.leadBankHolder = "Required";
    if (!values.complaintFileWithCBI) errors.complaintFileWithCBI = "Required";
    if (values.complaintFileWithCBI === "Yes") {
      if (!values.dateOfComplaint) errors.dateOfComplaint = "Required";
      if (!values.cbiBranch) errors.cbiBranch = "Required";
      if (!values.place) errors.place = "Required";
    }
    if (!values.firRegistered) errors.firRegistered = "Required";
    if (values.firRegistered === "Yes") {
      if (!values.firrcNumber) errors.firrcNumber = "Required";
      if (!values.date) errors.date = "Required";
    }
    if (!values.whetherEligibleABBBFF)
      errors.whetherEligibleABBBFF = "Required";
  }
  if (!values.complaintReceivedAt) errors.complaintReceivedAt = "Required";
  if (!values.complaintReceivedDateAtHO)
    errors.complaintReceivedDateAtHO = "Required";
  return errors;
};

export function ComplaintForm({
  mode,
  values,
  onChange,
  title,
  onSaveDraft,
  onSubmitApproval,
}) {
  const readOnly = mode === "view";
  const showAddActions = mode === "add" || mode === "update";
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = useCallback(
    (field, v) => {
      onChange({ [field]: v });
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [onChange, errors],
  );

  const markTouched = useCallback(
    (field) => setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  // Agency management functions
  const updateOtherAgency = useCallback(
    (index, field, value) => {
      const updated = [...(values.otherAgenciesList || [])];
      updated[index] = {
        ...updated[index],
        [field]: field.includes("date") ? formatDate(value) : value,
      };
      onChange({ otherAgenciesList: updated });
      const errorKey = `agency_${index}_${field}`;
      if (errors[errorKey])
        setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    },
    [values.otherAgenciesList, onChange, errors],
  );

  const addOtherAgency = useCallback(() => {
    onChange({
      otherAgenciesList: [
        ...(values.otherAgenciesList || []),
        getOtherAgenciesTemplate(),
      ],
    });
  }, [values.otherAgenciesList, onChange]);

  const removeOtherAgency = useCallback(
    (index) => {
      if ((values.otherAgenciesList || []).length > 1) {
        onChange({
          otherAgenciesList: values.otherAgenciesList.filter(
            (_, i) => i !== index,
          ),
        });
      }
    },
    [values.otherAgenciesList, onChange],
  );

  // Branch management functions
  const addBranch = useCallback(
    (agencyIndex, zoneIndex = null, fgmoIndex = null) => {
      const updated = [...(values.otherAgenciesList || [])];
      if (zoneIndex !== null && fgmoIndex !== null) {
        // Add branch under zone in FGMO
        updated[agencyIndex].fgmos[fgmoIndex].zones[zoneIndex].branches.push(
          getBranchTemplate(),
        );
      } else if (zoneIndex !== null) {
        // Add branch under zone
        updated[agencyIndex].zones[zoneIndex].branches.push(
          getBranchTemplate(),
        );
      } else {
        // Add direct branch
        updated[agencyIndex].branches.push(getBranchTemplate());
      }
      onChange({ otherAgenciesList: updated });
    },
    [values.otherAgenciesList, onChange],
  );

  const removeBranch = useCallback(
    (agencyIndex, branchIndex, zoneIndex = null, fgmoIndex = null) => {
      const updated = [...(values.otherAgenciesList || [])];
      if (zoneIndex !== null && fgmoIndex !== null) {
        if (
          updated[agencyIndex].fgmos[fgmoIndex].zones[zoneIndex].branches
            .length > 1
        ) {
          updated[agencyIndex].fgmos[fgmoIndex].zones[zoneIndex].branches =
            updated[agencyIndex].fgmos[fgmoIndex].zones[
              zoneIndex
            ].branches.filter((_, i) => i !== branchIndex);
        }
      } else if (zoneIndex !== null) {
        if (updated[agencyIndex].zones[zoneIndex].branches.length > 1) {
          updated[agencyIndex].zones[zoneIndex].branches = updated[
            agencyIndex
          ].zones[zoneIndex].branches.filter((_, i) => i !== branchIndex);
        }
      } else {
        if (updated[agencyIndex].branches.length > 1) {
          updated[agencyIndex].branches = updated[agencyIndex].branches.filter(
            (_, i) => i !== branchIndex,
          );
        }
      }
      onChange({ otherAgenciesList: updated });
    },
    [values.otherAgenciesList, onChange],
  );

  // Zone management functions
  const addZone = useCallback(
    (agencyIndex, fgmoIndex = null) => {
      const updated = [...(values.otherAgenciesList || [])];
      if (fgmoIndex !== null) {
        updated[agencyIndex].fgmos[fgmoIndex].zones.push(getZoneTemplate());
      } else {
        updated[agencyIndex].zones.push(getZoneTemplate());
      }
      onChange({ otherAgenciesList: updated });
    },
    [values.otherAgenciesList, onChange],
  );

  const removeZone = useCallback(
    (agencyIndex, zoneIndex, fgmoIndex = null) => {
      const updated = [...(values.otherAgenciesList || [])];
      if (fgmoIndex !== null) {
        if (updated[agencyIndex].fgmos[fgmoIndex].zones.length > 1) {
          updated[agencyIndex].fgmos[fgmoIndex].zones = updated[
            agencyIndex
          ].fgmos[fgmoIndex].zones.filter((_, i) => i !== zoneIndex);
        }
      } else {
        if (updated[agencyIndex].zones.length > 1) {
          updated[agencyIndex].zones = updated[agencyIndex].zones.filter(
            (_, i) => i !== zoneIndex,
          );
        }
      }
      onChange({ otherAgenciesList: updated });
    },
    [values.otherAgenciesList, onChange],
  );

  // FGMO management functions
  const addFGMO = useCallback(
    (agencyIndex) => {
      const updated = [...(values.otherAgenciesList || [])];
      updated[agencyIndex].fgmos.push(getFGMOTemplate());
      onChange({ otherAgenciesList: updated });
    },
    [values.otherAgenciesList, onChange],
  );

  const removeFGMO = useCallback(
    (agencyIndex, fgmoIndex) => {
      const updated = [...(values.otherAgenciesList || [])];
      if (updated[agencyIndex].fgmos.length > 1) {
        updated[agencyIndex].fgmos = updated[agencyIndex].fgmos.filter(
          (_, i) => i !== fgmoIndex,
        );
        onChange({ otherAgenciesList: updated });
      }
    },
    [values.otherAgenciesList, onChange],
  );

  // Complainant management
  const updateComplainant = useCallback(
    (index, field, value) => {
      const updated = [...(values.complainantsList || [])];
      updated[index] = { ...updated[index], [field]: value };
      onChange({ complainantsList: updated });
    },
    [values.complainantsList, onChange],
  );

  const addComplainant = useCallback(() => {
    onChange({
      complainantsList: [
        ...(values.complainantsList || []),
        getComplainantTemplate(),
      ],
    });
  }, [values.complainantsList, onChange]);

  const removeComplainant = useCallback(
    (index) => {
      if ((values.complainantsList || []).length > 1) {
        onChange({
          complainantsList: values.complainantsList.filter(
            (_, i) => i !== index,
          ),
        });
      }
    },
    [values.complainantsList, onChange],
  );

  const updateAccount = useCallback(
    (cIdx, aIdx, field, value) => {
      const updated = [...(values.complainantsList || [])];
      updated[cIdx].accounts[aIdx] = {
        ...updated[cIdx].accounts[aIdx],
        [field]: value,
      };
      onChange({ complainantsList: updated });
    },
    [values.complainantsList, onChange],
  );

  const addAccount = useCallback(
    (cIdx) => {
      const updated = [...(values.complainantsList || [])];
      updated[cIdx].accounts.push(getAccountTemplate());
      onChange({ complainantsList: updated });
    },
    [values.complainantsList, onChange],
  );

  const removeAccount = useCallback(
    (cIdx, aIdx) => {
      const updated = [...(values.complainantsList || [])];
      if (updated[cIdx].accounts.length > 1) {
        updated[cIdx].accounts = updated[cIdx].accounts.filter(
          (_, i) => i !== aIdx,
        );
        onChange({ complainantsList: updated });
      }
    },
    [values.complainantsList, onChange],
  );

  const handleSubmit = () => {
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    Object.keys(validationErrors).forEach((key) =>
      setTouched((prev) => ({ ...prev, [key]: true })),
    );
    if (Object.keys(validationErrors).length === 0) onSubmitApproval();
  };

  const renderField = (field) => {
    if (field.condition && !field.condition(values)) return null;
    const value = values[field.name];
    const hasError = errors[field.name] && touched[field.name];
    const isReq = field.required;

    if (field.type === "radio") {
      const options = field.options ||
        complaintFormOptionsMap[field.optionsKey] || ["Yes", "No"];
      return (
        <FormControl component="fieldset" fullWidth error={hasError}>
          <FormLabel sx={{ fontSize: 13, mb: 1, fontWeight: 500 }}>
            {field.label}
            {isReq && (
              <Typography
                component="span"
                sx={{ color: "error.main", ml: 0.5 }}
              >
                *
              </Typography>
            )}
          </FormLabel>
          <RadioGroup
            row
            value={value || ""}
            onChange={(e) => {
              set(field.name, e.target.value);
              markTouched(field.name);
            }}
            disabled={readOnly}
          >
            {options.map((opt) => (
              <FormControlLabel
                key={opt}
                value={opt}
                control={<Radio size="small" />}
                label={opt}
              />
            ))}
          </RadioGroup>
          {hasError && (
            <Typography color="error" variant="caption">
              {errors[field.name]}
            </Typography>
          )}
        </FormControl>
      );
    }

    if (field.type === "select") {
      return (
        <CustomAutocomplete
          label={field.label}
          options={complaintFormOptionsMap[field.optionsKey] || []}
          value={value || null}
          onChange={(e, v) => {
            set(field.name, v);
            markTouched(field.name);
          }}
          disabled={readOnly}
          required={isReq}
          error={hasError}
          helperText={hasError ? errors[field.name] : ""}
          fullWidth
        />
      );
    }

    if (field.type === "date") {
      return (
        <CustomTextField
          type="date"
          label={field.label}
          value={value}
          onChange={(date) => {
            set(field.name, formatDate(date));
            markTouched(field.name);
          }}
          disabled={readOnly}
          required={isReq}
          error={hasError}
          helperText={hasError ? errors[field.name] : ""}
          fullWidth
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <CustomTextField
          label={field.label}
          value={value || ""}
          onChange={(e) => {
            set(field.name, e.target.value);
            markTouched(field.name);
          }}
          disabled={readOnly}
          required={isReq}
          error={hasError}
          helperText={hasError ? errors[field.name] : ""}
          multiline
          minRows={3}
          fullWidth
        />
      );
    }

    if (field.type === "file") {
      return (
        <CustomTextField
          type="file"
          label={field.label}
          name={field.name}
          value={value}
          onChange={(file) => {
            set(field.name, file);
            markTouched(field.name);
          }}
          disabled={readOnly}
          required={isReq}
          error={hasError}
          helperText={hasError ? errors[field.name] : ""}
          fullWidth
        />
      );
    }

    return (
      <CustomTextField
        label={field.label}
        value={value || ""}
        onChange={(e) => {
          set(field.name, e.target.value);
          markTouched(field.name);
        }}
        disabled={readOnly}
        required={isReq}
        error={hasError}
        helperText={hasError ? errors[field.name] : ""}
        placeholder={field.placeholder}
        fullWidth
      />
    );
  };

  const renderRow = (fields) => {
    const rows = [];
    for (let i = 0; i < fields.length; i += 3) {
      const rowFields = fields.slice(i, i + 3);
      const rendered = rowFields
        .map((f, idx) => {
          const r = renderField(f);
          return r ? (
            <Box key={idx} sx={{ flex: 1 }}>
              {r}
            </Box>
          ) : null;
        })
        .filter(Boolean);
      if (rendered.length)
        rows.push(
          <Box key={`row-${i}`} sx={{ display: "flex", gap: 2, mb: 2 }}>
            {rendered}
            {Array(3 - rendered.length)
              .fill()
              .map((_, idx) => (
                <Box key={`e-${idx}`} sx={{ flex: 1 }} />
              ))}
          </Box>,
        );
    }
    return rows;
  };

  const renderAgencyField = (agency, idx, field) => {
    const value = agency[field.name];
    const errorKey = `agency_${idx}_${field.name}`;
    const hasError = errors[errorKey] && touched[errorKey];
    const isReq = field.required;

    if (field.type === "radio") {
      const options = complaintFormOptionsMap[field.optionsKey] || [
        "Yes",
        "No",
      ];
      return (
        <FormControl component="fieldset" fullWidth error={hasError}>
          <FormLabel sx={{ fontSize: 13, mb: 1, fontWeight: 500 }}>
            {field.label}
            {isReq && (
              <Typography
                component="span"
                sx={{ color: "error.main", ml: 0.5 }}
              >
                *
              </Typography>
            )}
          </FormLabel>
          <RadioGroup
            row
            value={value || ""}
            onChange={(e) => updateOtherAgency(idx, field.name, e.target.value)}
            disabled={readOnly}
          >
            {options.map((opt) => (
              <FormControlLabel
                key={opt}
                value={opt}
                control={<Radio size="small" />}
                label={opt}
              />
            ))}
          </RadioGroup>
          {hasError && (
            <Typography color="error" variant="caption">
              {errors[errorKey]}
            </Typography>
          )}
        </FormControl>
      );
    }
    if (field.type === "file") {
      return (
        <CustomTextField
          type="file"
          label={field.label}
          value={value}
          onChange={(f) => updateOtherAgency(idx, field.name, f)}
          disabled={readOnly}
          required={isReq}
          error={hasError}
          helperText={hasError ? errors[errorKey] : ""}
          fullWidth
        />
      );
    }
    if (field.type === "date") {
      return (
        <CustomTextField
          type="date"
          label={field.label}
          value={value}
          onChange={(d) => updateOtherAgency(idx, field.name, d)}
          disabled={readOnly}
          required={isReq}
          error={hasError}
          helperText={hasError ? errors[errorKey] : ""}
          fullWidth
        />
      );
    }
    if (field.type === "select") {
      return (
        <CustomAutocomplete
          label={field.label}
          options={complaintFormOptionsMap[field.optionsKey] || []}
          value={value || null}
          onChange={(e, v) => updateOtherAgency(idx, field.name, v)}
          disabled={readOnly}
          required={isReq}
          error={hasError}
          helperText={hasError ? errors[errorKey] : ""}
          fullWidth
        />
      );
    }
    return (
      <CustomTextField
        label={field.label}
        value={value || ""}
        onChange={(e) => updateOtherAgency(idx, field.name, e.target.value)}
        disabled={readOnly}
        required={isReq}
        error={hasError}
        helperText={hasError ? errors[errorKey] : ""}
        fullWidth
      />
    );
  };

  // Render branches in a grid (3 per row)
  const renderBranchesGrid = (
    branches,
    agencyIndex,
    onAdd,
    onRemove,
    zoneIndex = null,
    fgmoIndex = null,
  ) => {
    if (!branches || branches.length === 0) return null;

    const rows = [];
    for (let i = 0; i < branches.length; i += 3) {
      rows.push(
        <Box
          key={`branch-row-${i}`}
          sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
        >
          {branches.slice(i, i + 3).map((branch, branchIdx) => {
            const actualIdx = i + branchIdx;
            return (
              <Box
                key={branch.id}
                sx={{ flex: 1, display: "flex", gap: 1, alignItems: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <CustomAutocomplete
                    label="Branch Name"
                    options={complaintFormOptionsMap.BranchOptions}
                    value={branch.branchName || null}
                    onChange={(e, v) => {
                      const updated = [...(values.otherAgenciesList || [])];
                      if (zoneIndex !== null && fgmoIndex !== null) {
                        updated[agencyIndex].fgmos[fgmoIndex].zones[
                          zoneIndex
                        ].branches[actualIdx].branchName = v;
                      } else if (zoneIndex !== null) {
                        updated[agencyIndex].zones[zoneIndex].branches[
                          actualIdx
                        ].branchName = v;
                      } else {
                        updated[agencyIndex].branches[actualIdx].branchName = v;
                      }
                      onChange({ otherAgenciesList: updated });
                    }}
                    disabled={readOnly}
                    required
                    fullWidth
                    slotProps={{
                      textField: {
                        InputProps: {
                          endAdornment: !readOnly && (
                            <InputAdornment position="end">
                              <IconButton size="small" edge="end">
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </Box>
                {!readOnly && branches.length > 1 && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<RemoveIcon />}
                    onClick={() => onRemove(actualIdx)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "10px",
                      minWidth: "auto",
                      px: 1,
                    }}
                  ></Button>
                )}
              </Box>
            );
          })}
          {Array(3 - Math.min(3, branches.length - i))
            .fill()
            .map((_, idx) => (
              <Box key={`empty-${idx}`} sx={{ flex: 1 }} />
            ))}
        </Box>,
      );
    }
    return rows;
  };

  // Render zones with their branches
  const renderZonesWithBranches = (
    zones,
    agencyIndex,
    isUnderFGMO = false,
    fgmoIndex = null,
  ) => {
    if (!zones || zones.length === 0) return null;

    return zones.map((zone, zoneIdx) => (
      <Box
        key={zone.id}
        sx={{ mb: 2, ml: 2, borderLeft: `2px solid ${boiBorder}`, pl: 2 }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            <CustomAutocomplete
              label="Zone Name"
              options={complaintFormOptionsMap.ZoneOptions}
              value={zone.zoneName || null}
              onChange={(e, v) => {
                const updated = [...(values.otherAgenciesList || [])];
                if (isUnderFGMO && fgmoIndex !== null) {
                  updated[agencyIndex].fgmos[fgmoIndex].zones[
                    zoneIdx
                  ].zoneName = v;
                } else {
                  updated[agencyIndex].zones[zoneIdx].zoneName = v;
                }
                onChange({ otherAgenciesList: updated });
              }}
              disabled={readOnly}
              required
              fullWidth
              slotProps={{
                textField: {
                  InputProps: {
                    endAdornment: !readOnly && (
                      <InputAdornment position="end">
                        <IconButton size="small" edge="end">
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </Box>
          {!readOnly && zones.length > 1 && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<RemoveIcon />}
              onClick={() =>
                removeZone(agencyIndex, zoneIdx, isUnderFGMO ? fgmoIndex : null)
              }
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                minWidth: "auto",
                px: 1,
              }}
            >
              Remove Zone
            </Button>
          )}
          {!readOnly && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                addBranch(agencyIndex, zoneIdx, isUnderFGMO ? fgmoIndex : null)
              }
              sx={{ textTransform: "none", borderRadius: "10px" }}
            >
              Add Branch
            </Button>
          )}
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "0.8rem",
              color: "text.secondary",
              mb: 1,
            }}
          >
            Branches
          </Typography>
          {renderBranchesGrid(
            zone.branches,
            agencyIndex,
            () =>
              addBranch(agencyIndex, zoneIdx, isUnderFGMO ? fgmoIndex : null),
            (branchIdx) =>
              removeBranch(
                agencyIndex,
                branchIdx,
                zoneIdx,
                isUnderFGMO ? fgmoIndex : null,
              ),
            zoneIdx,
            isUnderFGMO ? fgmoIndex : null,
          )}
        </Box>
      </Box>
    ));
  };

  // Render FGMOs with their zones and branches
  const renderFGMOSWithDetails = (fgmos, agencyIndex) => {
    if (!fgmos || fgmos.length === 0) return null;

    return fgmos.map((fgmo, fgmoIdx) => (
      <Box
        key={fgmo.id}
        sx={{ mb: 2, borderLeft: `2px solid ${boiBorder}`, pl: 2 }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            <CustomAutocomplete
              label="FGMO Name"
              options={complaintFormOptionsMap.FGMOptions}
              value={fgmo.fgmoName || null}
              onChange={(e, v) => {
                const updated = [...(values.otherAgenciesList || [])];
                updated[agencyIndex].fgmos[fgmoIdx].fgmoName = v;
                onChange({ otherAgenciesList: updated });
              }}
              disabled={readOnly}
              required
              fullWidth
              slotProps={{
                textField: {
                  InputProps: {
                    endAdornment: !readOnly && (
                      <InputAdornment position="end">
                        <IconButton size="small" edge="end">
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </Box>
          {!readOnly && fgmos.length > 1 && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<RemoveIcon />}
              onClick={() => removeFGMO(agencyIndex, fgmoIdx)}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                minWidth: "auto",
                px: 1,
              }}
            >
              Remove FGMO
            </Button>
          )}
          {!readOnly && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addZone(agencyIndex, fgmoIdx)}
              sx={{ textTransform: "none", borderRadius: "10px" }}
            >
              Add Zone
            </Button>
          )}
        </Box>
        {renderZonesWithBranches(fgmo.zones, agencyIndex, true, fgmoIdx)}
      </Box>
    ));
  };

  const renderOtherAgenciesSection = (agency, idx) => {
    const filteredFields = complaintFormConfig.agencyFields.filter(
      (f) => !f.condition || f.condition(agency),
    );
    const rows = [];
    for (let i = 0; i < filteredFields.length; i += 3) {
      rows.push(
        <Box key={`row-${i}`} sx={{ display: "flex", gap: 2, mb: 2 }}>
          {filteredFields
            .slice(i, i + 3)
            .map((field, fidx) => renderAgencyField(agency, idx, field))}
        </Box>,
      );
    }

    return (
      <Box
        key={agency.id}
        sx={{
          border: `1px solid ${boiBorder}`,
          borderRadius: "12px",
          p: 2.5,
          mb: 3,
          bgcolor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 1.5,
            borderBottom: `1px dashed ${boiBorder}`,
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
            Agency {idx + 1}
          </Typography>
          {!readOnly && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {idx === (values.otherAgenciesList || []).length - 1 && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addOtherAgency}
                  sx={{ textTransform: "none", borderRadius: "10px" }}
                ></Button>
              )}
              {(values.otherAgenciesList || []).length > 1 && (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeOtherAgency(idx)}
                  sx={{ textTransform: "none", borderRadius: "10px" }}
                ></Button>
              )}
            </Box>
          )}
        </Box>
        {rows}

        {/* Direct Branches (when multipleBranchesUnderSameZone is Yes) */}
        {agency.multipleBranchesUnderSameZone === "Yes" && agency.branches && (
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.9rem",
                color: "primary.main",
              }}
            >
              Branches
            </Typography>
            {renderBranchesGrid(
              agency.branches,
              idx,
              () => addBranch(idx),
              (branchIdx) => removeBranch(idx, branchIdx),
            )}
            {!readOnly && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addBranch(idx)}
                sx={{ textTransform: "none", borderRadius: "10px", mt: 1 }}
              >
                Add Another Branch
              </Button>
            )}
          </Box>
        )}

        {/* Zones with Branches (when multipleZonesUnderSameFGMO is Yes) */}
        {agency.multipleZonesUnderSameFGMO === "Yes" && agency.zones && (
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.9rem",
                color: "primary.main",
              }}
            >
              Zones & Branches
            </Typography>
            {renderZonesWithBranches(agency.zones, idx, false, null)}
            {!readOnly && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addZone(idx)}
                sx={{ textTransform: "none", borderRadius: "10px", mt: 1 }}
              >
                Add Another Zone
              </Button>
            )}
          </Box>
        )}

        {/* FGMOs with Zones and Branches (when multipleFGMOS is Yes) */}
        {agency.multipleFGMOS === "Yes" && agency.fgmos && (
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.9rem",
                color: "primary.main",
              }}
            >
              FGMOs, Zones & Branches
            </Typography>
            {renderFGMOSWithDetails(agency.fgmos, idx)}
            {!readOnly && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addFGMO(idx)}
                sx={{ textTransform: "none", borderRadius: "10px", mt: 1 }}
              >
                Add Another FGMO
              </Button>
            )}
          </Box>
        )}
      </Box>
    );
  };

  const renderComplainantSection = (complainant, idx) => (
    <Box
      key={complainant.id}
      sx={{
        border: `1px solid ${boiBorder}`,
        borderRadius: "12px",
        p: 2.5,
        mb: 3,
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 1.5,
          borderBottom: `1px dashed ${boiBorder}`,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
          Complainant {idx + 1}
        </Typography>
        {!readOnly && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {idx === (values.complainantsList || []).length - 1 && (
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addComplainant}
                sx={{ textTransform: "none", borderRadius: "10px" }}
              ></Button>
            )}
            {(values.complainantsList || []).length > 1 && (
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => removeComplainant(idx)}
                sx={{ textTransform: "none", borderRadius: "10px" }}
              ></Button>
            )}
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <CustomTextField
            label="Complainant Name"
            value={complainant.complainantName}
            onChange={(e) =>
              updateComplainant(idx, "complainantName", e.target.value)
            }
            disabled={readOnly}
            fullWidth
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: 13, mb: 1 }}>Complaint Type</FormLabel>
            <RadioGroup
              row
              value={complainant.complaintType || ""}
              onChange={(e) =>
                updateComplainant(idx, "complaintType", e.target.value)
              }
            >
              {complaintFormOptionsMap.ComplaintTypeOptions.map((opt) => (
                <FormControlLabel
                  key={opt}
                  value={opt}
                  control={<Radio size="small" />}
                  label={opt}
                  disabled={readOnly}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }} />
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "primary.main",
          mb: 1.5,
        }}
      >
        Account Details
      </Typography>
      {complainant.accounts.map((account, aIdx) => (
        <Box
          key={account.id}
          sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-start" }}
        >
          <Box sx={{ flex: 1 }}>
            <CustomTextField
              label="Account Name"
              value={account.accountName}
              onChange={(e) =>
                updateAccount(idx, aIdx, "accountName", e.target.value)
              }
              disabled={readOnly}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <CustomAutocomplete
              label="Account Type"
              options={complaintFormOptionsMap.AccountTypeOptions}
              value={account.accountType || null}
              onChange={(e, v) => updateAccount(idx, aIdx, "accountType", v)}
              disabled={readOnly}
              fullWidth
            />
          </Box>
          {!readOnly && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
              {aIdx === complainant.accounts.length - 1 && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => addAccount(idx)}
                  sx={{ textTransform: "none", borderRadius: "10px" }}
                ></Button>
              )}
              {complainant.accounts.length > 1 && aIdx > 0 && (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<RemoveIcon />}
                  onClick={() => removeAccount(idx, aIdx)}
                  sx={{ textTransform: "none", borderRadius: "10px" }}
                ></Button>
              )}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );

  const complaintDetails = complaintFormConfig.sections.find(
    (s) => s.id === "complaintDetails",
  );
  const fraudDetails = complaintFormConfig.sections.find(
    (s) => s.id === "fraudDetails",
  );
  const complaintReceived = complaintFormConfig.sections.find(
    (s) => s.id === "complaintReceived",
  );
  const approval = complaintFormConfig.sections.find(
    (s) => s.id === "doCheckerApproval",
  );
  const showFraud = fraudDetails?.condition?.(values) ?? false;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "16px",
        border: `1px solid ${boiBorder}`,
        bgcolor: "#fafcff",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: 700, color: "primary.main" }}
      >
        Bank of India
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ mb: 3, color: "text.secondary" }}
      >
        Complaint Management System
      </Typography>
      <Typography
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 2,
          borderLeft: "4px solid primary.main",
          pl: 2,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 2,
          borderLeft: "3px solid primary.main",
          pl: 1.5,
        }}
      >
        {complaintDetails.title}
      </Typography>
      <Box sx={{ mb: 3 }}>{renderRow(complaintDetails.fields)}</Box>

      {showFraud && (
        <>
          <Typography
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 2,
              mt: 3,
              borderLeft: "3px solid primary.main",
              pl: 1.5,
            }}
          >
            {fraudDetails.title}
          </Typography>
          <Box
            sx={{
              border: `1px solid ${boiBorder}`,
              borderRadius: "12px",
              p: 2.5,
              mb: 3,
              bgcolor: "#fff",
            }}
          >
            {renderRow(fraudDetails.fields)}
          </Box>
        </>
      )}

      {values.whetherSameComplaintReceived === "Yes" && (
        <>
          <Typography
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 2,
              borderLeft: "3px solid primary.main",
              pl: 1.5,
            }}
          >
            Other Agencies
          </Typography>
          <Box sx={{ mb: 3 }}>
            {(values.otherAgenciesList || []).map((a, i) =>
              renderOtherAgenciesSection(a, i),
            )}
          </Box>
        </>
      )}

      <Typography
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 2,
          borderLeft: "3px solid primary.main",
          pl: 1.5,
        }}
      >
        Complainant Details
      </Typography>
      <Box sx={{ mb: 3 }}>
        {(values.complainantsList || []).map((c, i) =>
          renderComplainantSection(c, i),
        )}
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 2,
          borderLeft: "3px solid primary.main",
          pl: 1.5,
        }}
      >
        {complaintReceived.title}
      </Typography>
      <Box
        sx={{
          border: `1px solid ${boiBorder}`,
          borderRadius: "12px",
          p: 2.5,
          mb: 3,
          bgcolor: "#fff",
        }}
      >
        {renderRow(complaintReceived.fields)}
      </Box>

      {(mode === "view" || mode === "approval") && (
        <>
          <Typography
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 2,
              borderLeft: "3px solid primary.main",
              pl: 1.5,
            }}
          >
            {approval.title}
          </Typography>
          <Box
            sx={{
              border: `1px solid ${boiBorder}`,
              borderRadius: "12px",
              p: 2.5,
              mb: 3,
              bgcolor: "#fff",
            }}
          >
            {renderRow(approval.fields)}
          </Box>
        </>
      )}

      {showAddActions && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, pt: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onSaveDraft}
            sx={{ textTransform: "none", borderRadius: "10px", px: 4 }}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              px: 4,
              bgcolor: "secondary.main",
            }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Paper>
  );
}
