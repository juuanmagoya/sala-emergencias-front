import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

interface QueryProviderProps {
    children: ReactNode;
}

export default function QueryProvider({
    children,
}: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}

            <Toaster />
        </QueryClientProvider>
    );
}