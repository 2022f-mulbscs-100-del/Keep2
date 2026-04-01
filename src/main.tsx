import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./Context/AuthContext.tsx";
import { UserProvider } from "./Context/UserContext.tsx";
import { EditLabelProvider } from "./Context/editLabelContext.tsx";
import { NavbarProvider } from "./Context/navbarContext.tsx";
import { SideBarProvider } from "./Context/sidebarContext.tsx";
import { NoteContext } from "./Context/noteContext.tsx";
import { LanguageProvider } from "./Context/LanguageContext.tsx";
import "./i18n/i18n.ts";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AuthProvider>
      <UserProvider>
        <EditLabelProvider>
          <NavbarProvider>
            <SideBarProvider>
              <NoteContext>
                <App />
              </NoteContext>
            </SideBarProvider>
          </NavbarProvider>
        </EditLabelProvider>
      </UserProvider>
    </AuthProvider>
  </LanguageProvider>,
);
