import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ContentCard } from "../../../components/layout/ContentCard";
import { HorizontalStepper } from "../../../components/layout/HorizontalStepper";
import { WorkspaceActionBar } from "../../../components/forms/WorkspaceActionBar";
import { CustomTextField, useToast } from "../../../components/common";
import {
  INVESTIGATION_STEPS,
  investigationPath,
} from "../../../app/routeConfig";
import { boiBlue, boiBorder, boiInputSoftBg } from "../../../theme/theme";

const MAX = 5;
const req = true;

const softFieldSx = {
  "& .MuiOutlinedInput-root": { bgcolor: boiInputSoftBg, borderRadius: "10px" },
};

function FieldShell({ children, sx }) {
  return <Box sx={{ mb: 2, ...sx }}>{children}</Box>;
}

function Label({ children, required }) {
  return (
    <Typography
      component="label"
      sx={{
        display: "block",
        mb: 0.75,
        fontSize: 13,
        fontWeight: 600,
        color: "text.secondary",
      }}
    >
      {children}
      {required && (
        <Typography component="span" sx={{ color: "error.main", ml: 0.25 }}>
          *
        </Typography>
      )}
    </Typography>
  );
}

function InvestigationStepContent({ stepNum }) {
  switch (stepNum) {
    case 1:
      return (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: boiBlue,
              mb: 2,
              borderBottom: `3px solid ${boiBlue}`,
              pb: 0.75,
              display: "inline-block",
            }}
          >
            Investigation Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Complaint Number</Label>
                <CustomTextField
                  defaultValue="VC768"
                  InputLabelProps={{ shrink: true }}
                  sx={softFieldSx}
                />
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Incident Occurred at</Label>
                <CustomTextField select defaultValue="FGMO" sx={softFieldSx}>
                  <MenuItem value="FGMO">FGMO</MenuItem>
                  <MenuItem value="ZO">ZO</MenuItem>
                  <MenuItem value="Branch">Branch</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label>Date of Allotment of Investigation</Label>
                <DatePicker
                  defaultValue={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: softFieldSx,
                    },
                  }}
                />
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label>Whether Delay in allotment?</Label>
                <CustomTextField select defaultValue="Yes" sx={softFieldSx}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
            <Grid item xs={12}>
              <FieldShell>
                <Label>Remarks</Label>
                <CustomTextField
                  multiline
                  minRows={3}
                  placeholder="Enter remarks"
                  sx={softFieldSx}
                />
              </FieldShell>
            </Grid>
          </Grid>
        </Box>
      );
    case 2:
      return (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: boiBlue,
              mb: 2,
              borderBottom: `3px solid ${boiBlue}`,
              pb: 0.75,
              display: "inline-block",
            }}
          >
            Vetting of Investigation
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Complaint Number</Label>
                <CustomTextField defaultValue="VC768" sx={softFieldSx} />
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Incident Occurred at</Label>
                <CustomTextField select defaultValue="FGMO" sx={softFieldSx}>
                  <MenuItem value="FGMO">FGMO</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
            <Grid item xs={12}>
              <FieldShell>
                <Label>Vetting remarks</Label>
                <CustomTextField multiline minRows={4} sx={softFieldSx} />
              </FieldShell>
            </Grid>
          </Grid>
        </Box>
      );
    case 3:
      return (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: boiBlue,
              mb: 2,
              borderBottom: `3px solid ${boiBlue}`,
              pb: 0.75,
              display: "inline-block",
            }}
          >
            Identified Employee Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Complaint Number</Label>
                <CustomTextField defaultValue="VC768" sx={softFieldSx} />
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Incident Occurred at</Label>
                <CustomTextField select defaultValue="FGMO" sx={softFieldSx}>
                  <MenuItem value="FGMO">FGMO</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
            <Grid item xs={12}>
              <FieldShell>
                <Label required={req}>
                  Whether The Staff Is Identified/Not Identified
                </Label>
                <CustomTextField
                  select
                  defaultValue="Non-Identified"
                  sx={softFieldSx}
                >
                  <MenuItem value="Identified">Identified</MenuItem>
                  <MenuItem value="Non-Identified">Non-Identified</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
          </Grid>
        </Box>
      );
    case 4:
      return (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: boiBlue,
              mb: 2,
              borderBottom: `3px solid ${boiBlue}`,
              pb: 0.75,
              display: "inline-block",
            }}
          >
            Vetting Advice
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Complaint Number</Label>
                <CustomTextField defaultValue="VC768" sx={softFieldSx} />
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Incident Occurred at</Label>
                <CustomTextField select defaultValue="FGMO" sx={softFieldSx}>
                  <MenuItem value="FGMO">FGMO</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>
                  Date of vetting of investigation report conveyed to CA
                </Label>
                <DatePicker
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      placeholder: "Select Date...",
                      sx: softFieldSx,
                    },
                  }}
                />
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label>Attachment</Label>
                <Box
                  sx={{
                    border: `1px dashed ${boiBorder}`,
                    borderRadius: "10px",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#fafcff",
                  }}
                >
                  <Typography color="text.secondary">
                    Upload Attachment
                  </Typography>
                  <CloudUploadIcon sx={{ color: boiBlue }} />
                </Box>
              </FieldShell>
            </Grid>
          </Grid>
        </Box>
      );
    case 5:
      return (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: boiBlue,
              mb: 2,
              borderBottom: `3px solid ${boiBlue}`,
              pb: 0.75,
              display: "inline-block",
            }}
          >
            Investigation Form Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Complaint Number</Label>
                <CustomTextField defaultValue="VC768" sx={softFieldSx} />
              </FieldShell>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldShell>
                <Label required={req}>Incident Occurred at</Label>
                <CustomTextField select defaultValue="FGMO" sx={softFieldSx}>
                  <MenuItem value="FGMO">FGMO</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
            <Grid item xs={12}>
              <FieldShell>
                <Label>Investigation Report Format</Label>
                <CustomTextField
                  select
                  defaultValue="Credit Matters"
                  sx={softFieldSx}
                >
                  <MenuItem value="Credit Matters">Credit Matters</MenuItem>
                  <MenuItem value="Operational">Operational</MenuItem>
                  <MenuItem value="Forensic">Forensic</MenuItem>
                </CustomTextField>
              </FieldShell>
            </Grid>
            <Grid item xs={12}>
              <FieldShell>
                <Label>Fill Investigation</Label>
                <CustomTextField
                  multiline
                  minRows={6}
                  placeholder="Enter Fill Investigation"
                  sx={softFieldSx}
                />
              </FieldShell>
            </Grid>
          </Grid>
        </Box>
      );
    default:
      return null;
  }
}

export function InvestigationWorkspace() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();

  const n = Math.min(MAX, Math.max(1, parseInt(step ?? "1", 10) || 1));
  const activeIndex = n - 1;

  const goStep = (index) => {
    navigate(investigationPath(index + 1));
  };

  const handleNext = () => {
    if (n < MAX) navigate(investigationPath(n + 1));
    else success("Last step — submit flow");
  };

  return (
    <ContentCard>
      <Typography
        sx={{ fontWeight: 700, color: boiBlue, mb: 0.5, fontSize: 13 }}
      >
        Stage 2 — Investigation
      </Typography>
      <HorizontalStepper
        steps={INVESTIGATION_STEPS}
        activeIndex={activeIndex}
        onStepChange={goStep}
      />
      <Box sx={{ mt: 2 }}>
        <InvestigationStepContent stepNum={n} />
      </Box>
      <WorkspaceActionBar
        onCancel={() => success("Cancelled ")}
        onSave={() => success("Saved ")}
        onNext={handleNext}
        nextLabel={n < MAX ? "Next" : "Submit"}
      />
    </ContentCard>
  );
}
