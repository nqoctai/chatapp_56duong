import React, { useState } from "react";
import {
  TextField,
  IconButton,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Send, EmojiEmotions, AttachFile } from "@mui/icons-material";
import { useWebSocketContext } from "@context/SocketContext";

const MessageInput = ({ roomId, currentUser }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { sendMessage, connected } = useWebSocketContext();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSend = () => {
    if (message.trim() && roomId) {
      setSending(true);

      const messageContent = {
        content: message.trim(),
        messageRoomId: roomId,
        sender: currentUser,
        messageType: "TEXT",
        timestamp: new Date().toISOString(),
      };

      console.log("Sending message:", messageContent);

      let success = false;
      if (connected) {
        sendMessage(messageContent);
        success = true;
      } else {
        console.error("WebSocket không được kết nối, không thể gửi tin nhắn");
      }

      if (success) {
        setMessage("");
      } else {
        setErrorMessage(
          "Không thể gửi tin nhắn! WebSocket không được kết nối. Vui lòng tải lại trang.",
        );
        setOpenSnackbar(true);
      }

      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Box className="flex gap-2 border-t p-4">
        <IconButton size="small">
          <EmojiEmotions />
        </IconButton>
        <IconButton size="small">
          <AttachFile />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          multiline
          maxRows={4}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!message.trim() || sending}
        >
          {sending ? <CircularProgress size={24} /> : <Send />}
        </IconButton>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MessageInput;
