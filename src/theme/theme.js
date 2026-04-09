import { createTheme } from "@mui/material/styles";

export const commonBlue = "#005DAA";
export const commonBlueDark = "#004a8c";
export const commonOrange = "#F37021";
export const commonPageBg = "#F5F7FA";
export const commonFilterBg = "#EBF3FB";
export const commonTableHeaderBg = "#E3EEF8";
export const commonInputSoftBg = "#EEF7FF";
export const commonSuccessGreen = "#28a745";
export const commonMutedText = "#5c6c7c";
export const commonBorder = "#d8e2ec";

export const theme = createTheme({
  palette: {
    primary: { main: commonBlue, contrastText: "#fff", dark: commonBlueDark },
    secondary: { main: commonOrange, contrastText: "#fff" },
    background: { default: commonPageBg, paper: "#fff" },
    text: { primary: "#1a2b3c", secondary: commonMutedText },
  },
  typography: {
    fontFamily:
      '"Source Sans 3", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": { boxShadow: "0 2px 8px rgba(0,93,170,0.35)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: commonBorder },
        },
      },
    },
  },
});
