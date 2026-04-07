import TextField from "@mui/material/TextField";

export function CustomTextField({
  cellVariant,
  size = "small",
  fullWidth = true,
  sx,
  InputLabelProps,
  ...rest
}) {
  const cellSx = cellVariant
    ? {
        "& .MuiOutlinedInput-root": {
          borderRadius: 0,
          bgcolor: "background.paper",
          "& fieldset": { border: "none" },
        },
      }
    : {};

  return (
    <TextField
      size={size}
      fullWidth={fullWidth}
      variant="outlined"
      sx={{ ...cellSx, ...sx }} // Merge the sx prop correctly
      InputLabelProps={InputLabelProps}
      {...rest}
    />
  );
}
