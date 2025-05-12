import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getOnlineUsers } from "@services/api";

const WebSocketContext = createContext(null);
// const socketUrl = import.meta.env.VITE_BASE_URL + "api/ws";
const socketUrl = "http://localhost:8080/api/ws"; // Sử dụng URL cố định để tránh lỗi cấu hình

export const WebSocketProvider = ({ currentUser, children }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const stompClient = useRef(null);
  const activeUsersMap = useRef({});

  const sendDisconnect = (client, user) => {
    if (client?.connected && user?.username) {
      try {
        client.send("/app/user/disconnect", {}, JSON.stringify(user));
        console.log("🚪 Sent disconnect:", user.username);
      } catch (err) {
        console.error("❌ Disconnect error:", err);
      }
    }
  };

  useEffect(() => {
    if (!currentUser?.username) return;

    const fetchOnlineUsers = async () => {
      try {
        const onlineUsers = await getOnlineUsers();
        setActiveUsers(onlineUsers || []);
        onlineUsers?.forEach((u) => {
          if (u.username) activeUsersMap.current[u.username] = "ONLINE";
        });
      } catch (err) {
        console.error("❌ Fetch users failed:", err);
      }
    };

    fetchOnlineUsers();

    const socket = new SockJS(socketUrl);
    const client = Stomp.over(socket);

    stompClient.current = client;
    client.connect(
      {},
      () => {
        console.log("✅ WebSocket connected");
        setConnected(true);

        // Subscribe nhận người dùng online
        client.subscribe("/topic/active", (message) => {
          const user = JSON.parse(message.body);
          handleActiveUsers(user);
        });

        // Subscribe nhận tin nhắn mới
        client.subscribe(
          `/user/${currentUser.username}/queue/messages`,
          (message) => {
            console.log("📩 Raw message received:", message);
            const data = JSON.parse(message.body);
            console.log("📩 Parsed message data:", data);

            // Thêm tin nhắn mới vào state
            setMessages((prevMessages) => {
              // Kiểm tra xem tin nhắn đã có trong danh sách chưa để tránh trùng lặp
              const exists = prevMessages.some((msg) => msg.id === data.id);
              if (exists) {
                return prevMessages;
              }
              return [...prevMessages, data];
            });

            // Phát sự kiện cho các component khác cũng có thể nhận tin nhắn
            window.dispatchEvent(
              new CustomEvent("newMessage", { detail: data }),
            );
          },
        );

        // Gửi connect
        client.send("/app/user/connect", {}, JSON.stringify(currentUser));
      },
      (err) => {
        console.error("❌ WebSocket error:", err);
      },
    );

    const handleBeforeUnload = (event) => {
      sendDisconnect(client, currentUser);
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Người dùng rời trang - gửi disconnect nhưng KHÔNG ngắt kết nối WebSocket
      // vì có thể họ chỉ đang chuyển trang nội bộ trong ứng dụng
      if (client?.connected) {
        sendDisconnect(client, currentUser);
        console.log("🔄 User navigated away, but keeping WebSocket connection");
        // KHÔNG disconnect ở đây để tránh mất kết nối khi chuyển giữa các phòng chat
        // client.disconnect(() => {
        //   console.log("🔌 WebSocket disconnected");
        // });
      }
    };
  }, [currentUser]);

  const handleActiveUsers = (user) => {
    if (!user?.username) return;

    setActiveUsers((prev) => {
      if (user.status === "OFFLINE") {
        delete activeUsersMap.current[user.username];
        return prev.filter((u) => u.username !== user.username);
      } else if (!prev.some((u) => u.username === user.username)) {
        activeUsersMap.current[user.username] = "ONLINE";
        return [...prev, user];
      }
      return prev;
    });
  };

  const isUserOnline = (username) => !!activeUsersMap.current[username];

  const sendMessage = (message) => {
    if (stompClient.current?.connected) {
      try {
        console.log("📤 Sending message to WebSocket:", message);
        stompClient.current.send(
          "/app/send-message",
          {},
          JSON.stringify(message),
        );
        return true;
      } catch (err) {
        console.error("❌ Error sending message:", err);
        return false;
      }
    } else {
      console.warn("⚠️ STOMP chưa kết nối, không thể gửi tin nhắn.");
      return false;
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        activeUsers,
        isUserOnline,
        connected,
        messages,
        sendMessage,
        sendDisconnect: () => sendDisconnect(stompClient.current, currentUser),
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
