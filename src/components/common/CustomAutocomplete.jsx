import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export function CustomAutocomplete({
  label,
  error,
  helperText,
  readOnly,
  disabled,
  InputLabelProps,
  textFieldSx,
  sx, // Add sx prop here
  ...rest
}) {
  return (
    <Autocomplete
      disabled={disabled || readOnly}
      readOnly={readOnly}
      sx={sx} // Apply sx to Autocomplete
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          size="small"
          sx={textFieldSx} // This applies to the TextField inside
          InputLabelProps={{ ...params.InputLabelProps, ...InputLabelProps }}
        />
      )}
    />
  );
}
