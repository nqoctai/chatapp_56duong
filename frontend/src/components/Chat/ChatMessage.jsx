import React from "react";
import { Avatar, Typography } from "@mui/material";

const ChatMessage = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  return (
    <div
      className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      {!isOwnMessage && (
        <Avatar className="mr-2 mt-1 !h-8 !w-8 !bg-primary-main">
          {message.sender ? message.sender[0].toUpperCase() : "U"}
        </Avatar>
      )}
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage ? "bg-primary-main text-white" : "bg-gray-100"
        }`}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography
          variant="caption"
          className={`block text-right ${
            isOwnMessage ? "text-white/80" : "text-gray-500"
          }`}
        >
          {formatTime(message.dateSent || message.timestamp)}
        </Typography>
      </div>
      {isOwnMessage && (
        <Avatar className="ml-2 mt-1 !h-8 !w-8 !bg-primary-main">
          {message.sender ? message.sender[0].toUpperCase() : "U"}
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
