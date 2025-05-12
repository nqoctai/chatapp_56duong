import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const ErrorHandler = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleAxiosError = (event) => {
      setMessage(event.detail.message);
      setOpen(true);
    };

    window.addEventListener("axiosError", handleAxiosError);

    return () => {
      window.removeEventListener("axiosError", handleAxiosError);
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorHandler;
