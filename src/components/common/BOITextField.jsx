import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Search as SearchIcon,
} from "@mui/icons-material";

const BOITextField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  fullWidth = true,
  placeholder,
  error,
  helperText,
  disabled = false,
  multiline = false,
  rows = 4,
  searchField = false,
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const getInputProps = () => {
    if (searchField) {
      return {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "#1976d2" }} />
          </InputAdornment>
        ),
      };
    }

    if (showPasswordToggle && type === "password") {
      return {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    return {};
  };

  const getType = () => {
    if (type === "password" && showPasswordToggle && showPassword) {
      return "text";
    }
    return type;
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={getType()}
      required={required}
      fullWidth={fullWidth}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      variant="outlined"
      InputProps={getInputProps()}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: "#1976d2",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#1976d2",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#1976d2",
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default BOITextField;
