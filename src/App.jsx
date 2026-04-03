import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BOIToast } from "./components/common";
import { AppRoutes } from "./components/common/routes";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Blue
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#2e7d32", // Green
      light: "#4caf50",
      dark: "#1b5e20",
    },
    success: {
      main: "#2e7d32",
    },
    info: {
      main: "#1976d2",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            color: "#1976d2",
          },
          "&.Mui-completed": {
            color: "#2e7d32",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <BOIToast />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
