import { PiTextAUnderlineBold } from "react-icons/pi";
import { IoIosColorPalette } from "react-icons/io";
import { BiSolidBellPlus } from "react-icons/bi";
import { IoMdArchive } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";

const IconsArray = [
    {
        id: 1,
        tooltip: "Formatting options",
        icon: PiTextAUnderlineBold
    },
    {
        tooltip: "Background",
        id: 2,
        icon: IoIosColorPalette
    },
    {
        tooltip: "Add Collaborator",
        id: 7,
        icon: MdPersonAddAlt1 
    },
    {
        tooltip: "Remind me",
        id: 3,
        icon: BiSolidBellPlus
    },
    {
        tooltip: "Add image",
        id: 4,
        icon: FaImage
    },
    {
        tooltip: "Archive",
        id: 5,
        icon: IoMdArchive
    },
    {
        tooltip: "Bin",
        id: 6,
        icon: MdDeleteForever,
       
    },

];

const DeleteIconsArray = [
    {
        id: 1,
        tooltip: "Delete forever",
        icon: MdDeleteForever
    },
    {
        id: 2,
        tooltip: "Restore",
        icon: MdDeleteSweep
    }]


export default IconsArray;
export { DeleteIconsArray };