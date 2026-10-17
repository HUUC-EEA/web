"use client";

import { useEffect, useRef } from "react";

type SnapSectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * 全屏滚动吸附区块：滚动离开时内容向上淡出并模糊，
 * 吸附到位后内容完全清晰。
 */
export default function SnapSection({ id, children, className }: SnapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const y = window.scrollY;
      const vh = window.innerHeight;

      // 区块高于视口时可自由滚动，此时保持清晰；
      // 只有在区块进入 / 离开视口边缘时才计算淡出进度
      let r = 0;
      if (y < top) {
        r = (y - top) / vh;
      } else if (y + vh > bottom) {
        r = (y + vh - bottom) / vh;
      }

      const abs = Math.min(Math.abs(r), 1);
      const opacity = Math.max(1 - abs * 1.4, 0);

      content.style.opacity = opacity.toFixed(3);
      content.style.transform = `translateY(${(-r * 90).toFixed(1)}px)`;
      content.style.filter = abs > 0.02 ? `blur(${(abs * 10).toFixed(1)}px)` : "none";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-page=""
      className={`snap-start min-h-screen flex items-center scroll-mt-0 ${className ?? ""}`}
    >
      <div ref={contentRef} className="w-full will-change-[opacity,transform,filter]">
        {children}
      </div>
    </section>
  );
}
