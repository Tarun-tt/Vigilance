import { useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PrintIcon from "@mui/icons-material/Print";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { CustomAutocomplete, CustomTextField } from "../../components/common";
import { vettingFormConfig } from "./VettingData";
import { boiBlue, boiBorder, boiTableHeaderBg } from "../../theme/theme";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DATE_FORMAT = "DD/MM/YYYY";

const labelCell = {
  width: "28%",
  bgcolor: boiTableHeaderBg,
  fontWeight: 600,
  fontSize: 13,
  borderColor: boiBorder,
  verticalAlign: "top",
  padding: "10px 12px",
};

const valueCell = {
  borderColor: boiBorder,
  p: 0,
  padding: 0,
};

const valueTextView = {
  borderColor: boiBorder,
  padding: "10px 12px",
  fontSize: 13,
  verticalAlign: "top",
};

const yesNoOptions = ["Yes", "No", "Pending"];

const toDayjs = (value) => {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  const parsed = dayjs(value, DATE_FORMAT);
  if (parsed.isValid()) return parsed;
  return dayjs(value);
};

const formatDate = (value) => {
  if (!value) return "";
  return dayjs(value).format(DATE_FORMAT);
};

export function VettingForm({
  mode,
  values,
  onChange,
  title,
  onSaveDraft,
  onSubmitVetting,
  onFinalSubmit,
  onPrint,
}) {
  const printRef = useRef();
  const readOnly = mode === "view";
  const showViewActions = mode === "view";
  const showAddActions = mode === "add" || mode === "update";

  const set = (field, v) => onChange({ [field]: v });

  const renderFieldValue = (fieldConfig, value) => {
    if (fieldConfig.type === "textarea") {
      return (
        <Typography sx={{ whiteSpace: "pre-wrap", p: 1.5, fontSize: 13 }}>
          {value || "-"}
        </Typography>
      );
    }

    if (fieldConfig.type === "date") {
      return (
        <Typography sx={{ p: 1.5, fontSize: 13 }}>
          {formatDate(value) || "-"}
        </Typography>
      );
    }

    return (
      <Typography sx={{ p: 1.5, fontSize: 13 }}>{value || "-"}</Typography>
    );
  };

  const renderField = (fieldConfig, value, onChangeHandler, readOnlyFlag) => {
    if (readOnlyFlag) {
      return renderFieldValue(fieldConfig, value);
    }

    if (fieldConfig.type === "textarea") {
      return (
        <CustomTextField
          cellVariant
          multiline
          minRows={fieldConfig.multiline ? 2 : 4}
          value={value || ""}
          onChange={(e) => onChangeHandler(e.target.value)}
          readOnly={readOnlyFlag}
          disabled={readOnlyFlag}
        />
      );
    }

    if (fieldConfig.type === "date") {
      return (
        <DatePicker
          value={toDayjs(value)}
          onChange={(date) =>
            onChangeHandler(date ? date.format("YYYY-MM-DD") : "")
          }
          disabled={readOnlyFlag}
          format={DATE_FORMAT}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              variant: "outlined",
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  bgcolor: "background.paper",
                  "& fieldset": { border: "none" },
                },
              },
            },
          }}
        />
      );
    }

    if (fieldConfig.type === "radio") {
      return (
        <CustomTextField
          type="radio"
          label={fieldConfig.label}
          options={fieldConfig.options || ["Yes", "No"]}
          value={value || ""}
          onChange={onChangeHandler}
          disabled={readOnlyFlag}
        />
      );
    }

    return (
      <CustomTextField
        cellVariant
        value={value || ""}
        onChange={(e) => onChangeHandler(e.target.value)}
        readOnly={readOnlyFlag}
        disabled={readOnlyFlag}
        placeholder={fieldConfig.placeholder}
        type={fieldConfig.type === "number" ? "number" : "text"}
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
              <TableCell sx={readOnly ? valueTextView : valueCell}>
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
    if (section.id === "complainantDetails") {
      return (
        <Table size="small" sx={{ border: `1px solid ${boiBorder}`, mb: 2 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={labelCell}>Name of Complainant/ Account</TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell} colSpan={3}>
                {readOnly ? (
                  <Typography sx={{ p: 1.5, fontSize: 13 }}>
                    {values.complainantName || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    value={values.complainantName || ""}
                    onChange={(e) => set("complainantName", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={labelCell}>Address</TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell} rowSpan={2}>
                {readOnly ? (
                  <Typography
                    sx={{ whiteSpace: "pre-wrap", p: 1.5, fontSize: 13 }}
                  >
                    {values.address || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    multiline
                    minRows={3}
                    value={values.address || ""}
                    onChange={(e) => set("address", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                    sx={{ height: "100%" }}
                  />
                )}
              </TableCell>
              <TableCell sx={labelCell}>State</TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell}>
                {readOnly ? (
                  <Typography sx={{ p: 1.5, fontSize: 13 }}>
                    {values.state || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    value={values.state || ""}
                    onChange={(e) => set("state", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={labelCell}></TableCell>
              <TableCell sx={labelCell}>Pin</TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell}>
                {readOnly ? (
                  <Typography sx={{ p: 1.5, fontSize: 13 }}>
                    {values.pin || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    value={values.pin || ""}
                    onChange={(e) => set("pin", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={labelCell}>Email</TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell} colSpan={1}>
                {readOnly ? (
                  <Typography sx={{ p: 1.5, fontSize: 13 }}>
                    {values.email || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    value={values.email || ""}
                    onChange={(e) => set("email", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                )}
              </TableCell>
              <TableCell sx={labelCell} colSpan={1}>
                Mobile No.
              </TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell} colSpan={1}>
                {readOnly ? (
                  <Typography sx={{ p: 1.5, fontSize: 13 }}>
                    {values.mobile || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    value={values.mobile || ""}
                    onChange={(e) => set("mobile", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={labelCell}>Amount Involved</TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell} colSpan={1}>
                {readOnly ? (
                  <Typography sx={{ p: 1.5, fontSize: 13 }}>
                    {values.amountInvolved || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    value={values.amountInvolved || ""}
                    onChange={(e) => set("amountInvolved", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                )}
              </TableCell>
              <TableCell sx={labelCell} colSpan={1}>
                Probable Loss
              </TableCell>
              <TableCell sx={readOnly ? valueTextView : valueCell} colSpan={1}>
                {readOnly ? (
                  <Typography sx={{ p: 1.5, fontSize: 13 }}>
                    {values.probableLoss || "-"}
                  </Typography>
                ) : (
                  <CustomTextField
                    cellVariant
                    value={values.probableLoss || ""}
                    onChange={(e) => set("probableLoss", e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }

    return (
      <Table size="small" sx={{ border: `1px solid ${boiBorder}`, mb: 2 }}>
        <TableBody>
          {section.layout.map((field, idx) => {
            if (field.type === "compound") {
              return (
                <TableRow key={field.name}>
                  <TableCell sx={labelCell}>{field.label}</TableCell>
                  <TableCell
                    sx={readOnly ? valueTextView : valueCell}
                    colSpan={field.colSpan || 3}
                  >
                    {readOnly ? (
                      <Box sx={{ display: "flex", gap: 2, p: 1.5 }}>
                        <Typography sx={{ fontSize: 13 }}>
                          Name: {values[field.fields[0]?.name] || "-"}
                        </Typography>
                        <Typography sx={{ fontSize: 13 }}>
                          PF No: {values[field.fields[1]?.name] || "-"}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {field.fields.map((subField) => (
                          <CustomTextField
                            key={subField.name}
                            cellVariant
                            placeholder={subField.placeholder}
                            value={values[subField.name] || ""}
                            onChange={(e) => set(subField.name, e.target.value)}
                            readOnly={readOnly}
                            disabled={readOnly}
                            type={
                              subField.type === "number" ? "number" : "text"
                            }
                          />
                        ))}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={field.name}>
                <TableCell sx={labelCell}>{field.label}</TableCell>
                <TableCell
                  sx={readOnly ? valueTextView : valueCell}
                  colSpan={field.colSpan || (field.label === "Name" ? 3 : 1)}
                >
                  {readOnly ? (
                    field.type === "textarea" ? (
                      <Typography
                        sx={{ whiteSpace: "pre-wrap", p: 1.5, fontSize: 13 }}
                      >
                        {values[field.name] || "-"}
                      </Typography>
                    ) : field.type === "date" ? (
                      <Typography sx={{ p: 1.5, fontSize: 13 }}>
                        {formatDate(values[field.name]) || "-"}
                      </Typography>
                    ) : (
                      <Typography sx={{ p: 1.5, fontSize: 13 }}>
                        {values[field.name] || "-"}
                      </Typography>
                    )
                  ) : (
                    <>
                      {field.type === "radio" ? (
                        <CustomTextField
                          type="radio"
                          label={field.label}
                          options={field.options || ["Yes", "No", "Pending"]}
                          value={values[field.name] || ""}
                          onChange={(v) => set(field.name, v)}
                          disabled={readOnly}
                        />
                      ) : field.type === "textarea" ? (
                        <CustomTextField
                          cellVariant
                          multiline
                          minRows={field.multiline ? 2 : 3}
                          value={values[field.name] || ""}
                          onChange={(e) => set(field.name, e.target.value)}
                          readOnly={readOnly}
                          disabled={readOnly}
                        />
                      ) : field.type === "date" ? (
                        <DatePicker
                          value={toDayjs(values[field.name])}
                          onChange={(date) =>
                            set(
                              field.name,
                              date ? date.format("YYYY-MM-DD") : "",
                            )
                          }
                          disabled={readOnly}
                          format={DATE_FORMAT}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 0,
                                  bgcolor: "background.paper",
                                  "& fieldset": { border: "none" },
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <CustomTextField
                          cellVariant
                          value={values[field.name] || ""}
                          onChange={(e) => set(field.name, e.target.value)}
                          readOnly={readOnly}
                          disabled={readOnly}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  const renderDynamicTableSection = (section) => {
    const updateScopeRow = (index, field, value) => {
      const newRows = [...(values.scopeRows || [])];
      newRows[index] = { ...newRows[index], [field]: value };
      onChange({ scopeRows: newRows });
    };

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
                  width: field.width || "auto",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                {field.label}
              </TableCell>
            ))}
          </TableRow>
          {values.scopeRows &&
            values.scopeRows.map((row, i) => (
              <TableRow key={row.sno}>
                <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                  {readOnly ? (
                    <Typography sx={{ textAlign: "center", fontSize: 13 }}>
                      {row.sno || "-"}
                    </Typography>
                  ) : (
                    <CustomTextField
                      cellVariant
                      value={row.sno}
                      onChange={(e) => updateScopeRow(i, "sno", e.target.value)}
                      readOnly={readOnly}
                      disabled={readOnly}
                      type="number"
                    />
                  )}
                </TableCell>
                <TableCell sx={readOnly ? valueTextView : valueCell}>
                  {readOnly ? (
                    <Typography
                      sx={{ whiteSpace: "pre-wrap", p: 1.5, fontSize: 13 }}
                    >
                      {row.particulars || "-"}
                    </Typography>
                  ) : (
                    <CustomTextField
                      cellVariant
                      multiline
                      value={row.particulars}
                      onChange={(e) =>
                        updateScopeRow(i, "particulars", e.target.value)
                      }
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  };

  const renderTextareaSection = (section) => {
    if (readOnly) {
      return (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "#fafafa",
            border: `1px solid ${boiBorder}`,
          }}
        >
          <Typography sx={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
            {values[section.name] || "-"}
          </Typography>
        </Paper>
      );
    }

    return (
      <CustomTextField
        multiline
        minRows={4}
        fullWidth
        value={values[section.name] || ""}
        onChange={(e) => set(section.name, e.target.value)}
        readOnly={readOnly}
        disabled={readOnly}
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

  const handlePrint = async () => {
    const element = printRef.current;
    if (!element) return;

    // Store original visibility of elements to hide
    const originalDisplay = {};
    const elementsToHide = element.querySelectorAll(".print-hide");

    elementsToHide.forEach((el) => {
      originalDisplay[el] = el.style.display;
      el.style.display = "none";
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.height;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.height;
      }
      pdf.save(`Vetting_Form_${values.refNo || "document"}.pdf`);
      //   window.print();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Restore original visibility
      elementsToHide.forEach((el) => {
        el.style.display = originalDisplay[el];
      });
    }
  };

  return (
    <Box>
      <Box ref={printRef}>
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
              {readOnly ? (
                <Typography sx={{ fontSize: 13 }}>
                  {values.refNo || "-"}
                </Typography>
              ) : (
                <CustomTextField
                  size="small"
                  value={values.refNo}
                  onChange={(e) => set("refNo", e.target.value)}
                  readOnly={readOnly}
                  disabled={readOnly}
                  sx={{ width: 200 }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">Date:</Typography>
              {readOnly ? (
                <Typography sx={{ fontSize: 13 }}>
                  {formatDate(values.date) || "-"}
                </Typography>
              ) : (
                <DatePicker
                  label=""
                  value={toDayjs(values.date)}
                  onChange={(d) => set("date", d ? d.format("YYYY-MM-DD") : "")}
                  disabled={readOnly}
                  format={DATE_FORMAT}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { width: 160 },
                    },
                  }}
                />
              )}
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
            Vetting for detailed Vigilance Investigation
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 1, color: boiBlue }}
          >
            {title}
          </Typography>

          {vettingFormConfig.sections.map((section) => (
            <Box key={section.id}>
              <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: 14 }}>
                {section.title}
              </Typography>
              {renderSection(section)}
            </Box>
          ))}

          {/* Generation of Complaint Number section - Original UI preserved */}
          {showViewActions && (
            <Paper
              variant="outlined"
              className="print-hide"
              sx={{
                p: 2,
                bgcolor: "rgba(0, 86, 150, 0.06)",
                borderColor: boiBlue,
                mb: 2,
                mt: 2,
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
                  //   onClick={handlePrint}
                  sx={{ flex: 1 }}
                >
                  Print Vetting Form
                </Button>

                <Box sx={{ flex: 1 }}>
                  <CustomAutocomplete
                    options={yesNoOptions}
                    value={values.isFormApproved || null}
                    onChange={(_, v) => onChange({ isFormApproved: v ?? "" })}
                    label="Is Form Approved?"
                    // readOnly={readOnly}
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
                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="Date of Vetting"
                    value={toDayjs(values.dateOfVetting)}
                    onChange={(date) =>
                      onChange({
                        dateOfVetting: date ? date.format("YYYY-MM-DD") : "",
                      })
                    }
                    // disabled={readOnly}
                    format={DATE_FORMAT}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <CustomTextField
                    type="file"
                    label="Attach Document"
                    size="small"
                    value={values.attachDocument}
                    onChange={(file) =>
                      onChange({
                        attachDocument: file,
                      })
                    }
                    // disabled={readOnly}
                    name="attachDocument"
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onFinalSubmit}
                >
                  Final Submit
                </Button>
              </Box>
            </Paper>
          )}

          {showAddActions && (
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, pt: 2 }}
            >
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
                onClick={onSubmitVetting}
              >
                Submit to vetting
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
