import React, { useEffect, useState } from "react";
import ActiveUserList from "@components/ActiveUserList";
import {
  TextField,
  InputAdornment,
  List,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { Search, Send, AddCircleOutline, Group } from "@mui/icons-material";
import ChatHeader from "@components/Chat/ChatHeader";
import ChatMessage from "@components/Chat/ChatMessage";
import ConversationItem from "@components/Chat/ConversationItem";
import MessageInput from "@components/Chat/MessageInput";
import UserSearchDialog from "@components/Dialog/UserSearchDialog";
import GroupInfoSidebar from "@components/Chat/GroupInfoSidebar";
import { findMessageRoomAtLeastOneContent } from "@services/api";
import MessageList from "@components/Chat/MessageList";
import { useWebSocketContext } from "@context/SocketContext";

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [userSearchDialogOpen, setUserSearchDialogOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }, []);

  const {
    activeUsers,
    connected,
    messages: wsMessages,
  } = useWebSocketContext();

  // Thêm debug log để theo dõi kết nối WebSocket
  useEffect(() => {
    console.log("WebSocket connected:", connected);
    if (wsMessages?.length > 0) {
      console.log("WebSocket messages:", wsMessages);
    }
  }, [connected, wsMessages]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUser?.username) return;

      try {
        const response = await findMessageRoomAtLeastOneContent(
          currentUser.username,
        );
        if (response && Array.isArray(response)) {
          // Format rooms data for display
          const formattedRooms = response.map((room) => {
            // Extract usernames from member objects
            const memberUsernames = room.members
              ? room.members.map((member) => member.username)
              : [];

            // Get other user's username for direct chats
            const otherUsername = room.isGroup
              ? null
              : memberUsernames.find(
                  (username) => username !== currentUser.username,
                );

            return {
              id: room.id,
              name: room.isGroup
                ? room.name || "Nhóm chat"
                : otherUsername || "Chat",
              avatar: room.isGroup
                ? "https://img.icons8.com/color/48/000000/group-task.png"
                : "https://randomuser.me/api/portraits/lego/1.jpg",
              lastMessage: room.lastMessage,
              timestamp: new Date(room.createdDate),
              unread: 0,
              isOnline: true,
              isGroup: room.isGroup,
              members: memberUsernames,
              createdById: room.createdById,
              // Store the full member objects separately if needed
              memberDetails: room.members || [],
            };
          });

          setConversations(formattedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [currentUser]);

  const handleSelectConversation = (conversation) => {
    console.log("Selected conversation:", conversation);
    setActiveConversation(conversation);

    // Mark conversation as read (remove unread count)
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv,
      ),
    );

    // Close group info sidebar when changing conversations
    setShowGroupInfo(false);
  };

  // Xử lý khi người dùng chọn một hoặc nhiều user từ dialog
  const handleUserSelect = (users) => {
    // Kiểm tra xem đã chọn một người hay nhiều người
    const isGroupChat = users.length > 1;

    if (isGroupChat) {
      // Tạo cuộc trò chuyện nhóm mới
      const newGroupChat = {
        id: Date.now(),
        name: `Nhóm ${users.map((u) => u.username?.split(" ")[0]).join(", ")}`,
        avatar: "https://img.icons8.com/color/48/000000/group-task.png",
        lastMessage: "Đã tạo nhóm chat mới",
        timestamp: new Date(),
        unread: 0,
        isOnline: true,
        isGroup: true,
        members: [...users, currentUser], // Thêm người dùng hiện tại vào nhóm
      };

      // Thêm cuộc trò chuyện mới vào đầu danh sách
      setConversations((prev) => [newGroupChat, ...prev]);

      // Chọn cuộc trò chuyện mới
      setActiveConversation(newGroupChat);
    } else {
      // Trường hợp chỉ chọn một người
      const selectedUser = users[0];

      // Kiểm tra xem đã có cuộc trò chuyện với user này chưa
      const existingConversation = conversations.find(
        (conv) => conv.name === selectedUser.username && !conv.isGroup,
      );

      if (existingConversation) {
        // Nếu đã có, chọn cuộc trò chuyện đó
        handleSelectConversation(existingConversation);
      } else {
        // Nếu chưa có, tạo cuộc trò chuyện mới
        const newConversation = {
          id: Date.now(),
          name: selectedUser.username,
          avatar:
            selectedUser.avatarUrl ||
            "https://randomuser.me/api/portraits/lego/1.jpg",
          lastMessage: "Bắt đầu cuộc trò chuyện",
          timestamp: new Date(),
          unread: 0,
          isOnline: true,
        };

        // Thêm cuộc trò chuyện mới vào đầu danh sách
        setConversations((prev) => [newConversation, ...prev]);

        // Chọn cuộc trò chuyện mới
        setActiveConversation(newConversation);
      }
    }
  };

  const toggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };

  return (
    <div className="container mx-auto bg-white p-0">
      <div className="flex h-[calc(100vh-90px)] overflow-hidden rounded-lg shadow">
        {/* Conversations sidebar */}
        <div className={`${showGroupInfo ? "w-1/4" : "w-1/3"} border-r`}>
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Avatar className="!bg-primary-main">
                {currentUser?.username?.[0]?.toUpperCase()}
              </Avatar>
              <p className="font-bold">{currentUser?.username}</p>
            </div>
            <IconButton
              color="primary"
              className="ml-2"
              onClick={() => setUserSearchDialogOpen(true)}
              title="Tạo cuộc trò chuyện mới"
            >
              <AddCircleOutline />
            </IconButton>
          </div>
          <ActiveUserList currentUser={currentUser} activeUsers={activeUsers} />
          <List className="h-[calc(100vh-200px)] overflow-y-auto">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation?.id === conversation.id}
                onClick={handleSelectConversation}
              />
            ))}
          </List>
        </div>

        {/* Chat area */}
        {activeConversation ? (
          <div
            className={`flex ${showGroupInfo ? "w-1/2" : "w-2/3"} h-full flex-col`}
          >
            {/* Chat header with info button - Explicit z-index and position to ensure visibility */}
            <div className="chat-header-wrapper z-10 bg-white">
              <ChatHeader
                conversation={activeConversation}
                onInfoClick={toggleGroupInfo}
              />
            </div>

            {/* Messages area - Make sure it doesn't overflow the header */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <MessageList
                roomId={activeConversation?.id}
                currentUser={currentUser?.username}
              />
            </div>

            {/* Message input */}
            <div className="border-t p-3">
              <MessageInput
                roomId={activeConversation?.id}
                currentUser={currentUser?.username}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-2/3 items-center justify-center bg-gray-50">
            <div className="text-center">
              <Group className="mb-4 !h-16 !w-16 text-gray-400" />
              <Typography variant="h6" className="text-gray-500">
                Chọn một cuộc trò chuyện để bắt đầu
              </Typography>
            </div>
          </div>
        )}

        {/* Group info sidebar */}
        {showGroupInfo && activeConversation && (
          <GroupInfoSidebar
            conversation={activeConversation}
            onClose={toggleGroupInfo}
          />
        )}
      </div>

      {/* User search dialog */}
      <UserSearchDialog
        open={userSearchDialogOpen}
        onClose={() => setUserSearchDialogOpen(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
};

export default HomePage;
