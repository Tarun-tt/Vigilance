import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import App from "./App";
import { theme } from "./theme/theme";

// Import dayjs plugins
import "dayjs/locale/en-gb"; // Import UK locale for dd/mm/yyyy

// Set dayjs locale to UK for dd/mm/yyyy format
dayjs.locale("en-gb");
dayjs.extend(customParseFormat);

class WebComponent extends HTMLElement {
  constructor() {
    super();
    this._root = null;
    this._rootCreated = false;
  }

  connectedCallback() {
    if (this._rootCreated) {
      return;
    }

    this._rootCreated = true;
    this._root = createRoot(this);

    const route = this.getAttribute("route") || "/";

    this._root.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
            dateFormats={{
              monthAndYear: "MM/YYYY",
              year: "YYYY",
              normalDate: "DD/MM/YYYY",
              shortDate: "DD/MM/YYYY",
              month: "MMMM",
            }}
          >
            <HashRouter>
              <App route={route} />
            </HashRouter>
          </LocalizationProvider>
        </ThemeProvider>
      </React.StrictMode>,
    );
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
      this._rootCreated = false;
    }
  }
}

const ELEMENT_NAME = "vetting-form";

if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, WebComponent);
}

// For development - mount immediately if not in Web Component context
if (import.meta.env.DEV && !document.querySelector(ELEMENT_NAME)) {
  const demoDiv = document.createElement("div");
  demoDiv.innerHTML = "<vetting-form></vetting-form>";
  document.body.appendChild(demoDiv.firstChild);
}
