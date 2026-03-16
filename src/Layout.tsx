import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Sidebar from "./component/sidebar/Sidebar";
import ReminderModal from "./component/Modal/ReminderModal";
import NoteModal from "./component/Note/NoteModal";
import { useModal } from "./Context/ModalProvider";
import CollaboratorModal from "./component/Modal/CollaboratorModal";

function Layout({ children }: { children: React.ReactNode }) {
  const { reminderModal, collaboratorModal } = useModal();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const noteParam = searchParams.get("note");

  return (
    <>
      <div className="flex flex-col">
        <div>
          <Navbar />
        </div>
        <div className="flex ">
          <div>
            <Sidebar />
          </div>
          <div
            className={`flex-1 ${pathname === "/login" || pathname === "/sign-up" || pathname === "/forget-password" ? "h-full" : "h-[calc(100vh-10vh)]"}  customScrollBar overflow-y-auto `}
          >
            {reminderModal && <ReminderModal />}
            {collaboratorModal && <CollaboratorModal />}
            {noteParam && <NoteModal />}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
