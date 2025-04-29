import { useEffect, useRef, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getOnlineUsers } from "@services/api";

const webSocketUrl = import.meta.env.VITE_BASE_URL + "api/ws";

export function useWebSocket(currentUser) {
  const [activeUsers, setActiveUsers] = useState([]);
  const stompClient = useRef(null);
  const activeUsersMap = useRef({});

  // Hàm gửi disconnect message
  const sendDisconnect = (client, user) => {
    if (client && client.connected && user && user.username) {
      try {
        client.send(
          "/app/user/disconnect",
          {},
          JSON.stringify(user)
        );
        console.log("Sent disconnect message for user:", user.username);
      } catch (error) {
        console.error("Error sending disconnect message:", error);
      }
    }
  };

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    // Initial fetch of online users
    const fetchOnlineUsers = async () => {
      try {
        const onlineUsers = await getOnlineUsers();
        // Set initial active users
        setActiveUsers(onlineUsers || []);

        // Update activeUsersMap
        if (onlineUsers && onlineUsers.length) {
          onlineUsers.forEach(user => {
            if (user.username) {
              activeUsersMap.current[user.username] = 'ONLINE';
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch online users:", error);
      }
    };

    fetchOnlineUsers();

    // Connect to websocket after fetching users
    const socket = new SockJS(webSocketUrl);
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        subscribeActive(client);
        sendConnect(client, currentUser);
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );

    stompClient.current = client;

    // Xử lý sự kiện beforeunload để gửi disconnect khi tab đóng
    const handleBeforeUnload = (event) => {
      // Gửi disconnect message tới server
      sendDisconnect(stompClient.current, currentUser);

      // Cho phép browser hiển thị dialog xác nhận
      event.preventDefault();
      // Message cho dialog (không còn được hỗ trợ bởi nhiều trình duyệt)
      event.returnValue = "";
    };

    // Đăng ký event listener khi component mount
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup khi component unmount
    return () => {
      // Gỡ bỏ event listener
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // // Gửi disconnect message và ngắt kết nối websocket
      // if (stompClient.current) {
      //   sendDisconnect(stompClient.current, currentUser);
      //   stompClient.current.disconnect(() => {
      //     console.log("WebSocket disconnected");
      //   });
      // }
    };
  }, [currentUser]);

  const subscribeActive = (client) => {
    client.subscribe("/topic/active", (message) => {
      const user = JSON.parse(message.body);
      console.log("Active user update:", user);
      handleActiveUsers(user);
    });
  };

  const handleActiveUsers = (user) => {
    if (!user || !user.username) return;

    setActiveUsers(prevUsers => {
      if (user.status === "OFFLINE") {
        // Remove user from activeUsersMap
        if (user.username) {
          delete activeUsersMap.current[user.username];
        }
        return prevUsers.filter(u => u.username !== user.username);
      }
      else if (!prevUsers.some(existingUser => existingUser.username === user.username)) {
        // Add new online user
        if (user.username) {
          activeUsersMap.current[user.username] = 'ONLINE';
        }
        return [...prevUsers, user];
      }
      return prevUsers;
    });
  };

  const sendConnect = (client, user) => {
    client.send("/app/user/connect", {}, JSON.stringify(user));
  };

  // Thêm hàm này để các component khác có thể sử dụng
  const isUserOnline = (username) => {
    return !!activeUsersMap.current[username];
  };

  return {
    activeUsers,
    isUserOnline,
    // Cho phép các component khác chủ động gọi disconnect khi cần
    sendDisconnect: () => sendDisconnect(stompClient.current, currentUser)
  };
}
