"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "首页", href: "#home" },
  { label: "社团项目", href: "#projects" },
  { label: "关于我们", href: "#about" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);

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
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav
        className={`nav-glass transition-all duration-500 ${
          scrolled
            ? "bg-[#8BA6B4]/88 backdrop-blur-xl shadow-[0_12px_38px_-14px_rgba(31,59,104,0.34)]"
            : "bg-[#9DB6C2]/82 backdrop-blur-md"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="EEA 社团 Logo"
              width={36}
              height={36}
              className="w-9 h-9"
              priority
            />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-steel tracking-wide group-hover:text-navy transition-colors">
                电子爱好者协会
              </span>
              <span className="hidden sm:block text-[11px] text-steel/70">
                河南城建学院 · HUUC
              </span>
            </span>
          </Link>

          {/* 桌面 / 平板横屏导航 */}
          <div className="hidden md:flex items-center gap-8 text-sm text-steel/70">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 hover:text-navy transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-teal-blue after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#join"
              className="px-4 py-1.5 rounded-full bg-navy text-white text-xs font-medium hover:bg-steel transition-colors"
            >
              加入我们
            </a>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="切换菜单"
            aria-expanded={menuOpen}
            className="md:hidden w-10 h-10 flex items-center justify-center text-steel"
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
        </div>

        {/* 移动端抽屉菜单 */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 pb-5 pt-1 flex flex-col gap-1 bg-[#9DB6C2]/88 backdrop-blur-xl">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm text-steel/80 hover:bg-mist/40 hover:text-navy transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#join"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-navy hover:bg-mist/40 transition-colors"
            >
              加入我们
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
