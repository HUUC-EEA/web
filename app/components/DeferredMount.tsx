"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

/** 按区块隔离加载：进入视口附近才下载并挂载重区块，首屏 JS 不必为它们买单 */
const LOADERS = {
  neofetch: () => import("./NeofetchTerminal"),
} as const;

export type DeferredKey = keyof typeof LOADERS;

const LAZY: Record<DeferredKey, React.LazyExoticComponent<ComponentType>> = {
  neofetch: lazy(LOADERS.neofetch),
};

type DeferredMountProps = {
  which: DeferredKey;
  /** 加载前占位，需与真实内容高度接近以避免滚动吸附跳动 */
  fallback?: React.ReactNode;
};

export default function DeferredMount({ which, fallback }: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (el.getBoundingClientRect().top > window.innerHeight * 1.6) return;
      setNear(true);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [near]);

  const Lazy = LAZY[which];

  return (
    <div ref={ref} className="w-full">
      {near ? (
        <Suspense fallback={fallback ?? null}>
          <Lazy />
        </Suspense>
      ) : (
        (fallback ?? null)
      )}
    </div>
  );
}
