import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="text-dark-100">
      <Suspense fallback={<div>Loading....</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootLayout;
