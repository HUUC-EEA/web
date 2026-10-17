"use client";

import { useEffect } from "react";

/** 位移超过这个像素才接管手势，点按与横滑交还浏览器 */
const TAKE_OVER_PX = 10;
/** 松手速度超过这个值（px/ms）判为甩动，此时严格只翻一屏 */
const FLING_VELOCITY = 0.45;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/**
 * 触屏翻页控制器：一次手势只翻一屏。
 *
 * 原生 mandatory 吸附会把甩动惯性折算成好几屏，用户轻轻一划就连跳数页。
 * 这里在触屏设备上关掉吸附，改为滚动位置跟随手指，松手时按速度只前进或
 * 后退一个档位，剩下的位移交给平滑滚动补成翻页动画。
 */
export default function MobilePager() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    let docMax = 0;
    let steps: number[] = [];

    const measure = () => {
      const vh = window.innerHeight;
      docMax = Math.max(
        0,
        document.documentElement.scrollHeight - vh
      );
      const list: number[] = [0, docMax];
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>("[data-page]")
      )) {
        const top = Math.round(el.offsetTop);
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

    const nearestStep = (y: number) => {
      let best = 0;
      for (let i = 1; i < steps.length; i++) {
        if (Math.abs(steps[i] - y) < Math.abs(steps[best] - y)) best = i;
      }
      return best;
    };

    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let startStep = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let gesture = false;
    let taken = false;

    const onTouchStart = (e: TouchEvent) => {
      gesture = false;
      taken = false;
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
      lastY = touch.clientY;
      lastT = e.timeStamp;
      startScroll = window.scrollY;
      startStep = nearestStep(startScroll);
      velocity = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!gesture || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dy = touch.clientY - startY;
      if (!taken) {
        if (
          Math.abs(dy) < TAKE_OVER_PX ||
          Math.abs(touch.clientX - startX) > Math.abs(dy)
        ) {
          return;
        }
        taken = true;
      }
      e.preventDefault();
      const dt = e.timeStamp - lastT;
      if (dt > 0) velocity = (lastY - touch.clientY) / dt;
      lastT = e.timeStamp;
      lastY = touch.clientY;
      window.scrollTo({
        top: clamp(startScroll - dy, 0, docMax),
        behavior: "instant",
      });
    };

    const onTouchEnd = () => {
      if (!gesture) return;
      const didPan = taken;
      gesture = false;
      taken = false;
      if (!didPan) return;
      const dir =
        velocity > FLING_VELOCITY ? 1 : velocity < -FLING_VELOCITY ? -1 : 0;
      const target =
        dir !== 0
          ? clamp(startStep + dir, 0, steps.length - 1)
          : nearestStep(window.scrollY);
      window.scrollTo({ top: steps[target], behavior: "smooth" });
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return null;
}
