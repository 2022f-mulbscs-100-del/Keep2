import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NoteContext } from "./Context/noteContext";
import { SideBarProvider } from "./Context/sidebarContext";
import { NavbarProvider } from "./Context/navbarContext";
import { EditLabelProvider } from "./Context/editLabelContext";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useTheme } from "./Context/themeSwitcherContext";
import { ToastContainer } from "react-toastify";
import { ThemeSwitcherProvider } from "./Context/themeSwitcherContext";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { UserProvider, useUser } from "./Context/UserContext";
import axiosClient from "./api/axiosClient";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  useLayoutEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { userData, setUserData } = useAuth();
  const { profileData } = useUser();
  useEffect(() => {
    const logoutUser = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      sessionStorage.removeItem("accessToken");
      setUserData(null);

      axiosClient
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
          withCredentials: true,
        })
        .then(() => {})
        .catch((error) => {
          console.error("Error during logout:", error);
        });
      window.location.reload();
    };
    const resetTimer = () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);

        // axios.post("https://keep2-d798.onrender.com/api/auto-logout",{autoLogoutTime: 1}, { withCredentials: true,
        //   headers:
        //     {
        //       Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        //     }.

        //  }).then(() => {}).catch((error) => {
        //   console.error("Error refreshing token:", error);
        // });
      }

      intervalRef.current = setTimeout(
        () => {
          logoutUser();
        },
        profileData?.autoLogoutTime
          ? profileData?.autoLogoutTime * 60 * 1000
          : 7 * 24 * 60 * 60 * 1000,
      );

      // const timestamp = Date.now() + 1000 * 10 * 1;
      // localStorage.setItem("lastActivityTime", timestamp.toString());
    };

    const handleUserActivity = () => {
      resetTimer();
    };

    const USER_ACTIVITY_EVENTS = [
      "mousemove",
      "click",
      "keydown",
      "scroll",
      "touchstart",
    ];

    if (userData && profileData?.autoLogoutEnabled) {
      USER_ACTIVITY_EVENTS.forEach((event) =>
        window.addEventListener(event, handleUserActivity as EventListener),
      );
    }
    return () => {
      USER_ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleUserActivity as EventListener),
      );
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [userData, profileData]);

  return <>{children}</>;
};
function App() {
  return (
    <ThemeSwitcherProvider>
      <AuthProvider>
        <UserProvider>
          <EditLabelProvider>
            <NavbarProvider>
              <SideBarProvider>
                <NoteContext>
                  <ToastContainer
                    position="bottom-left"
                    autoClose={4000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                  />
                  <LayoutWrapper>
                    <RouterProvider router={router} />
                  </LayoutWrapper>
                </NoteContext>
              </SideBarProvider>
            </NavbarProvider>
          </EditLabelProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeSwitcherProvider>
  );
}

export default App;
