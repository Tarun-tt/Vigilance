import Chip from "@mui/material/Chip";
import { commonBlue, commonOrange, commonSuccessGreen } from "../../theme/theme";

export function StatusBadge({ status }) {
  const getColor = () => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "vetted":
        return commonSuccessGreen;
      case "pending":
        return commonOrange;
      case "draft":
        return "#6c757d";
      default:
        return commonBlue;
    }
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: getColor(),
        color: "white",
        fontWeight: 600,
        fontSize: "11px",
        height: "24px",
      }}
    />
  );
}
