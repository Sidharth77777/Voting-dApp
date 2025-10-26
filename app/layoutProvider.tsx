"use client"

import Header from "./_components/Header";
import SideBar from "./_components/SideBar";
import { ToastProvider } from "./_components/Toast";
import { useState, useEffect } from "react";

export default function LayoutProvider({children}: {children: React.ReactNode}) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640)
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div>
            <SideBar />
            <Header />
            <div className={`${isMobile ? '' : 'mx-12'}`}>
            <ToastProvider>
            {children}
            </ToastProvider>
            </div>
        </div>
    )
}