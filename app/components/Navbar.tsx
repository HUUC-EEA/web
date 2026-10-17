"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JOIN_URL } from "../links";

const NAV_LINKS = [
  { label: "首页", href: "#home", num: "01." },
  { label: "关于我们", href: "#about", num: "02." },
  { label: "社团仓库", href: "#repo", num: "03." },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      // 下滑隐藏、上滑显示
      if (y > lastY && y > 120 && !menuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Escape 关闭移动端菜单
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`geek-navbar fixed top-0 inset-x-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="w-full h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="#home" className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38ef7d] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#38ef7d]" />
          </span>
          <span className="font-pixel text-xs sm:text-2xl tracking-[1px] sm:tracking-[2px] text-neutral-100 group-hover:text-white transition-colors">
            河南城建学院电子爱好者协会
          </span>
          <span className="hidden lg:inline-flex font-pixel text-2xl px-2 py-0.5 rounded bg-[#38ef7d]/10 text-[#38ef7d] border border-[#38ef7d]/40 tracking-[2px] shadow-[0_0_10px_rgba(56,239,125,0.15)]">
            HUUCEEA
          </span>
        </Link>

        {/* 桌面导航：菜单项用像素字体原生 12px，与 24px 品牌名形成层级差 */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 font-pixel text-xs">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-item tracking-[1px] py-1">
              <span className="text-[#38ef7d]/70 mr-1">{link.num}</span>
              {link.label}
            </a>
          ))}
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="join-cta-btn text-xs tracking-[1px] px-3 py-1.5 rounded"
          >
            + 加入我们
          </a>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="切换菜单"
          aria-expanded={menuOpen}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-neutral-300"
        >
          <div className="space-y-1.5">
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* 移动端抽屉菜单 */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-1 flex flex-col gap-1 font-pixel text-xs sm:text-2xl tracking-[1px] sm:tracking-[2px]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded text-neutral-400 hover:text-[#38ef7d] hover:bg-[#38ef7d]/5 transition-colors"
            >
              <span className="text-[#38ef7d]/70 mr-2">{link.num}</span>
              {link.label}
            </a>
          ))}
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2.5 rounded text-[#38ef7d] hover:bg-[#38ef7d]/5 transition-colors"
          >
            + 加入我们
          </a>
        </div>
      </div>
    </header>
  );
}
