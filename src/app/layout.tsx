import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/context/ToastContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";

export const metadata: Metadata = {
    title: "Chipset Computer - Chipset & Computer Store",
    description: "Pusat belanja chipset dan komputer terlengkap dengan harga terbaik",
};

import LogoutToast from "@/components/LogoutToast";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body className="antialiased">
                <ToastProvider>
                    <ConfirmationProvider>
                        <LogoutToast />
                        <Navbar />
                        {children}
                    </ConfirmationProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
