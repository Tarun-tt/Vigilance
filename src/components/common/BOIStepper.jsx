import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  StepConnector,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import { showBOIToast } from "./BOIToast";

const BOIConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1976d2",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#2e7d32",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#e0e0e0",
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const BOIStepper = ({
  steps,
  onComplete,
  onStepChange,
  redirectPath,
  stepContent,
  title = "Stepper Process",
  showNavigation = true,
  completeMessage = "Process completed successfully!",
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const handleNext = () => {
    const newStep = activeStep + 1;
    setActiveStep(newStep);

    if (onStepChange) {
      onStepChange(newStep);
    }

    if (newStep === steps.length && onComplete) {
      showBOIToast({
        message: completeMessage,
        type: "success",
        title: "Success",
        autoClose: 3000,
      });

      if (redirectPath) {
        setTimeout(() => {
          window.location.hash = redirectPath;
        }, 2000);
      } else {
        onComplete();
      }
    }
  };

  const handleBack = () => {
    const newStep = activeStep - 1;
    setActiveStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    if (onStepChange) {
      onStepChange(0);
    }
  };

  const isStepOptional = (step) => {
    return step.optional || false;
  };

  const getStepContent = (index) => {
    if (stepContent && stepContent[index]) {
      return stepContent[index];
    }
    return `Step ${index + 1} Content`;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#1976d2", fontWeight: "bold" }}
        >
          {title}
        </Typography>

        <Stepper
          activeStep={activeStep}
          connector={<BOIConnector />}
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
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  isStepOptional(step) && (
                    <Typography variant="caption">Optional</Typography>
                  )
                }
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ mt: 2, mb: 2, color: "#2e7d32" }} variant="h6">
              🎉 {completeMessage} 🎉
            </Typography>
            {showNavigation && (
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ borderColor: "#1976d2", color: "#1976d2" }}
              >
                Reset Process
              </Button>
            )}
          </Box>
        ) : (
          <Box>
            <Box sx={{ mt: 2, mb: 2 }}>{getStepContent(activeStep)}</Box>
            {showNavigation && (
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    bgcolor:
                      activeStep === steps.length - 1 ? "#2e7d32" : "#1976d2",
                    "&:hover": {
                      bgcolor:
                        activeStep === steps.length - 1 ? "#1b5e20" : "#1565c0",
                    },
                  }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BOIStepper;
