import React from "react";
import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
  Box,
  ListItemButton,
} from "@mui/material";
import dayjs from "dayjs";

const ConversationItem = ({ conversation, isActive, onClick }) => {
  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => onClick(conversation)}
        selected={isActive}
        className={isActive ? "bg-slate-100" : ""}
      >
        <ListItemAvatar>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            color={conversation.isOnline ? "success" : "error"}
          >
            <Avatar className="!bg-primary-main" src={conversation.avatar}>
              {!conversation.avatar && conversation.name?.[0]?.toUpperCase()}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box className="flex justify-between">
              <Typography variant="subtitle2" component="span">
                {conversation.name}
              </Typography>
            </Box>
          }
          // Thay đổi cách render phần secondary để tránh lỗi hydration
          secondary={
            <Box className="flex items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  component="span"
                  className="max-w-[120px]"
                >
                  {conversation.lastMessage.content}
                </Typography>
                <Typography
                  className="max-w-[120px]"
                  variant="body2"
                  color="text.secondary"
                >
                  {dayjs(conversation.lastMessage.dateSent).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
                </Typography>
              </div>

              {conversation.unread > 0 && (
                <Badge
                  badgeContent={conversation.unread}
                  color="primary"
                  className="ml-2"
                />
              )}
            </Box>
          }
          // Đảm bảo MUI không render thẻ p bên ngoài secondary content của chúng ta
          disableTypography
        />
      </ListItemButton>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default ConversationItem;
