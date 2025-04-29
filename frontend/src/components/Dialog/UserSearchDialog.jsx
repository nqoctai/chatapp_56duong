import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  ListItemButton,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";
import { Search, Close, Group, Add } from "@mui/icons-material";
import {
  createChatRoom,
  findMessageRoomAtLeastOneContent,
  findMessageRoomByMembers,
  getUserByUsername,
} from "@services/api";

const UserSearchDialog = ({ open, onClose, onUserSelect, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      // Chỉ reset khi dialog mở
      setSelectedUsers([]);
      setSearchTerm("");
      setUsers([]);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2 || !open) {
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getUserByUsername(searchTerm);
        if (result) {
          console.log("current user", currentUser);
          // Lọc người dùng để loại bỏ người dùng hiện tại và những người đã được chọn
          const filteredUsers = result.filter(
            (user) =>
              user?.username !== currentUser?.username &&
              !selectedUsers.some((selectedUser) =>
                isSameUser(selectedUser, user),
              ),
          );
          setUsers(filteredUsers);
          // setUsers(result);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setError("Lỗi khi tìm kiếm người dùng");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, open]);

  // Hàm so sánh 2 user để kiểm tra trùng lặp
  const isSameUser = (user1, user2) => {
    if (user1.id && user2.id) {
      return user1.id === user2.id;
    }
    return user1.username === user2.username;
  };

  const handleToggleUser = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      // Kiểm tra xem user đã được chọn chưa
      const userIndex = prevSelectedUsers.findIndex((u) => isSameUser(u, user));

      if (userIndex === -1) {
        // Nếu chưa có, thêm vào danh sách đã chọn
        return [...prevSelectedUsers, user];
      } else {
        // Nếu đã có, loại bỏ khỏi danh sách đã chọn
        const newSelectedUsers = [...prevSelectedUsers];
        newSelectedUsers.splice(userIndex, 1);
        return newSelectedUsers;
      }
    });
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length > 0) {
      console.log("Selected users:", selectedUsers);
      onUserSelect(selectedUsers);
      const usernames = selectedUsers
        .map((user) => user.username)
        .filter((u) => u !== undefined);
      try {
        if (currentUser.username) {
          usernames.push(currentUser.username);
        }
        const foundMessageRoom = await findMessageRoomByMembers(usernames);
        console.log("found message room>>>", foundMessageRoom);
        if (foundMessageRoom.data == "") {
          const createMessageRoom = await createChatRoom(
            currentUser.username,
            usernames,
          );
          console.log("createMessageRoom", createMessageRoom);
          const rooms = await findMessageRoomAtLeastOneContent(
            currentUser.username,
          );
          console.log("rooms", rooms);
        }
      } catch (error) {
        console.log(error);
      }

      onClose();
    }
  };

  const isUserSelected = (user) => {
    return selectedUsers.some((u) => isSameUser(u, user));
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setUsers([]);
  };

  const removeSelectedUser = (userToRemove) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => !isSameUser(user, userToRemove)),
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "100%", maxWidth: 500 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Tạo cuộc trò chuyện mới</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Selected Users Section */}
        {selectedUsers.length > 0 && (
          <div className="mb-3">
            <Typography variant="subtitle2" className="mb-1">
              Người dùng đã chọn ({selectedUsers.length})
            </Typography>
            <div className="flex flex-wrap gap-1">
              {selectedUsers.map((user) => (
                <Chip
                  key={user.id || user.username}
                  avatar={
                    <Avatar alt={user.username}>
                      {user.username?.[0]?.toUpperCase()}
                    </Avatar>
                  }
                  label={user.username}
                  onDelete={() => removeSelectedUser(user)}
                  color="primary"
                  variant="outlined"
                  size="small"
                  className="mb-1"
                />
              ))}
            </div>
          </div>
        )}

        <TextField
          autoFocus
          margin="dense"
          fullWidth
          label="Tìm kiếm người dùng"
          value={searchTerm}
          onChange={handleInputChange}
          variant="outlined"
          placeholder="Nhập ít nhất 2 ký tự để tìm kiếm..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {loading && (
          <div className="my-4 flex justify-center">
            <CircularProgress size={24} />
          </div>
        )}

        {error && (
          <Typography color="error" className="mt-2">
            {error}
          </Typography>
        )}

        {!loading && users.length === 0 && searchTerm.length >= 2 && (
          <Typography className="my-4 text-center text-gray-500">
            Không tìm thấy người dùng
          </Typography>
        )}

        {users.length > 0 && (
          <List sx={{ pt: 1 }}>
            {users.map((user) => (
              <ListItem
                key={user.id || user.username}
                disablePadding
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={isUserSelected(user)}
                    onChange={() => handleToggleUser(user)}
                  />
                }
              >
                <ListItemButton onClick={() => handleToggleUser(user)} dense>
                  <ListItemAvatar>
                    <Avatar src={user.avatarUrl} alt={user.username}>
                      {user.username ? user.username[0].toUpperCase() : "?"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    secondary={user.fullName || user.email}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleCreateConversation}
          color="primary"
          variant="contained"
          disabled={selectedUsers.length === 0}
          startIcon={selectedUsers.length > 1 ? <Group /> : <Add />}
        >
          {selectedUsers.length > 1
            ? `Tạo nhóm (${selectedUsers.length} người)`
            : "Tạo cuộc trò chuyện"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSearchDialog;
