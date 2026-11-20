import { createContext } from "react";

export interface SidebarContextValue {
    collapsed: boolean;
    toggleSidebar: () => void;

    mobileOpen: boolean;
    openMobile: () => void;
    closeMobile: () => void;
}

export const SidebarContext =
    createContext<SidebarContextValue | null>(null);
