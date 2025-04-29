import React from "react";
import { Avatar, Badge, IconButton, Typography } from "@mui/material";
import { MoreVert, Info } from "@mui/icons-material";

const ChatHeader = ({ conversation, onInfoClick }) => {
  if (!conversation) return null;

  return (
    <div className="flex items-center justify-between border-b p-3">
      <div className="flex items-center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          color={conversation.isOnline ? "success" : "error"}
        >
          <Avatar src={conversation.avatar} className="!bg-primary-main">
            {!conversation.avatar && conversation.name?.[0]?.toUpperCase()}
          </Avatar>
        </Badge>
        <div className="ml-3">
          <Typography variant="subtitle1">{conversation.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {conversation.isOnline ? "Đang hoạt động" : "Không hoạt động"}
          </Typography>
        </div>
      </div>
      <div className="flex">
        <IconButton color="primary" onClick={onInfoClick} title="Thông tin">
          <Info />
        </IconButton>
        <IconButton>
          <MoreVert />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatHeader;
