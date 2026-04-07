import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";

export function WorkspaceActionBar({
  onCancel,
  onSave,
  onSubmit,
  saveLabel = "Save Draft",
  cancelLabel = "Cancel",
  submitLabel = "Submit",
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        mt: 4,
        pt: 2,
        borderTop: `1px solid `,
      }}
    >
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<CancelIcon />}
        onClick={onCancel}
        size="large"
      >
        {cancelLabel}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={onSave}
        size="large"
      >
        {saveLabel}
      </Button>
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={onSubmit}
        size="large"
      >
        {submitLabel}
      </Button>
    </Box>
  );
}
