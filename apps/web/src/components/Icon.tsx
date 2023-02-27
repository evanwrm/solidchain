import { IconTypes } from "solid-icons";
import { BsFiletypePdf, BsFiletypeTxt } from "solid-icons/bs";
import {
    HiOutlineChatAlt,
    HiOutlineDocument,
    HiOutlineMicrophone,
    HiOutlineSelector,
    HiSolidCheck,
    HiSolidChevronDoubleLeft,
    HiSolidChevronDoubleRight,
    HiSolidChevronDown,
    HiSolidChevronLeft,
    HiSolidChevronRight,
    HiSolidChevronUp,
    HiSolidMoon,
    HiSolidPaperAirplane,
    HiSolidSun,
    HiSolidX
} from "solid-icons/hi";
import { RiCommunicationChatSettingsLine } from "solid-icons/ri";
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from "solid-icons/ti";
import { VsCloudUpload, VsLoading } from "solid-icons/vs";

/**
 * Import only the icons needed
 * We lose the ability to use new icons on the fly (having to redeploy)
 * However this approach doesn't cause module loading for SSG
 */
const Icon = {
    // Theme
    HiSolidMoon,
    HiSolidSun,

    // Filetypes
    HiOutlineDocument,
    BsFiletypePdf,
    BsFiletypeTxt,

    // Extras
    RiCommunicationChatSettingsLine,
    HiOutlineChatAlt,
    HiSolidPaperAirplane,
    TiArrowUnsorted,
    TiArrowSortedUp,
    TiArrowSortedDown,
    HiSolidX,
    HiSolidCheck,
    HiOutlineSelector,
    HiSolidChevronUp,
    HiSolidChevronDown,
    HiSolidChevronLeft,
    HiSolidChevronRight,
    HiSolidChevronDoubleLeft,
    HiSolidChevronDoubleRight,
    HiOutlineMicrophone,
    VsCloudUpload,
    VsLoading
};

const iconAliases = {
    BsFiletypePdf: ["pdf"],
    BsFiletypeTxt: ["txt"]
};

export const getIconAliased = (icon: string): IconTypes | null => {
    if (icon in Icon) return (Icon as any)[icon];

    const iconQuery = icon.toLowerCase();
    for (const [key, value] of Object.entries(iconAliases)) {
        if (key in Icon) {
            for (const alias of value) {
                if (iconQuery.includes(alias)) return (Icon as any)[key];
            }
        }
    }

    return null;
};

export default Icon;
