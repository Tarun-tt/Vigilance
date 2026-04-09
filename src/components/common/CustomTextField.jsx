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
import { commonBlue, commonBorder, commonInputSoftBg } from "../../theme/theme";
import dayjs from "dayjs";

const soft = {
  "& .MuiOutlinedInput-root": {
    bgcolor: commonInputSoftBg,
    borderRadius: "10px",
  },
};

const toDayjs = (value) => {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  return dayjs(value);
};

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
  required,
  label,
  placeholder,
  options,
  optionsKey,
  optionsMap,
  name,
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
      <FormControl component="fieldset" error={!!error} fullWidth>
        <FormLabel component="legend" sx={{ fontSize: 13, mb: 1 }}>
          {label}
          {required && " *"}
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
        label={label}
        value={toDayjs(value)}
        onChange={(date) => onChange && onChange(date)}
        slotProps={{
          textField: {
            fullWidth: true,
            size: size,
            sx: soft,
            placeholder: placeholder,
            error: !!error,
            helperText: helperText,
            required: required,
          },
        }}
      />
    );
  }

  if (type === "file") {
    return (
      <Box>
        <Typography
          sx={{
            mb: 0.75,
            fontSize: 13,
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          {label}
          {required && " *"}
        </Typography>
        <Box
          sx={{
            border: `1px dashed ${commonBorder}`,
            borderRadius: "10px",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#fafcff",
            cursor: "pointer",
            "&:hover": { bgcolor: "#f0f5fa" },
          }}
          onClick={() => document.getElementById(`${name}-input`).click()}
        >
          <Typography color="text.secondary">
            {value ? value.name : "Upload Attachment"}
          </Typography>
          <CloudUploadIcon sx={{ color: commonBlue }} />
          <input
            id={`${name}-input`}
            type="file"
            hidden
            onChange={(e) => onChange && onChange(e.target.files[0])}
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
      InputLabelProps={InputLabelProps}
      type={type}
      label={label}
      value={value || ""}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      required={required}
      placeholder={placeholder}
      name={name}
      {...multilineProps}
      {...rest}
    />
  );
}
