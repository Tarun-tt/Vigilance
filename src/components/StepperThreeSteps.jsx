import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
} from "@mui/material";
import { BOIButton, showBOIToast, BOICard } from "./common";

const steps = ["Step 1", "Step 2", "Step 3"];

function StepperThreeSteps() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    const newStep = activeStep + 1;
    setActiveStep(newStep);

    if (newStep === steps.length) {
      showBOIToast({
        message: "Process completed successfully!",
        type: "success",
        title: "Success",
        autoClose: 3000,
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BOICard title="Step 1: Initiation">
            <p>Start the process by providing initial details.</p>
          </BOICard>
        );
      case 1:
        return (
          <BOICard title="Step 2: Processing">
            <p>Your request is being processed.</p>
          </BOICard>
        );
      case 2:
        return (
          <BOICard title="Step 3: Completion">
            <p>Finalize and submit your request.</p>
          </BOICard>
        );
      default:
        return <p>Step {step + 1} Content</p>;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#1976d2", fontWeight: "bold" }}
        >
          3-Step Process
        </Typography>

        <Stepper
          activeStep={activeStep}
          sx={{
            my: 4,
            "& .MuiStepIcon-root.Mui-active": {
              color: "#1976d2",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#2e7d32",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "#1976d2",
              fontWeight: "bold",
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "#2e7d32",
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ mt: 2, mb: 2, color: "#2e7d32" }} variant="h6">
              🎉 All steps completed - you're finished! 🎉
            </Typography>
            <BOIButton variant="outlined" onClick={handleReset}>
              Reset Process
            </BOIButton>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mt: 2, mb: 2 }}>{renderStepContent(activeStep)}</Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <BOIButton
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </BOIButton>
              <Box sx={{ flex: "1 1 auto" }} />
              <BOIButton
                variant="contained"
                onClick={handleNext}
                color={activeStep === steps.length - 1 ? "success" : "primary"}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </BOIButton>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default StepperThreeSteps;
