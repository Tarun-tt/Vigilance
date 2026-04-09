import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { boiBlue, boiBorder, boiInputSoftBg } from "../../theme/theme";
import dayjs from "dayjs";

const soft = {
  "& .MuiOutlinedInput-root": {
    bgcolor: boiInputSoftBg,
    borderRadius: "10px",
    "& fieldset": { borderColor: boiBorder },
  },
};

const toDayjs = (value) => {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const formatDate = (value) => {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value.format("YYYY-MM-DD");
  if (typeof value === "string") return value;
  return null;
};

// Single red asterisk for required fields - NO grey asterisk
const RequiredAsterisk = () => (
  <Typography
    component="span"
    sx={{ color: "error.main", fontSize: "1.2rem", lineHeight: 1, ml: 0.5 }}
  >
    *
  </Typography>
);

export function CustomTextField({
  cellVariant,
  size = "small",
  fullWidth = true,
  sx,
  InputLabelProps,
  multiline,
  minRows,
  maxRows,
  type = "text",
  value,
  onChange,
  error,
  helperText,
  required = false,
  label,
  placeholder,
  options,
  optionsKey,
  optionsMap,
  name,
  readOnly,
  disabled,
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

  const multilineProps = multiline
    ? {
        multiline: true,
        minRows: minRows || 2,
        maxRows: maxRows || 4,
      }
    : {};

  if (type === "radio") {
    const radioOptions =
      options ||
      (optionsMap && optionsKey ? optionsMap[optionsKey] : ["Yes", "No"]);
    return (
      <FormControl
        component="fieldset"
        error={!!error}
        fullWidth
        disabled={disabled || readOnly}
      >
        <FormLabel
          component="legend"
          sx={{ fontSize: 13, mb: 1, fontWeight: 500 }}
        >
          {label}
          {required && <RequiredAsterisk />}
        </FormLabel>
        <RadioGroup
          row
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
        >
          {radioOptions.map((opt) => (
            <FormControlLabel
              key={opt}
              value={opt}
              control={<Radio size="small" />}
              label={opt}
              disabled={disabled || readOnly}
            />
          ))}
        </RadioGroup>
        {error && (
          <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        )}
      </FormControl>
    );
  }

  if (type === "date") {
    return (
      <DatePicker
        label={
          <span>
            {label}
            {required && <RequiredAsterisk />}
          </span>
        }
        value={toDayjs(value)}
        onChange={(date) => onChange && onChange(formatDate(date))}
        disabled={disabled || readOnly}
        slotProps={{
          textField: {
            fullWidth: true,
            size: size,
            sx: soft,
            placeholder: placeholder,
            error: !!error,
            helperText: helperText,
            required: required,
            // Remove the default asterisk
            FormHelperTextProps: { sx: { display: "none" } },
          },
        }}
      />
    );
  }

  if (type === "file") {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            mb: 0.75,
            fontSize: 13,
            fontWeight: 500,
            color: "text.secondary",
          }}
        >
          {label}
          {required && <RequiredAsterisk />}
        </Typography>
        <Box
          sx={{
            border: `1px dashed ${boiBorder}`,
            borderRadius: "10px",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: disabled || readOnly ? "#f5f5f5" : "#fafcff",
            cursor: disabled || readOnly ? "default" : "pointer",
            width: "100%",
            "&:hover": {
              bgcolor: disabled || readOnly ? "#f5f5f5" : "#f0f5fa",
            },
          }}
          onClick={() => {
            if (!disabled && !readOnly) {
              document.getElementById(`${name}-input`)?.click();
            }
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            {value ? value.name || "File selected" : "Choose file"}
          </Typography>
          <CloudUploadIcon sx={{ color: boiBlue }} />
          <input
            id={`${name}-input`}
            type="file"
            hidden
            onChange={(e) => onChange && onChange(e.target.files[0])}
            disabled={disabled || readOnly}
          />
        </Box>
        {error && (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 0.5, display: "block" }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <TextField
      size={size}
      fullWidth={fullWidth}
      variant="outlined"
      sx={{ ...cellSx, ...sx }}
      InputLabelProps={{
        ...InputLabelProps,
        // Remove the default asterisk
        shrink: true,
      }}
      type={type}
      label={
        <span>
          {label}
          {required && <RequiredAsterisk />}
        </span>
      }
      value={value || ""}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      required={false}
      placeholder={placeholder}
      name={name}
      disabled={disabled || readOnly}
      {...multilineProps}
      {...rest}
    />
  );
}
