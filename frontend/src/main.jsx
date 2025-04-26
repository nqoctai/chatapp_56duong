import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterPage from "@pages/auth/RegisterPage";
import LoginPage from "@pages/auth/LoginPage";
import RootLayout from "@pages/RootLayout";
import ProtectedLayout from "@pages/ProtectedLayout";
import HomePage from "@pages/HomePage";
import AuthLayout from "@pages/auth/AuthLayout";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
        ],
      },

      {
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {/* <App /> */}
    </QueryClientProvider>
  </StrictMode>,
);
