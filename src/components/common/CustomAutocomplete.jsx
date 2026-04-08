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
  sx,
  ...rest
}) {
  return (
    <Autocomplete
      disabled={disabled || readOnly}
      readOnly={readOnly}
      sx={sx}
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          size="small"
          sx={textFieldSx}
          InputLabelProps={{ ...params.InputLabelProps, ...InputLabelProps }}
        />
      )}
    />
  );
}
