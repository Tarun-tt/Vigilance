import React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

class ToastManager {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  showToast({ message, type = "info", title = "", autoClose = 5000 }) {
    this.listeners.forEach((listener) =>
      listener({ message, type, title, autoClose, open: true }),
    );
  }

  hideToast() {
    this.listeners.forEach((listener) => listener({ open: false }));
  }
}

export const toastManager = new ToastManager();

export const showBOIToast = ({
  message,
  type = "info",
  title = "",
  autoClose = 5000,
}) => {
  if (window.Liferay?.Util?.openToast) {
    window.Liferay.Util.openToast({
      message,
      type,
      title,
      autoClose,
    });
  } else {
    toastManager.showToast({ message, type, title, autoClose });
  }
};

function BOIToast() {
  const [toast, setToast] = React.useState({
    open: false,
    message: "",
    type: "info",
    title: "",
    autoClose: 5000,
  });

  React.useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToast);
    return unsubscribe;
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    toastManager.hideToast();
  };

  const getAlertSeverity = (type) => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "info";
    }
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={toast.autoClose}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={getAlertSeverity(toast.type)}
        sx={{ width: "100%", minWidth: "300px" }}
      >
        {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
        {toast.message}
      </Alert>
    </Snackbar>
  );
}

export default BOIToast;
