"use client";

import { useEffect } from "react";

/** 手指竖向位移超过这个像素才接管，点按与横滑交还浏览器 */
const TAKE_OVER_PX = 6;
/** 甩动判定只看最近这段时间，慢拖靠位移决定方向 */
const FLING_WINDOW_MS = 90;
/** 松手速度超过这个值（px/ms）算甩动 */
const FLING_VELOCITY = 0.35;
/** 拖动超过 18% 屏高即算有翻页意图 */
const PAGE_RATIO = 0.18;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** expo-out：和站内交互动效同一手感 */
const easeOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * 触屏翻页控制器：一次手势只翻一屏。
 *
 * 原生 mandatory 吸附会把甩动惯性折算成好几屏，轻轻一划就连跳数页；
 * 这里接管触摸手势，让内容跟手移动，松手时只前进或后退一个档位，
 * 剩下的位移由 rAF 补成一段翻页动画，用户在每一屏都会停下来读完内容。
 * 挂载时给 <html> 打 pager-active 关掉原生吸附，脚本没跑起来就退回
 * CSS 吸附 + scroll-snap-stop 的兜底行为。
 */
export default function MobilePager() {
  useEffect(() => {
    // 与 globals.css 同一判定：没有悬停能力的设备才由这里接管
    if (!window.matchMedia("(hover: none)").matches) return;

    const root = document.documentElement;
    let vh = window.innerHeight;
    let docMax = 0;
    let steps: number[] = [];

    const measure = () => {
      vh = window.innerHeight;
      docMax = Math.max(
        0,
        document.documentElement.scrollHeight - vh
      );
      const list: number[] = [0, docMax];
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>("[data-page]")
      )) {
        const top = Math.round(
          el.getBoundingClientRect().top + window.scrollY
        );
        if (top <= 0 || top >= docMax) continue;
        list.push(top);
        /** 区块比视口高时补中间档位，否则多出来的内容永远翻不到 */
        const bottom = Math.min(top + el.offsetHeight - vh, docMax);
        for (let t = top + vh; t <= bottom - vh * 0.25; t += vh) {
          list.push(Math.round(t));
        }
      }
      steps = Array.from(
        new Set(list.filter((t) => t >= 0 && t <= docMax))
      ).sort((a, b) => a - b);
    };

    const stepAt = (y: number) => {
      let best = 0;
      for (let i = 1; i < steps.length; i++) {
        if (Math.abs(steps[i] - y) < Math.abs(steps[best] - y)) best = i;
      }
      return best;
    };

    let raf = 0;
    const stopAnim = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const jump = (top: number) =>
      window.scrollTo({ top, behavior: "instant" });

    const animateTo = (target: number) => {
      stopAnim();
      const from = window.scrollY;
      const dist = Math.abs(target - from);
      if (
        dist < 2 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        jump(target);
        return;
      }
      const duration = clamp(300 + dist * 0.3, 320, 620);
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = clamp((now - t0) / duration, 0, 1);
        jump(from + (target - from) * easeOut(p));
        raf = p < 1 ? requestAnimationFrame(tick) : 0;
      };
      raf = requestAnimationFrame(tick);
    };

    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let startStep = 0;
    let gesture = false;
    let taken = false;
    const samples: { y: number; t: number }[] = [];

    const onTouchStart = (e: TouchEvent) => {
      gesture = false;
      taken = false;
      stopAnim();
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const el = touch.target as HTMLElement | null;
      /** 导航栏与抽屉里的手势不做翻页判定 */
      if (el?.closest("header")) return;
      measure();
      if (steps.length < 2) return;
      gesture = true;
      startX = touch.clientX;
      startY = touch.clientY;
      startScroll = window.scrollY;
      startStep = stepAt(startScroll);
      samples.length = 0;
      samples.push({ y: touch.clientY, t: e.timeStamp });
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!gesture || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dy = touch.clientY - startY;
      if (!taken) {
        if (Math.abs(dy) < TAKE_OVER_PX) return;
        /** 横向手势整个交还浏览器 */
        if (Math.abs(touch.clientX - startX) > Math.abs(dy)) {
          gesture = false;
          return;
        }
        taken = true;
      }
      e.preventDefault();
      samples.push({ y: touch.clientY, t: e.timeStamp });
      if (samples.length > 12) samples.shift();
      jump(clamp(startScroll - dy, 0, docMax));
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!gesture) return;
      const didPan = taken;
      gesture = false;
      taken = false;
      if (!didPan || !samples.length) return;
      const now = e.timeStamp;
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = now - first.t;
      const velocity =
        dt > 0 && now - last.t < FLING_WINDOW_MS
          ? (first.y - last.y) / dt
          : 0;
      const moved = window.scrollY - startScroll;
      const dir =
        Math.abs(velocity) > FLING_VELOCITY
          ? Math.sign(velocity)
          : Math.abs(moved) > vh * PAGE_RATIO
            ? Math.sign(moved)
            : 0;
      /** 只推进一个档位：甩得再狠也只是一屏一屏地翻 */
      const target =
        dir === 0
          ? stepAt(window.scrollY)
          : clamp(startStep + dir, 0, steps.length - 1);
      animateTo(steps[target]);
    };

    root.classList.add("pager-active");
    window.addEventListener("touchstart", onTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", onTouchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchend", onTouchEnd, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchcancel", onTouchEnd, {
      passive: true,
      capture: true,
    });

    return () => {
      stopAnim();
      root.classList.remove("pager-active");
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("touchend", onTouchEnd, { capture: true });
      window.removeEventListener("touchcancel", onTouchEnd, { capture: true });
    };
  }, []);

  return null;
}
