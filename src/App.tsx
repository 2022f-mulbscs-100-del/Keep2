import { RouterProvider } from "react-router-dom"
import router from "./Router"
import { NoteContext } from "./Context/noteContext"
import { SideBarProvider } from "./Context/sidebarContext"
import { NavbarProvider } from "./Context/navbarContext"
import { EditLabelProvider } from "./Context/editLabelContext"
import { useLayoutEffect } from "react"
import { useTheme } from "./zustand/ThemeSwitcherStore"
import { ToastContainer } from "react-toastify"


function App() {
  const { theme } = useTheme();
  useLayoutEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark")
    } else {

      document.documentElement.classList.add(theme)
    }
  }, [theme])




  return (

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
            <RouterProvider router={router} />
          </NoteContext>
        </SideBarProvider>
      </NavbarProvider>
    </EditLabelProvider>

  )
}

export default App

