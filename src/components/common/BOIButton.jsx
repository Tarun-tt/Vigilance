import React from "react";
import { Button, CircularProgress } from "@mui/material";

const BOIButton = ({
  children,
  onClick,
  type = "button",
  variant = "contained",
  color = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  size = "medium",
  startIcon,
  endIcon,
  ...props
}) => {
  const getColor = () => {
    if (color === "success") return "#2e7d32";
    if (color === "primary") return "#1976d2";
    return color;
  };

  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      size={size}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      sx={{
        textTransform: "none",
        ...(variant === "contained" &&
          color === "primary" && {
            bgcolor: "#1976d2",
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }),
        ...(variant === "contained" &&
          color === "success" && {
            bgcolor: "#2e7d32",
            "&:hover": {
              bgcolor: "#1b5e20",
            },
          }),
        ...props.sx,
      }}
      {...props}
    >
      {loading && <CircularProgress size={24} sx={{ mr: 1 }} />}
      {children}
    </Button>
  );
};

export default BOIButton;
