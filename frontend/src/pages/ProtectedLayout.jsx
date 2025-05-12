import { WebSocketProvider } from "@context/SocketContext";
import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <WebSocketProvider currentUser={user}>
      <div>
        <div className="bg-dark-200">
          <Outlet />
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default ProtectedLayout;
