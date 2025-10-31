"use client";
import { motion, Variants } from "framer-motion";
import { useWeb3 } from "../context/Web3Context";
import { useEffect, useState, useRef } from "react";
import {
  ChartNoAxesColumn,
  Home,
  ShieldUser,
  UserRoundPen,
  Vote,
} from "lucide-react";
import { SideBarMenuType } from "@/types/types";
import Link from "next/link";

import {
  sidebarBg,
  sidebarFg,
  sidebarPrimary,
  sidebarPrimaryFg,
  sidebarAccent,
  sidebarAccentFg,
  sidebarBorder,
  sidebarRing,
} from "@/colors";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const { sideBarToggle, setSideBarToggle } = useWeb3();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const pathname: string = usePathname();

  const [sideBarMenu] = useState<SideBarMenuType[]>([
    { id: 1, name: "Home", icon: Home, path: "/" },
    { id: 2, name: "Vote", icon: Vote, path: "/vote" },
    { id: 3, name: "Results", icon: ChartNoAxesColumn, path: "/results" },
    { id: 4, name: "Profile", icon: UserRoundPen, path: "/profile" },
    { id: 5, name: "Admin", icon: ShieldUser, path: "/admin" },
  ]);

  useEffect(() => {
    const current = sideBarMenu.find((item) => item.path === pathname);
    if (current) setActiveId(current.id);
  }, [sideBarMenu, pathname]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      if (sideBarRef.current && !sideBarRef.current.contains(e.target as Node)) {
        if (sideBarToggle && isMobile) {
          setSideBarToggle(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {document.removeEventListener('mousedown', handleClickOutside)};
  }, [sideBarToggle, isMobile, setSideBarToggle])

  const sidebar_animation: Variants = {
    open: {
      width: "16rem",
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    closed: {
      width: isMobile ? 0 : "3rem",
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
  };


  return (
    <motion.div
      ref={sideBarRef}
      variants={sidebar_animation}
      initial={false}
      animate={sideBarToggle ? "open" : "closed"}
      className={`${isMobile ? "mt-27" : "p-1 mt-17"
        } z-50 max-w-[16rem] w-[16rem] fixed overflow-hidden h-screen`}
      style={{
        backgroundColor: sidebarBg,
        color: sidebarFg,
        borderRight: `1px solid ${sidebarBorder}`,
      }}
    >
      <div className={`${!sideBarToggle && !isMobile ? 'sm:px-0' : 'px-3'} flex flex-col mt-6 `}>
        {sideBarMenu.map((s) => {
          const isActive = s.id === activeId;
          return (
            <Link
              key={s.id}
              href={s.path}
              onClick={() => setActiveId(s.id)}
              className={`
                group flex items-center
                ${sideBarToggle ? "px-10 py-3" : "p-3 justify-center"}
                mb-4 rounded-2xl
                transition-all duration-300 ease-in-out
                shadow-sm hover:shadow-md
              `}
              style={{
                background: isActive ? sidebarPrimary : sidebarAccent,
                color: isActive ? sidebarPrimaryFg : sidebarAccentFg,
                border: isActive
                  ? `1px solid ${sidebarRing}`
                  : "1px solid transparent",
              }}
            >
              <s.icon
                className={`
                  min-w-6 min-h-6
                  ${sideBarToggle ? "mr-4" : ""}
                  group-hover:scale-110 transition-transform duration-200
                `}
                style={{ color: isActive ? sidebarPrimaryFg : sidebarAccentFg }}
              />
              {sideBarToggle && (
                <span className="text-lg font-semibold tracking-wide whitespace-nowrap">
                  {s.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
