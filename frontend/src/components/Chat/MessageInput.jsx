import React from "react";
import { TextField, IconButton, Box } from "@mui/material";
import { Send, EmojiEmotions, AttachFile } from "@mui/icons-material";

const MessageInput = ({ value, onChange, onSend }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <Box className="flex gap-2">
      <IconButton size="small">
        <EmojiEmotions />
      </IconButton>
      <IconButton size="small">
        <AttachFile />
      </IconButton>
      <TextField
        fullWidth
        placeholder="Nhập tin nhắn..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        variant="outlined"
        size="small"
      />
      <IconButton color="primary" onClick={onSend} disabled={!value.trim()}>
        <Send />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
