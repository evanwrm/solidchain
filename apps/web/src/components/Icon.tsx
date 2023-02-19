import { IconTypes } from "solid-icons";
import { BsFiletypePdf, BsFiletypeTxt } from "solid-icons/bs";
import {
    HiOutlineDocument,
    HiOutlineUpload,
    HiSolidChevronDown,
    HiSolidChevronLeft,
    HiSolidChevronRight,
    HiSolidChevronUp,
    HiSolidMoon,
    HiSolidSun
} from "solid-icons/hi";

/**
 * Import only the icons needed
 * We lose the ability to use new icons on the fly (having to redeploy)
 * However this approach doesn't cause module loading for SSG
 */
const Icon = {
    // Theme
    HiSolidMoon,
    HiSolidSun,

    // Extras
    HiOutlineUpload,
    HiOutlineDocument,
    BsFiletypePdf,
    BsFiletypeTxt,
    HiSolidChevronUp,
    HiSolidChevronDown,
    HiSolidChevronLeft,
    HiSolidChevronRight
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
