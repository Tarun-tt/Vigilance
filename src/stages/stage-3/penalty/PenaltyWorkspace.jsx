import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ContentCard } from "../../../components/layout/ContentCard";
import { boiBlue, boiBorder, boiMutedText } from "../../../theme/theme";

export function PenaltyWorkspace() {
  return (
    <ContentCard>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1.2rem",
          color: boiBlue,
          mb: 1,
          borderBottom: `3px solid ${boiBlue}`,
          pb: 0.75,
          display: "inline-block",
        }}
      >
        Penalty
      </Typography>
      <Typography sx={{ color: boiMutedText, mb: 3, maxWidth: 720 }}>
        Penalty imposition and compliance tracking.
      </Typography>
      <Box
        sx={{
          border: `1px dashed ${boiBorder}`,
          borderRadius: "12px",
          p: 4,
          textAlign: "center",
          bgcolor: "rgba(0, 93, 170, 0.03)",
          color: boiMutedText,
        }}
      >
        <Typography variant="body2">
          Form builder placeholder — connect API and field schema per circular.
        </Typography>
      </Box>
    </ContentCard>
  );
}
