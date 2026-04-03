import React from "react";
import { Box, Typography } from "@mui/material";
import { BOICard, BOIButton } from "./common";
import {
  Description as DescriptionIcon,
  Build as BuildIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

function SectionPlaceholder({ title, description, icon }) {
  const getIcon = () => {
    switch (title) {
      case "Section 2.1":
        return <DescriptionIcon sx={{ fontSize: 60, color: "#1976d2" }} />;
      case "Section 2.2":
        return <BuildIcon sx={{ fontSize: 60, color: "#1976d2" }} />;
      case "Section 2.3":
        return <AssessmentIcon sx={{ fontSize: 60, color: "#1976d2" }} />;
      default:
        return (
          icon || <DescriptionIcon sx={{ fontSize: 60, color: "#1976d2" }} />
        );
    }
  };

  const getDescription = () => {
    switch (title) {
      case "Section 2.1":
        return "This section contains audit reports and compliance documentation.";
      case "Section 2.2":
        return "Manage and track compliance checks, regulatory requirements, and validation processes.";
      case "Section 2.3":
        return "View and analyze risk assessment reports, mitigation strategies, and risk matrices.";
      default:
        return description || `This is the content area for ${title}`;
    }
  };

  return (
    <BOICard
      title={title}
      subtitle="BOI Vigilance System"
      headerAction={
        <BOIButton
          variant="contained"
          color="primary"
          onClick={() => console.log(`Navigate to ${title}`)}
        >
          View Details
        </BOIButton>
      }
    >
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {getIcon()}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#1976d2", fontWeight: "bold" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: "80%", mx: "auto" }}
        >
          {getDescription()}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <BOIButton
            variant="outlined"
            color="primary"
            onClick={() => console.log(`Learn more about ${title}`)}
          >
            Learn More
          </BOIButton>
        </Box>
      </Box>
    </BOICard>
  );
}

export default SectionPlaceholder;
