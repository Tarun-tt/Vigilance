import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PrintIcon from "@mui/icons-material/Print";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { CustomAutocomplete, CustomTextField } from "../../components/common";
import { VETTING_CHECKLIST_SECTIONS } from "./VettingData";
import { commonBlue, commonBorder, commonOrange } from "../../theme/theme";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const documentBorder = "#1c1c1c";
const vettingOptions = ["Yes", "No", "Pending"];

const pagePaperSx = {
  width: "100%",
  maxWidth: 820,
  mx: "auto",
  p: { xs: 2, sm: 4.5 },
  borderRadius: 0,
  border: "1px solid #cfcfcf",
  boxShadow: "none",
  display: "flex",
  flexDirection: "column",
  minHeight: "1120px",
  bgcolor: "#fff",
};

const tableSx = {
  tableLayout: "fixed",
  borderCollapse: "collapse",
  width: "100%",
  "& td": {
    border: `1px solid ${documentBorder}`,
    fontSize: 12,
    lineHeight: 1.25,
    color: "#111",
    verticalAlign: "top",
    p: 0,
  },
};

const bodyCellSx = {
  fontSize: 12,
  lineHeight: 1.25,
  color: "#111",
  verticalAlign: "top",
  p: 0,
};

const sectionHeadingSx = {
  fontSize: 12.5,
  fontWeight: 700,
  textDecoration: "underline",
  mb: 0.5,
};

function MemoField({
  value,
  onChange,
  readOnly,
  multiline = false,
  minRows = 1,
  align = "left",
  placeholder,
  sx,
}) {
  return (
    <Box
      sx={{
        minHeight: multiline ? minRows * 20 : 22,
        px: 0.75,
        py: multiline ? 0.5 : 0.3,
        display: "flex",
        alignItems: multiline ? "stretch" : "center",
        ...sx,
      }}
    >
      {readOnly ? (
        <Typography
          sx={{
            width: "100%",
            fontSize: 12,
            lineHeight: 1.35,
            whiteSpace: multiline ? "pre-wrap" : "normal",
            textAlign: align,
          }}
        >
          {value || "\u00a0"}
        </Typography>
      ) : (
        <InputBase
          multiline={multiline}
          minRows={multiline ? minRows : undefined}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          sx={{
            width: "100%",
            fontSize: 12,
            lineHeight: 1.35,
            alignItems: multiline ? "flex-start" : "center",
            "& input, & textarea": {
              padding: 0,
              font: "inherit",
              lineHeight: "inherit",
              textAlign: align,
            },
          }}
        />
      )}
    </Box>
  );
}

function InlineBlank({
  value,
  onChange,
  readOnly,
  width = 120,
  placeholder,
  align = "center",
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        width,
        minHeight: 18,
        borderBottom: `1px solid ${documentBorder}`,
        mx: 0.35,
        verticalAlign: "baseline",
      }}
    >
      {readOnly ? (
        <Typography
          component="span"
          sx={{
            width: "100%",
            px: 0.5,
            fontSize: 12,
            lineHeight: 1.55,
            textAlign: align,
          }}
        >
          {value || "\u00a0"}
        </Typography>
      ) : (
        <Box
          component="input"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          sx={{
            width: "100%",
            fontSize: 12,
            lineHeight: 1.55,
            px: 0.5,
            py: 0,
            border: 0,
            outline: 0,
            bgcolor: "transparent",
            font: "inherit",
            textAlign: align,
          }}
        />
      )}
    </Box>
  );
}

function parseDateValue(value) {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;

  const formats = ["DD.MM.YYYY", "DD-MM-YYYY", "YYYY-MM-DD"];
  for (const format of formats) {
    const parsed = dayjs(value, format, true);
    if (parsed.isValid()) {
      return parsed;
    }
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

function MemoDateField({
  value,
  onChange,
  readOnly,
  format = "DD.MM.YYYY",
  width,
  inline = false,
  formField = false,
  label,
  placeholder,
  align = "center",
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const renderedField = readOnly ? (
    <Typography
      component="div"
      sx={{
        width: "100%",
        px: inline ? 0.5 : 0.75,
        py: inline ? 0 : 0.3,
        fontSize: 12,
        lineHeight: inline ? 1.55 : 1.35,
        textAlign: align,
      }}
    >
      {value || "\u00a0"}
    </Typography>
  ) : (
    <Box ref={anchorRef} sx={{ width: "100%" }}>
      {inline ? (
        <Box
          component="input"
          value={value || ""}
          onClick={() => setOpen(true)}
          readOnly
          placeholder=""
          sx={{
            width: "100%",
            fontSize: 12,
            lineHeight: 1.55,
            px: 0.5,
            py: 0,
            border: 0,
            outline: 0,
            bgcolor: "transparent",
            font: "inherit",
            textAlign: align,
            cursor: "pointer",
          }}
        />
      ) : formField ? (
        <TextField
          label={label}
          fullWidth
          size="small"
          value={value || ""}
          onClick={() => setOpen(true)}
          inputProps={{ readOnly: true, placeholder: "" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#fff",
            },
            "& .MuiInputBase-input": {
              cursor: "pointer",
            },
          }}
        />
      ) : (
        <InputBase
          value={value || ""}
          onClick={() => setOpen(true)}
          readOnly
          placeholder=""
          sx={{
            width: "100%",
            px: 0.75,
            py: 0.3,
            minHeight: 22,
            fontSize: 12,
            lineHeight: 1.35,
            "& input": {
              p: 0,
              font: "inherit",
              lineHeight: "inherit",
              textAlign: align,
              cursor: "pointer",
            },
          }}
        />
      )}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: inline ? "center" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: inline ? "center" : "left",
        }}
      >
        <DateCalendar
          value={parseDateValue(value)}
          onChange={(newValue) => {
            onChange(
              newValue && dayjs(newValue).isValid()
                ? dayjs(newValue).format(format)
                : "",
            );
            setOpen(false);
          }}
        />
      </Popover>
    </Box>
  );

  if (inline) {
    return (
      <Box
        sx={{
          display: "inline-flex",
          width,
          minHeight: 18,
          borderBottom: `1px solid ${documentBorder}`,
          mx: 0.35,
          verticalAlign: "baseline",
        }}
      >
        {renderedField}
      </Box>
    );
  }

  return renderedField;
}

function MemoChoiceField({ value, onChange, readOnly, options = ["Yes", "No"] }) {
  return readOnly ? (
    <Typography
      sx={{
        width: "100%",
        px: 0.75,
        py: 0.3,
        fontSize: 12,
        lineHeight: 1.35,
        textAlign: "center",
      }}
    >
      {value || "\u00a0"}
    </Typography>
  ) : (
    <Autocomplete
      options={options}
      value={options.includes(value) ? value : null}
      onChange={(_, newValue) => onChange(newValue ?? "")}
      openOnFocus
      popupIcon={null}
      clearIcon={null}
      forcePopupIcon={false}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder=""
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
          }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              px: 0.75,
              py: 0.3,
              minHeight: 22,
            },
            "& .MuiInput-root:before, & .MuiInput-root:after": {
              borderBottom: "none !important",
            },
            "& .MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "none !important",
            },
            "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              p: 0,
              fontSize: 12,
              lineHeight: 1.35,
              textAlign: "center",
              cursor: "pointer",
            },
            "& .MuiAutocomplete-endAdornment": {
              display: "none",
            },
          }}
        />
      )}
    />
  );
}

function MemoLogo() {
  return (
    <Box sx={{ textAlign: "center", mb: 1.25 }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              color: commonBlue,
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            बैंक ऑफ इंडिया
          </Typography>
          <Typography
            sx={{
              color: commonBlue,
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Bank of India
          </Typography>
        </Box>
        <Typography
          sx={{
            color: commonBlue,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          BOI
        </Typography>
        <Typography sx={{ color: commonOrange, fontSize: 34, lineHeight: 1 }}>
          ★
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 800,
          color: "#202020",
          lineHeight: 1.2,
        }}
      >
        VIGILANCE DEPARTMENT
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
        HEAD OFFICE
      </Typography>
    </Box>
  );
}

function Footer({ page }) {
  return (
    <Box
      sx={{
        mt: 2.5,
        pt: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: 10 }}>
        Classification: <Box component="span" sx={{ color: commonBlue }}>Internal</Box>
      </Typography>
      <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{page}</Typography>
    </Box>
  );
}

function SectionHeading({ children, sx }) {
  return <Typography sx={{ ...sectionHeadingSx, ...sx }}>{children}</Typography>;
}

export function VettingForm({
  mode,
  values,
  onChange,
  onSaveDraft,
  onSubmitVetting,
  onFinalSubmit,
}) {
  const printRef = useRef();
  const readOnly = mode === "view";
  const showViewActions = mode === "view";
  const showEditActions = mode === "add" || mode === "update";

  const set = (field, value) => onChange({ [field]: value });

  const updateRow = (collection, index, field, value) => {
    const nextRows = [...(values[collection] || [])];
    nextRows[index] = { ...nextRows[index], [field]: value };
    onChange({ [collection]: nextRows });
  };

  const updateChecklistResponse = (field, value) => {
    onChange({
      checklistResponses: {
        ...(values.checklistResponses || {}),
        [field]: value,
      },
    });
  };

  const handlePrintDocument = async () => {
    const element = printRef.current;
    if (!element) return;

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
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imageHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imageHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Vetting_Report_${values.refNo || "document"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const renderChecklistRows = (sections) =>
    sections.flatMap((section) =>
      section.items.map((item, index) => (
        <TableRow key={item.field}>
          {index === 0 && (
            <TableCell
              rowSpan={section.items.length}
              sx={{
                ...bodyCellSx,
                width: "6.5%",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              <Box sx={{ px: 0.5, py: 0.3 }}>{section.number}</Box>
            </TableCell>
          )}
          {section.title ? (
            <>
              {index === 0 && (
                <TableCell
                  rowSpan={section.items.length}
                  sx={{ ...bodyCellSx, width: "18%", fontWeight: 600 }}
                >
                  <Box sx={{ px: 0.75, py: 0.3 }}>{section.title}</Box>
                </TableCell>
              )}
              <TableCell sx={{ ...bodyCellSx, width: "59%" }}>
                <Box sx={{ px: 0.75, py: 0.3 }}>{item.label}</Box>
              </TableCell>
            </>
          ) : (
            <TableCell sx={{ ...bodyCellSx, width: "77.5%" }} colSpan={2}>
              <Box sx={{ px: 0.75, py: 0.3 }}>{item.label}</Box>
            </TableCell>
          )}
          <TableCell sx={{ ...bodyCellSx, width: "16.5%" }}>
            <MemoChoiceField
              value={values.checklistResponses?.[item.field]}
              onChange={(value) => updateChecklistResponse(item.field, value)}
              readOnly={readOnly}
            />
          </TableCell>
        </TableRow>
      )),
    );

  return (
    <Box>
      <Box ref={printRef} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Paper elevation={0} sx={pagePaperSx}>
          <MemoLogo />

          <Box
            sx={{
              borderTop: `1px solid ${documentBorder}`,
              borderBottom: `1px solid ${documentBorder}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              py: 0.35,
              mb: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: 12 }}>Ref No-</Typography>
              <InlineBlank
                value={values.refNo}
                onChange={(value) => set("refNo", value)}
                readOnly={readOnly}
                width={260}
                align="left"
                placeholder="HO/VIG/Case file No/yyyy-yy/Serial no"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: 12 }}>Date :</Typography>
              <MemoDateField
                value={values.date}
                onChange={(value) => set("date", value)}
                readOnly={readOnly}
                inline
                width={110}
                format="DD.MM.YYYY"
                placeholder="dd.mm.yyyy"
              />
            </Box>
          </Box>

          <Typography
            align="center"
            sx={{
              fontSize: 14,
              fontWeight: 800,
              textDecoration: "underline",
              mb: 1.75,
            }}
          >
            MEMORANDUM FOR VETTING OF INVESTIGATION REPORT
          </Typography>

          <Table size="small" sx={tableSx}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ ...bodyCellSx, width: "47%" }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Branch / Zone</Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <MemoField
                    value={values.branchZone}
                    onChange={(value) => set("branchZone", value)}
                    readOnly={readOnly}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Case No.</Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <MemoField
                    value={values.caseNo}
                    onChange={(value) => set("caseNo", value)}
                    readOnly={readOnly}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Account / Incident</Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <MemoField
                    value={values.accountIncident}
                    onChange={(value) => set("accountIncident", value)}
                    readOnly={readOnly}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography sx={{ fontSize: 12.5, mt: 1.75, mb: 0.4 }}>Flow Chart</Typography>

          <Table size="small" sx={tableSx}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ ...bodyCellSx, width: "55%" }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>
                    Date of Incident/ receipt of complaint
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <MemoDateField
                    value={values.dateOfIncident}
                    onChange={(value) => set("dateOfIncident", value)}
                    readOnly={readOnly}
                    format="DD.MM.YYYY"
                    placeholder="dd.mm.yyyy"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Date of Investigation Order</Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <MemoDateField
                    value={values.dateOfInvestigationOrder}
                    onChange={(value) => set("dateOfInvestigationOrder", value)}
                    readOnly={readOnly}
                    format="DD.MM.YYYY"
                    placeholder="dd.mm.yyyy"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>
                    Date of allotment of Investigation
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <MemoDateField
                    value={values.dateOfAllotmentInvestigation}
                    onChange={(value) =>
                      set("dateOfAllotmentInvestigation", value)
                    }
                    readOnly={readOnly}
                    format="DD.MM.YYYY"
                    placeholder="dd.mm.yyyy"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Date of Submission of report</Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <MemoDateField
                    value={values.dateOfSubmissionReport}
                    onChange={(value) => set("dateOfSubmissionReport", value)}
                    readOnly={readOnly}
                    format="DD.MM.YYYY"
                    placeholder="dd.mm.yyyy"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <SectionHeading sx={{ mt: 1.75 }}>Present Reference</SectionHeading>
          <Typography component="div" sx={{ fontSize: 12, lineHeight: 1.45 }}>
            We request reference to memo no- HO/VIG/Vetting/2023-24/
            <InlineBlank
              value={values.presentReferenceMemoNo}
              onChange={(value) => set("presentReferenceMemoNo", value)}
              readOnly={readOnly}
              width={86}
            />
            dated
            <MemoDateField
              value={values.presentReferenceDate}
              onChange={(value) => set("presentReferenceDate", value)}
              readOnly={readOnly}
              inline
              width={94}
              format="DD-MM-YYYY"
              placeholder="dd-mm-yyyy"
            />
            where formation of Vetting Committee was approved by competent
            authority and it was advised that Investigation Report will be vetted
            before submission to Controlling Authority for further action.
          </Typography>

          <SectionHeading sx={{ mt: 1.6 }}>Background of the Case</SectionHeading>
          <Typography sx={{ fontSize: 12, lineHeight: 1.45, fontStyle: "italic" }}>
            Details of origin of matter/ Approval of Investigation/ allotment of
            Investigation/ Submission of Report will be mentioned here.
          </Typography>

          <SectionHeading sx={{ mt: 1.6 }}>
            Observation on Investigation Report
          </SectionHeading>
          <Typography sx={{ fontSize: 12, lineHeight: 1.45, fontStyle: "italic" }}>
            Observation of investigation report by Desk officer such as whether
            Investigation report is in prescribed format, Coverage of Scope,
            Checking of availability of supporting documents related to
            allegations/findings etc. will be mentioned here.
          </Typography>

          <SectionHeading sx={{ mt: 1.6 }}>
            Officials against whom lapses are attributable with details:
          </SectionHeading>
          <Table size="small" sx={tableSx}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ ...bodyCellSx, width: "10%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>S. No.</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, width: "32%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>
                    Name of erring Official, PF No. &amp; Designation
                  </Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, width: "17%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Stage</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Lapses</Box>
                </TableCell>
              </TableRow>
              {(values.attributableOfficials || []).map((row, index) => (
                <TableRow key={`attributable-${index}`}>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Box sx={{ px: 0.75, py: 0.3 }}>{index + 1}</Box>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.namePfDesignation}
                      onChange={(value) =>
                        updateRow(
                          "attributableOfficials",
                          index,
                          "namePfDesignation",
                          value,
                        )
                      }
                      readOnly={readOnly}
                      multiline
                      minRows={2}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.stage}
                      onChange={(value) =>
                        updateRow("attributableOfficials", index, "stage", value)
                      }
                      readOnly={readOnly}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.lapses}
                      onChange={(value) =>
                        updateRow("attributableOfficials", index, "lapses", value)
                      }
                      readOnly={readOnly}
                      multiline
                      minRows={2}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <SectionHeading sx={{ mt: 1.4 }}>
            Scrutiny of Asset &amp; Liabilities Statement
          </SectionHeading>
          <Table size="small" sx={tableSx}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ ...bodyCellSx, width: "8%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>S.No</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, width: "32%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>
                    Name of erring Official, PF No &amp; Designation
                  </Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, width: "19%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Details of AL Statement</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Observations</Box>
                </TableCell>
              </TableRow>
              {(values.assetLiabilityRows || []).map((row, index) => (
                <TableRow key={`asset-liability-${index}`}>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Box sx={{ px: 0.75, py: 0.3 }}>{index + 1}</Box>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.namePfDesignation}
                      onChange={(value) =>
                        updateRow(
                          "assetLiabilityRows",
                          index,
                          "namePfDesignation",
                          value,
                        )
                      }
                      readOnly={readOnly}
                      multiline
                      minRows={2}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.statementDetails}
                      onChange={(value) =>
                        updateRow(
                          "assetLiabilityRows",
                          index,
                          "statementDetails",
                          value,
                        )
                      }
                      readOnly={readOnly}
                      multiline
                      minRows={2}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.observations}
                      onChange={(value) =>
                        updateRow(
                          "assetLiabilityRows",
                          index,
                          "observations",
                          value,
                        )
                      }
                      readOnly={readOnly}
                      multiline
                      minRows={2}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ mt: "auto" }}>
            <Footer page="Page 1 of 3" />
          </Box>
        </Paper>

        <Paper elevation={0} sx={pagePaperSx}>
          <SectionHeading>Name of officials, superannuating within one year</SectionHeading>
          <Table size="small" sx={tableSx}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ ...bodyCellSx, width: "25%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Name &amp; PF No</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, width: "25%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Scale and Designation</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, width: "25%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Role in the case</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Date of superannuation</Box>
                </TableCell>
              </TableRow>
              {(values.superannuatingOfficials || []).map((row, index) => (
                <TableRow key={`superannuating-${index}`}>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.namePfNo}
                      onChange={(value) =>
                        updateRow("superannuatingOfficials", index, "namePfNo", value)
                      }
                      readOnly={readOnly}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.scaleDesignation}
                      onChange={(value) =>
                        updateRow(
                          "superannuatingOfficials",
                          index,
                          "scaleDesignation",
                          value,
                        )
                      }
                      readOnly={readOnly}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.roleInCase}
                      onChange={(value) =>
                        updateRow("superannuatingOfficials", index, "roleInCase", value)
                      }
                      readOnly={readOnly}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoDateField
                      value={row.dateOfSuperannuation}
                      onChange={(value) =>
                        updateRow(
                          "superannuatingOfficials",
                          index,
                          "dateOfSuperannuation",
                          value,
                        )
                      }
                      readOnly={readOnly}
                      format="DD.MM.YYYY"
                      placeholder="dd.mm.yyyy"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <SectionHeading sx={{ mt: 1.5 }}>
            Name of official under suspension
          </SectionHeading>
          <Table size="small" sx={tableSx}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ ...bodyCellSx, width: "34%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Name &amp; PF No</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, width: "33%", fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Scale and Designation</Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                  <Box sx={{ px: 0.75, py: 0.3 }}>Date of suspension</Box>
                </TableCell>
              </TableRow>
              {(values.suspendedOfficials || []).map((row, index) => (
                <TableRow key={`suspended-${index}`}>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.namePfNo}
                      onChange={(value) =>
                        updateRow("suspendedOfficials", index, "namePfNo", value)
                      }
                      readOnly={readOnly}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoField
                      value={row.scaleDesignation}
                      onChange={(value) =>
                        updateRow(
                          "suspendedOfficials",
                          index,
                          "scaleDesignation",
                          value,
                        )
                      }
                      readOnly={readOnly}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <MemoDateField
                      value={row.dateOfSuspension}
                      onChange={(value) =>
                        updateRow(
                          "suspendedOfficials",
                          index,
                          "dateOfSuspension",
                          value,
                        )
                      }
                      readOnly={readOnly}
                      format="DD.MM.YYYY"
                      placeholder="dd.mm.yyyy"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <SectionHeading sx={{ mt: 1.5 }}>
            Scrutiny of Investigation Report as per Check list
          </SectionHeading>
          <Table size="small" sx={tableSx}>
            <TableBody>
              {renderChecklistRows(VETTING_CHECKLIST_SECTIONS.slice(0, 3))}
            </TableBody>
          </Table>

          <Box sx={{ mt: "auto" }}>
            <Footer page="Page 2 of 3" />
          </Box>
        </Paper>

        <Paper elevation={0} sx={pagePaperSx}>
          <Table size="small" sx={tableSx}>
            <TableBody>
              {renderChecklistRows(VETTING_CHECKLIST_SECTIONS.slice(3))}
            </TableBody>
          </Table>

          <Typography sx={{ fontSize: 12, lineHeight: 1.5, mt: 2.2 }}>
            Investigation Report is being submitted to Vetting Committee for their
            observation/approval/vetting.
          </Typography>

          <Typography sx={{ fontSize: 12, mt: 3.5 }}>Submitted Accordingly.</Typography>

          <Box sx={{ mt: 3.5, width: 250 }}>
            <Box sx={{ borderBottom: `1px solid ${documentBorder}`, minHeight: 18 }}>
              <MemoField
                value={values.deskOfficerName}
                onChange={(value) => set("deskOfficerName", value)}
                readOnly={readOnly}
                align="center"
              />
            </Box>
            <Typography sx={{ fontSize: 12, textAlign: "center" }}>
              (Name of Desk Officer)
            </Typography>
            <Box
              sx={{
                borderBottom: `1px solid ${documentBorder}`,
                minHeight: 18,
                mt: 0.7,
              }}
            >
              <MemoField
                value={values.deskOfficerDesignation}
                onChange={(value) => set("deskOfficerDesignation", value)}
                readOnly={readOnly}
                align="center"
              />
            </Box>
            <Typography sx={{ fontSize: 12, textAlign: "center" }}>
              Designation
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 2.5,
              border: `1px solid ${documentBorder}`,
              minHeight: 78,
            }}
          >
            <Typography sx={{ fontSize: 12, px: 0.75, py: 0.35 }}>
              Observation of Vetting Committee:
            </Typography>
            <MemoField
              value={values.committeeObservation}
              onChange={(value) => set("committeeObservation", value)}
              readOnly={readOnly}
              multiline
              minRows={3}
              sx={{ pt: 0 }}
            />
          </Box>

          <Typography component="div" sx={{ fontSize: 12, lineHeight: 1.5, mt: 2.3 }}>
            Report has been perused and found in order Investigation Report dated
            <MemoDateField
              value={values.reportPerusedDate}
              onChange={(value) => set("reportPerusedDate", value)}
              readOnly={readOnly}
              inline
              width={120}
              format="DD.MM.YYYY"
              placeholder="dd.mm.yyyy"
            />
            of Account
            <InlineBlank
              value={values.reportPerusedAccount}
              onChange={(value) => set("reportPerusedAccount", value)}
              readOnly={readOnly}
              width={168}
              align="left"
            />
            submitted by
            <InlineBlank
              value={values.reportSubmittedBy}
              onChange={(value) => set("reportSubmittedBy", value)}
              readOnly={readOnly}
              width={150}
              align="left"
            />
            is vetted.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mt: 6,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: 12, lineHeight: 1.35 }}>
              Assistant General Manager
              <br />
              Member
            </Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.35 }}>
              Assistant General Manager
              <br />
              Member
            </Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.35 }}>
              Deputy General Manager
              <br />
              Chairperson
            </Typography>
          </Box>

          <Box sx={{ mt: 3.5, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>Date:</Typography>
            <MemoDateField
              value={values.committeeDate}
              onChange={(value) => set("committeeDate", value)}
              readOnly={readOnly}
              inline
              width={120}
              format="DD-MM-YYYY"
              placeholder="dd-mm-yyyy"
              align="left"
            />
          </Box>

          <Box sx={{ mt: "auto" }}>
            <Footer page="Page 3 of 3" />
          </Box>
        </Paper>
      </Box>

      {showViewActions && (
        <Paper
          variant="outlined"
          sx={{
            mt: 2.5,
            p: 2,
            bgcolor: "rgba(0, 86, 150, 0.04)",
          borderColor: commonBorder,
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 2 }}>
            Vetting Actions
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={handlePrintDocument}
            >
              Print Vetting Form
            </Button>
            <CustomAutocomplete
              options={vettingOptions}
              value={values.isFormVetted || null}
              onChange={(_, value) => set("isFormVetted", value ?? "")}
              label="Is Form Vetted?"
            />
            <MemoDateField
              value={values.dateOfVetting}
              onChange={(value) => set("dateOfVetting", value)}
              readOnly={false}
              formField
              label="Date of Vetting"
              format="DD.MM.YYYY"
              placeholder="dd.mm.yyyy"
            />
            <CustomTextField
              type="file"
              label="Attach Document"
              value={values.attachDocument}
              onChange={(file) => set("attachDocument", file)}
              name="attachDocument"
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={onFinalSubmit}>
              Final Submit
            </Button>
          </Box>
        </Paper>
      )}

      {showEditActions && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, pt: 2.5 }}>
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
    </Box>
  );
}
