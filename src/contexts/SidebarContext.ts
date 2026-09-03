import { createContext } from "react";

export interface SidebarContextValue {
    collapsed: boolean;
    toggleSidebar: () => void;
}

export const SidebarContext =
    createContext<SidebarContextValue | null>(null);