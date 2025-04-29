import React from "react";
import { Avatar, Typography } from "@mui/material";

const ChatMessage = ({ message }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Check if message is from the current user
  const isMine = message.sender === "me";

  return (
    <div className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
      {!isMine && (
        <Avatar className="mr-2 mt-1 !h-8 !w-8 !bg-primary-main">
          {/* Display first letter of sender's name */}
          {message.senderName ? message.senderName[0].toUpperCase() : "U"}
        </Avatar>
      )}
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isMine ? "bg-primary-main text-white" : "bg-gray-100"
        }`}
      >
        <Typography variant="body1">{message.text}</Typography>
        <Typography
          variant="caption"
          className={`block text-right ${
            isMine ? "text-white/80" : "text-gray-500"
          }`}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </div>
      {isMine && (
        <Avatar className="ml-2 mt-1 !h-8 !w-8 !bg-primary-main">
          {/* In a real app, this would be the current user's initial */}
          {"M"}
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
