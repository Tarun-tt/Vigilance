import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

const BOIAutocomplete = ({
  label,
  options,
  value,
  onChange,
  getOptionLabel = (option) => option.label || option,
  isOptionEqualToValue = (option, value) => option.id === value?.id,
  loading = false,
  multiple = false,
  freeSolo = false,
  required = false,
  placeholder,
  error,
  helperText,
  disabled = false,
  ...props
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      multiple={multiple}
      freeSolo={freeSolo}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
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

export default BOIAutocomplete;
