"use client"
import { motion } from "framer-motion"
import { useWeb3 } from "../context/Web3Context";
import { useEffect, useState } from "react";

export default function SideBar() {
    const {sideBarToggle} = useWeb3();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[])
    
    let sidebar_animation = {
        open: {
            width: '16rem',
            transition: {
                damping: 40,
            }
        },
        closed: {
            width: isMobile ? 0 : '3rem',
            transition: {
                damping: 40,
            },
        }
    }


    return (
        <motion.div 
        variants={sidebar_animation} 
        animate={sideBarToggle ? "open" : "closed"}
        className={`${isMobile ? '' : 'p-2'} bg-[#101625]  z-49 text-[#e2e2f5] max-w-[16rem] w-[16rem] mt-17 fixed overflow-hidden h-screen border-[#303052] border-r`}>
            kh
        </motion.div>
    )
}