import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import ErrorBoundary from "./ErrorHandling/ErrorBoundary";
import Home from "./Pages/Home/Home";
import Layout from "./Layout";
import NoteModal from "./component/Note/NoteModal";
import BackgroundLayout from "./component/Note/BackgroundLayout";
import Bin from "./Pages/Bin/Bin";
import Archieve from "./Pages/Archieve/Archieve";
import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Pages/Profile/Profile";
import Setting from "./Pages/Settings/Setting";
import SettingLayout from "./Pages/Profile/SettingLayout";
import PersonalInfo from "./Pages/Settings/Personal-info/PersonalInfo";
// import PublicRoute from "./PublicRoute";

interface ProviderWrapperProps {
  children: React.ReactNode;
}
//eslint-disable-next-line
const ProviderWrapper: React.FC<ProviderWrapperProps> = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProviderWrapper>
        <div />
      </ProviderWrapper>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes/:id",
        element: (
          <BackgroundLayout>
            <NoteModal />
          </BackgroundLayout>
        ),
      },
      {
        path: "/reminders",
        element: (
          <ProtectedRoute>
            <div>Reminders</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/editlabel",
        element: (
          <ProtectedRoute>
            <div>Edit Label</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/editlabel/:title",
      },
      {
        path: "/archieve",
        element: (
          <ProtectedRoute>
            <Archieve />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bin",
        element: (
          <ProtectedRoute>
            <Bin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          // <PublicRoute>
          <Login />
          // </PublicRoute>
        ),
      },
      {
        path: "/sign-up",
        element: (
          // <PublicRoute>
          <SignUp />
          // </PublicRoute>
        ),
      },
      {
        path: "/forget-password",
        element: (
          // <PublicRoute>
          <ForgetPassword />
          // </PublicRoute>
        ),
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <SettingLayout>
              <Profile />
            </SettingLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/setting/personal-info",
        element: (
          <ProtectedRoute>
            <SettingLayout>
              <PersonalInfo />
            </SettingLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/setting/:id",
        element: (
          <ProtectedRoute>
            <SettingLayout>
              <PersonalInfo />
            </SettingLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },
]);

export default router;
