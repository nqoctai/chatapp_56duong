import { useWebSocket } from "@hooks/useWebSocket";
import { Stomp } from "@stomp/stompjs";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [receivedUser, setReceivedUser] = useState(null);

  const { activeUser } = useWebSocket(currentUser);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("user>>", user);
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (activeUser) {
      console.log(activeUser);
      setReceivedUser(activeUser);
    }
  }, [activeUser]);

  return (
    <div>
      <h1>Messages</h1>
      {receivedUser && (
        <div>
          <p>Active User: {receivedUser.username}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
