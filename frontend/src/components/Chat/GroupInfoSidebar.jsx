import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Info,
  Person,
  PhotoCamera,
  Settings,
  Close,
  PersonAdd,
} from "@mui/icons-material";

const GroupInfoSidebar = ({ conversation, onClose }) => {
  // Kiểm tra xem có phải là nhóm hay không
  const isGroup = conversation?.isGroup;

  // Danh sách thành viên
  const members = conversation?.memberDetails || [];

  return (
    <Box className="flex h-full w-full flex-col border-l">
      {/* Header */}
      <Box className="flex items-center justify-between border-b p-3">
        <Typography variant="h6" className="font-medium">
          Thông tin {isGroup ? "nhóm" : "người dùng"}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Avatar và tên */}
      <Box className="flex flex-col items-center p-4">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <IconButton
              size="small"
              className="bg-white !p-1"
              sx={{ boxShadow: 1 }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          }
        >
          <Avatar
            src={conversation?.avatar}
            sx={{ width: 80, height: 80 }}
            className="mb-3 !bg-primary-main"
          >
            {!conversation?.avatar && conversation?.name?.[0]?.toUpperCase()}
          </Avatar>
        </Badge>
        <Typography variant="h6" className="mt-2 font-medium">
          {conversation?.name || "Không có tên"}
        </Typography>
        {isGroup && (
          <Typography variant="body2" color="text.secondary">
            {members.length} thành viên
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Tùy chọn nhóm */}
      <List>
        {isGroup && (
          <>
            <ListItem button>
              <ListItemAvatar>
                <Avatar className="!bg-blue-100">
                  <PersonAdd className="!text-blue-500" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Thêm thành viên"
                secondary="Mời thêm người vào nhóm chat"
              />
            </ListItem>

            <ListItem button>
              <ListItemAvatar>
                <Avatar className="!bg-green-100">
                  <Settings className="!text-green-500" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Cài đặt nhóm"
                secondary="Quyền, thông báo và nhiều hơn nữa"
              />
            </ListItem>
          </>
        )}

        <ListItem button>
          <ListItemAvatar>
            <Avatar className="!bg-purple-100">
              <Info className="!text-purple-500" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={isGroup ? "Giới thiệu về nhóm" : "Thông tin cá nhân"}
            secondary={
              isGroup
                ? "Xem thông tin chi tiết về nhóm"
                : "Xem thông tin chi tiết về người này"
            }
          />
        </ListItem>
      </List>

      <Divider />

      {/* Danh sách thành viên */}
      {members.length > 0 && (
        <>
          <Box className="p-3">
            <Typography variant="subtitle1" className="font-medium">
              Thành viên
            </Typography>
          </Box>
          <List className="overflow-y-auto">
            {members.map((member, index) => (
              <ListItem key={index} button>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color={member.lastLogin ? "success" : "default"}
                  >
                    <Avatar className="!bg-primary-main">
                      {member.username?.[0]?.toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box className="flex items-center">
                      <Typography variant="body1">{member.username}</Typography>
                      {member.isAdmin && (
                        <Typography
                          variant="caption"
                          className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-800"
                        >
                          Admin
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    member.lastSeen
                      ? `Hoạt động gần đây: ${new Date(member.lastSeen).toLocaleString()}`
                      : "Chưa có hoạt động"
                  }
                  disableTypography
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default GroupInfoSidebar;
