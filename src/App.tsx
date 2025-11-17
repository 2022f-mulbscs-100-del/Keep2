import {  RouterProvider } from "react-router-dom"
import router from "./Router"
import { NoteContext } from "./Context/noteContext"
import { SideBarProvider } from "./Context/sidebarContext"
import { NavbarProvider } from "./Context/navbarContext"
import { EditLabelProvider } from "./Context/editLabelContext"
import {  useLayoutEffect } from "react"
import { useTheme } from "./zustand/ThemeSwitcherStore"



function App() {
const {theme} = useTheme();
useLayoutEffect(() => {
  if(theme === "light"){
    document.documentElement.classList.remove("dark")
  }else{
    
    document.documentElement.classList.add(theme)
  }
},[theme])
      


   
  return (

    <EditLabelProvider>
      <NavbarProvider>
        <SideBarProvider>
          <NoteContext>
            <RouterProvider router={router} />
          </NoteContext>
        </SideBarProvider>
      </NavbarProvider>
    </EditLabelProvider>

  )
}

export default App

