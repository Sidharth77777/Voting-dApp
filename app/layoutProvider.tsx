"use client"

import Header from "./_components/Header";
import SideBar from "./_components/SideBar";
import { ToastProvider } from "./_components/Toast";
import { useState, useEffect } from "react";
import { useWeb3 } from "./context/Web3Context";
import { motion } from "framer-motion";

export default function LayoutProvider({children}: {children: React.ReactNode}) {
    const [isMobile, setIsMobile] = useState(false);
    const {sideBarToggle} = useWeb3();

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
            <motion.div
                key="content-wrapper"
                initial={false}
                animate={{
                    marginLeft: sideBarToggle && !isMobile ? "16rem" : "", marginRight: isMobile ? "0" : "2rem", opacity: 1,}}
                    transition={{ stiffness: 80, damping: 20, duration: 0.1,}}
                    className={`${isMobile ? "" : "mx-12"} transition-all duration-300`}
                >
                <ToastProvider>
                    {children}
                </ToastProvider>
            </motion.div>
        </div>
    )
}