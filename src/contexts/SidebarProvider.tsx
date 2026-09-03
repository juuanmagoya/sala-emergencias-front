import {
    useState,
    type ReactNode,
} from "react";

import { SidebarContext } from "./SidebarContext";

interface SidebarProviderProps {
    children: ReactNode;
}

export function SidebarProvider({
    children,
}: SidebarProviderProps) {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed((current) => !current);
    };

    return (
        <SidebarContext.Provider
            value={{
                collapsed,
                toggleSidebar,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}