import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { SidebarContext } from "./SidebarContext";

interface SidebarProviderProps {
    children: ReactNode;
}

const DESKTOP_QUERY = "(min-width: 1024px)";

export function SidebarProvider({
    children,
}: SidebarProviderProps) {
    const [collapsed, setCollapsed] = useState(false);

    // El drawer móvil se controla aparte del colapso de escritorio.
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setCollapsed((current) => !current);
    }, []);

    const openMobile = useCallback(() => {
        setMobileOpen(true);
    }, []);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
    }, []);

    // Si el viewport pasa a desktop con el drawer abierto, se cierra
    // para no dejar un diálogo modal invisible bloqueando el scroll.
    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_QUERY);

        const handleChange = () => {
            if (mediaQuery.matches) {
                setMobileOpen(false);
            }
        };

        handleChange();

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener(
                "change",
                handleChange
            );
        };
    }, []);

    const value = useMemo(
        () => ({
            collapsed,
            toggleSidebar,
            mobileOpen,
            openMobile,
            closeMobile,
        }),
        [
            collapsed,
            toggleSidebar,
            mobileOpen,
            openMobile,
            closeMobile,
        ]
    );

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}
