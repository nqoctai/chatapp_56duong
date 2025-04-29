import React, { useEffect, useRef, useState } from "react";
import ActiveUserList from "@components/ActiveUserList";
import { useWebSocket } from "@hooks/useWebSocket";
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

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [userSearchDialogOpen, setUserSearchDialogOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }, []);

  const { activeUsers } = useWebSocket(currentUser);

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

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // Load fake messages for the selected conversation
    setMessages([...conversation.lastMessage]);

    // Mark conversation as read (remove unread count)
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv,
      ),
    );

    // Close group info sidebar when changing conversations
    setShowGroupInfo(false);
  };

  const sendMessage = () => {
    if (newMessage.trim() === "" || !activeConversation) return;

    // Add the new message to the conversation
    const newMsg = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "me",
      timestamp: new Date(),
      senderName: currentUser?.username || "Tôi",
    };

    setMessages((prevMessages) => [...prevMessages, newMsg]);

    // Update last message in the conversation list
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: newMessage.trim(),
              timestamp: new Date(),
              formattedTime: "Bây giờ",
            }
          : conv,
      ),
    );

    setNewMessage(""); // Clear the input field
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

      // Tạo tin nhắn chào mừng
      const welcomeMessage = {
        id: Date.now(),
        text: `Chào mừng đến với nhóm ${newGroupChat.name}! Cuộc trò chuyện nhóm đã được tạo.`,
        sender: "system",
        timestamp: new Date(),
        senderName: "Hệ thống",
      };

      // Chọn cuộc trò chuyện mới
      setActiveConversation(newGroupChat);
      setMessages([welcomeMessage]);
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
        setMessages([]);
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
          <div className={`flex ${showGroupInfo ? "w-1/2" : "w-2/3"} flex-col`}>
            {/* Chat header with info button */}
            <ChatHeader
              conversation={activeConversation}
              onInfoClick={toggleGroupInfo}
            />

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto p-3"
              style={{ height: "calc(100vh - 200px)" }}
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="border-t p-3">
              <MessageInput
                value={newMessage}
                onChange={setNewMessage}
                onSend={sendMessage}
              />
            </div>
          </div>
        ) : (
          <div
            className={`flex ${showGroupInfo ? "w-1/2" : "w-2/3"} flex-col items-center justify-center bg-gray-50`}
          >
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 2 }}
            >
              <Send sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Chưa chọn cuộc trò chuyện
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ px: 4 }}
            >
              Chọn một người dùng từ danh sách bên trái để bắt đầu cuộc trò
              chuyện
            </Typography>
          </div>
        )}

        {/* Group Info Sidebar */}
        {showGroupInfo && activeConversation && (
          <div className="w-1/4">
            <GroupInfoSidebar
              conversation={activeConversation}
              onClose={() => setShowGroupInfo(false)}
            />
          </div>
        )}
      </div>

      {/* User Search Dialog */}
      <UserSearchDialog
        currentUser={currentUser}
        open={userSearchDialogOpen}
        onClose={() => setUserSearchDialogOpen(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
};

export default HomePage;
