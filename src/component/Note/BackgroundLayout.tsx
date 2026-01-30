// import { useLocation, Routes, Route } from "react-router-dom";
// import Home from "../../Pages/Home/Home";
// import Bin from "../../Pages/Bin/Bin";
// import Archieve from "../../Pages/Archieve/Archieve";
// import NoteModal from "./NoteModal";

// export default function BackgroundLayout() {
//   const location = useLocation();
//   const state = location.state as {
//     backgroundLocation?: Location;
//   };

//   return (
//     <>
//       {state?.backgroundLocation && (
//         // bypassing background location route ignore the page and use the object we provide
//         <Routes location={state.backgroundLocation}>
//           <Route path="/" element={<Home />} />
//           <Route path="/bin" element={<Bin />} />
//           <Route path="/archieve" element={<Archieve />} />
//         </Routes>
//       )}

//       <div className="fixed inset-0 z-50 bg-black/50">
//         <NoteModal />
//       </div>
//     </>
//   );
// }
