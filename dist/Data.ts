import { PiTextAUnderlineBold } from "react-icons/pi";
import { IoIosColorPalette } from "react-icons/io";
import { BiSolidBellPlus } from "react-icons/bi";
import { IoMdArchive } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaImage } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";

const IconsArray = [
        {
            id: 1,
            title:"Formatting options",
            icon: PiTextAUnderlineBold
        },
        {
            title:"Background",
            id: 2,
            icon: IoIosColorPalette
        },
        {
title:"Remind me",
            id: 3,
            icon: BiSolidBellPlus
        },
        {
            title:"Add image",
            id: 4,
            icon: FaImage
        },
        {title:"Archive",
            id: 5,
            icon: IoMdArchive
        },
        {title:"More",
            id: 6,
            icon: BsThreeDotsVertical
        },

    ];

    const DeleteIconsArray = [
        {
            id: 1,
            icon: MdDeleteForever
        },
        {
            id: 2,
            icon: MdDeleteSweep
        }]
    

    export default IconsArray;
export { DeleteIconsArray };