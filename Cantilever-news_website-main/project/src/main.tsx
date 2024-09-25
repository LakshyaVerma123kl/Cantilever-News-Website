import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./Authentication/mainsignin.tsx";
import Signup from "./Authentication/mainsignup.tsx";
import VerificationWindow from "./Authentication/verificationWindow.tsx";
import ResetPasswordPage from "./Authentication/resetPasswordPage.tsx";
import Home from "./MainPages/home.tsx";
import About from "./MainPages/about.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "login",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "verify",
        element: <VerificationWindow />,
      },
      {
        path: "resetPassword",
        element: <ResetPasswordPage />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
