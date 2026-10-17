"use client";

import { useEffect, useRef, useState } from "react";

type Bit = {
  val: string;
  echoVal: string;
  hasOverlay: boolean;
  flipRate: number;
};

type Stream = {
  cross: number;
  head: number;
  baseSpeed: number;
  fontSize: number;
  isForeground: boolean;
  charStep: number;
  bits: Bit[];
};

/** 各区块的数据流状态：neofetch 与 repo 内容占满宽度，需要让位 */
const SECTION_MODE: Record<string, "full" | "dim" | "off"> = {
  home: "full",
  neofetch: "off",
  about: "full",
  repo: "dim",
  join: "full",
};

/**
 * 0/1 二进制数据流渲染器。
 * axis = "y"：竖向数据流（桌面端左右两栏，dir -1 向上为 TX 绿，dir +1 向下为 RX 青）
 * axis = "x"：横向数据流（移动端上下两条，dir +1 向右，dir -1 向左）
 */
class BinaryStream {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private direction: -1 | 1;
  private axis: "x" | "y";
  private streams: Stream[] = [];
  private width = 0;
  private height = 0;
  private along = 0;
  private cross = 0;
  /** 被断点隐藏时尺寸为 0，跳过绘制 */
  private visible = false;

  constructor(canvas: HTMLCanvasElement, direction: -1 | 1, axis: "x" | "y") {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.direction = direction;
    this.axis = axis;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.visible = this.width > 1 && this.height > 1;
    if (!this.visible) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.along = this.axis === "y" ? this.height : this.width;
    this.cross = this.axis === "y" ? this.width : this.height;
    this.initStreams();
  }

  private initStreams() {
    this.streams = [];
    // 横向条带只有几十像素高，间距要收窄才不会挤成一团
    const spacing = this.cross < 90 ? 11 : 14;
    const count = Math.max(3, Math.floor((this.cross - 16) / spacing));

    for (let c = 0; c < count; c++) {
      for (let depth = 0; depth < 2; depth++) {
        const isForeground = depth === 1;
        const cross = 10 + c * spacing + (isForeground ? 3 : -2);
        const fontSize = isForeground ? 13 : 10;
        const baseSpeed = (isForeground ? 1.35 : 0.72) + Math.random() * 0.85;
        const packetLen = Math.floor(8 + Math.random() * 14);
        const bits: Bit[] = [];

        for (let k = 0; k < packetLen; k++) {
          bits.push({
            val: Math.random() > 0.5 ? "1" : "0",
            echoVal: Math.random() > 0.5 ? "0" : "1",
            hasOverlay: Math.random() > 0.35,
            flipRate: 0.016 + Math.random() * 0.04,
          });
        }

        this.streams.push({
          cross,
          head: Math.random() * this.along,
          baseSpeed,
          fontSize,
          isForeground,
          charStep: isForeground ? 14 : 11,
          bits,
        });
      }
    }
  }

  render(speedMultiplier: number, glowBoost: number) {
    if (!this.visible) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const isGreen = this.direction === -1;

    for (const s of this.streams) {
      s.head += this.direction * s.baseSpeed * speedMultiplier;

      const totalLen = s.bits.length * s.charStep;
      if (this.direction === -1 && s.head + totalLen < -30) {
        s.head = this.along + 25 + Math.random() * 40;
      } else if (this.direction === 1 && s.head - totalLen > this.along + 30) {
        s.head = -25 - Math.random() * 40;
      }

      ctx.font = `${s.isForeground ? "600" : "400"} ${s.fontSize}px "JetBrains Mono", monospace`;

      for (let j = 0; j < s.bits.length; j++) {
        const bit = s.bits[j];
        const along = s.head - this.direction * (j * s.charStep);
        if (along < -20 || along > this.along + 20) continue;

        if (Math.random() < bit.flipRate * (1 + glowBoost * 3)) {
          bit.val = bit.val === "1" ? "0" : "1";
          if (Math.random() < 0.5) {
            bit.echoVal = bit.val === "1" ? "0" : "1";
          }
        }

        const headRatio = 1 - j / s.bits.length;
        const alpha = s.isForeground
          ? Math.pow(headRatio, 1.25) * (0.76 + glowBoost * 0.24)
          : Math.pow(headRatio, 1.5) * (0.32 + glowBoost * 0.35);

        const x = this.axis === "y" ? s.cross : along;
        const y = this.axis === "y" ? along : s.cross;
        const echoCross = s.isForeground ? -4 : 3;
        const echoAlong = this.direction * (3 + glowBoost * 4);

        if (bit.hasOverlay || glowBoost > 0.2) {
          ctx.fillStyle = isGreen
            ? `rgba(56, 239, 125, ${(alpha * 0.44).toFixed(3)})`
            : `rgba(0, 245, 212, ${(alpha * 0.44).toFixed(3)})`;
          ctx.fillText(
            bit.echoVal,
            this.axis === "y" ? x + echoCross : x + echoAlong,
            this.axis === "y" ? y + echoAlong : y + echoCross
          );
        }

        if (j === 0 && s.isForeground) {
          ctx.fillStyle = `rgba(240, 255, 250, ${Math.min(1, alpha + 0.25).toFixed(3)})`;
        } else if (glowBoost > 0.35 && j < 3) {
          ctx.fillStyle = `rgba(0, 245, 212, ${Math.min(1, alpha + 0.2).toFixed(3)})`;
        } else if (isGreen) {
          ctx.fillStyle = s.isForeground
            ? `rgba(56, 239, 125, ${alpha.toFixed(3)})`
            : `rgba(120, 175, 145, ${alpha.toFixed(3)})`;
        } else {
          ctx.fillStyle = s.isForeground
            ? `rgba(0, 245, 212, ${(alpha * 0.92).toFixed(3)})`
            : `rgba(110, 170, 180, ${alpha.toFixed(3)})`;
        }

        ctx.fillText(bit.val, x, y);
      }
    }
  }
}

/**
 * 全站终端背景层：CRT 扫描线 + 二进制数据流。
 * 桌面端为左右两栏（TX ▲ / RX ▼），移动端改为上下两条横带，避免顶底留白。
 * 数据流随所在区块切换状态：neofetch 让位隐藏、repo 模糊压暗、其余正常流动；
 * 页面滚动时短暂 14x 冲刺并高光，随后平滑回落。
 */
export default function TerminalBackdrop() {
  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);
  const topRef = useRef<HTMLCanvasElement>(null);
  const bottomRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"full" | "dim" | "off">("full");
  const modeRef = useRef(mode);

  // 以视口中线落在哪个区块判定当前区块，据此切换数据流状态
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
    if (!sections.length) return;

    const update = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let currentId = sections[0].id;
      for (const section of sections) {
        if (section.offsetTop <= mid) currentId = section.id;
      }
      const next = SECTION_MODE[currentId] ?? "full";
      if (next === modeRef.current) return;
      modeRef.current = next;
      setMode(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const streams = [
      leftRef.current ? new BinaryStream(leftRef.current, -1, "y") : null,
      rightRef.current ? new BinaryStream(rightRef.current, 1, "y") : null,
      topRef.current ? new BinaryStream(topRef.current, 1, "x") : null,
      bottomRef.current ? new BinaryStream(bottomRef.current, -1, "x") : null,
    ].filter(Boolean) as BinaryStream[];

    const dynamics = { speed: 1, target: 1, glow: 0 };
    let surgeTimer = 0;
    let raf = 0;

    const onScroll = () => {
      // 滚动触发瞬间：14x 冲刺 + 高光，随后自然衰减
      dynamics.target = 14;
      dynamics.glow = 1;
      clearTimeout(surgeTimer);
      surgeTimer = window.setTimeout(() => {
        dynamics.target = 1;
        dynamics.glow = 0;
      }, 420);
    };

    const loop = () => {
      dynamics.speed += (dynamics.target - dynamics.speed) * 0.12;
      if (modeRef.current !== "off") {
        for (const stream of streams) stream.render(dynamics.speed, dynamics.glow);
      }
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      for (const stream of streams) stream.resize();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(surgeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const layerClass =
    mode === "off"
      ? "opacity-0"
      : mode === "dim"
        ? "opacity-25 blur-[3px]"
        : "opacity-100";

  return (
    <>
      {/* CRT 扫描线滤镜层 */}
      <div className="crt-overlay fixed inset-0 pointer-events-none z-40" />

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-10 pointer-events-none transition-[opacity,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${layerClass}`}
      >
        {/* 左侧 TX 二进制数据流（从下往上，桌面端） */}
        <aside className="binary-side-column absolute left-0 top-14 bottom-10 hidden md:flex flex-col justify-between">
          <canvas ref={leftRef} className="w-full h-full" />
          <div className="absolute left-4 top-3 bottom-3 flex flex-col justify-between text-[10px] select-none">
            <div className="flex items-center gap-1.5 text-[#38ef7d]/80 tracking-widest">
              <span className="inline-block w-1.5 h-1.5 bg-[#38ef7d] animate-ping" />
              <span>TX ▲</span>
            </div>
            <div className="text-neutral-600 tracking-widest">0x01_UP</div>
          </div>
        </aside>

        {/* 右侧 RX 二进制数据流（从上往下，桌面端） */}
        <aside className="binary-side-column absolute right-0 top-14 bottom-10 hidden md:flex flex-col justify-between">
          <canvas ref={rightRef} className="w-full h-full" />
          <div className="absolute right-4 top-3 bottom-3 flex flex-col justify-between items-end text-[10px] select-none">
            <div className="flex items-center gap-1.5 text-[#00f5d4]/80 tracking-widest">
              <span>RX ▼</span>
              <span className="inline-block w-1.5 h-1.5 bg-[#00f5d4] animate-ping" />
            </div>
            <div className="text-neutral-600 tracking-widest">0x10_DN</div>
          </div>
        </aside>

        {/* 顶部横向数据流（向右，移动端） */}
        <aside className="binary-band-row absolute left-0 right-0 top-14 flex md:hidden items-center">
          <canvas ref={topRef} className="w-full h-full" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[9px] select-none text-[#00f5d4]/70 tracking-widest">
            <span className="inline-block w-1 h-1 bg-[#00f5d4] animate-ping" />
            <span>RX ▶</span>
          </div>
        </aside>

        {/* 底部横向数据流（向左，移动端） */}
        <aside className="binary-band-row absolute left-0 right-0 bottom-0 flex md:hidden items-center">
          <canvas ref={bottomRef} className="w-full h-full" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[9px] select-none text-[#38ef7d]/70 tracking-widest">
            <span>◀ TX</span>
            <span className="inline-block w-1 h-1 bg-[#38ef7d] animate-ping" />
          </div>
        </aside>
      </div>
    </>
  );
}
