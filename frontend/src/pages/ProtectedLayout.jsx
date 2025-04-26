import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div>
      <div className="bg-dark-200">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
