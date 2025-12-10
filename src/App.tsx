import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { NoteContext } from "./Context/noteContext";
import { SideBarProvider } from "./Context/sidebarContext";
import { NavbarProvider } from "./Context/navbarContext";
import { EditLabelProvider } from "./Context/editLabelContext";
import { useLayoutEffect } from "react";
import { useTheme } from "./Context/themeSwitcherContext";
import { ToastContainer } from "react-toastify";
import { ThemeSwitcherProvider } from "./Context/themeSwitcherContext";
import { UserProvider } from "./Context/UserContext";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  useLayoutEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);
  return <>{children}</>;
};
function App() {
  return (
    <ThemeSwitcherProvider>
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
    </ThemeSwitcherProvider>
  );
}

export default App;
