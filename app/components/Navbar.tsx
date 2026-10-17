"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "首页", href: "#home", num: "01." },
  { label: "关于我们", href: "#about", num: "02." },
  { label: "社团项目", href: "#projects", num: "03." },
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
      <nav className="w-full h-14 px-4 sm:px-8 flex items-center justify-between">
        <Link href="#home" className="flex items-center gap-2.5 group focus:outline-none">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38ef7d] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#38ef7d]" />
          </span>
          <span className="font-cn text-sm sm:text-base font-medium tracking-wider text-neutral-100 group-hover:text-white transition-colors">
            河南城建学院电子爱好者协会
          </span>
          <span className="font-mono text-xs sm:text-sm font-semibold px-2 py-0.5 rounded bg-[#38ef7d]/10 text-[#38ef7d] border border-[#38ef7d]/40 tracking-widest shadow-[0_0_10px_rgba(56,239,125,0.15)]">
            HUUCEEA
          </span>
        </Link>

        {/* 桌面导航 */}
        <div className="hidden md:flex items-center gap-6 lg:gap-7 text-xs sm:text-sm font-cn">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-item font-medium tracking-wider py-1">
              <span className="font-mono text-[11px] text-[#38ef7d]/70 mr-1">{link.num}</span>
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            className="join-cta-btn font-cn font-semibold tracking-wider px-3.5 py-1.5 rounded"
          >
            + 加入我们
          </a>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="切换菜单"
          aria-expanded={menuOpen}
          className="md:hidden w-10 h-10 flex items-center justify-center text-neutral-300"
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
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-1 flex flex-col gap-1 font-cn text-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded text-neutral-400 hover:text-[#38ef7d] hover:bg-[#38ef7d]/5 transition-colors"
            >
              <span className="font-mono text-[11px] text-[#38ef7d]/70 mr-2">{link.num}</span>
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2.5 rounded text-[#38ef7d] hover:bg-[#38ef7d]/5 transition-colors"
          >
            <span className="font-mono text-[11px] text-[#38ef7d]/70 mr-2">04.</span>
            加入我们
          </a>
        </div>
      </div>
    </header>
  );
}
