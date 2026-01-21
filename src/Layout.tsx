import { useLocation } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Sidebar from "./component/sidebar/Sidebar";
import ReminderModal from "./component/Modal/ReminderModal";
import { useModal } from "./Context/ModalProvider";

function Layout({ children }: { children: React.ReactNode }) {
  const { reminderModal } = useModal();
  const { pathname } = useLocation();

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
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
