import React, { useEffect, useState, useRef } from "react";
import { getMessageContentsByRoomId } from "../../services/api";
import { useWebSocketContext } from "@context/SocketContext";
import ChatMessage from "./ChatMessage";

const MessageList = ({ roomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { messages: socketMessages } = useWebSocketContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return;

      setLoading(true);
      try {
        const response = await getMessageContentsByRoomId(roomId);
        setMessages(response || []);
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Theo dõi tin nhắn mới từ SocketContext
  useEffect(() => {
    if (socketMessages && socketMessages.length > 0) {
      // Lọc chỉ những tin nhắn thuộc về phòng chat hiện tại
      const newMessages = socketMessages.filter(
        (msg) => msg.messageRoomId === roomId,
      );

      if (newMessages.length > 0) {
        // Chỉ thêm tin nhắn mới vào danh sách hiện tại
        setMessages((prev) => {
          // Tạo Set các ID đã có
          const existingIds = new Set(prev.map((m) => m.id));
          // Thêm tin nhắn mới chưa có trong danh sách
          const uniqueNewMessages = newMessages.filter(
            (m) => !existingIds.has(m.id),
          );

          return [...prev, ...uniqueNewMessages];
        });
      }
    }
  }, [socketMessages, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper to get current username/email for comparison
  const getCurrentUserIdentifier = () => {
    if (!currentUser) return "";
    if (typeof currentUser === "string") return currentUser;
    return currentUser.username || currentUser.email || "";
  };

  const currentUserId = getCurrentUserIdentifier();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-main"></div>
          <p>Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.length === 0 && (
        <div className="my-8 text-center text-gray-500">
          <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isOwnMessage={message.sender === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
