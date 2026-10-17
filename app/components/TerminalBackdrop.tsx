"use client";

import { useEffect, useRef } from "react";

type Bit = {
  val: string;
  echoVal: string;
  hasOverlay: boolean;
  flipRate: number;
};

type Column = {
  x: number;
  y: number;
  baseSpeed: number;
  fontSize: number;
  isForeground: boolean;
  charStep: number;
  bits: Bit[];
};

/** 左右两侧 0/1 双向二进制数据流渲染器（左 TX ▲ 向上，右 RX ▼ 向下） */
class SideBinaryStream {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private direction: -1 | 1;
  private columns: Column[] = [];
  private width = 155;
  private height = 0;

  constructor(canvas: HTMLCanvasElement, direction: -1 | 1) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.direction = direction;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width || 155;
    this.height = rect.height || window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.initColumns();
  }

  private initColumns() {
    this.columns = [];
    const colSpacing = 14;
    const numCols = Math.max(6, Math.floor((this.width - 20) / colSpacing));

    for (let c = 0; c < numCols; c++) {
      for (let depth = 0; depth < 2; depth++) {
        const isForeground = depth === 1;
        const x = 12 + c * colSpacing + (isForeground ? 4 : -2);
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

        this.columns.push({
          x,
          y: Math.random() * this.height,
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
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    for (const col of this.columns) {
      col.y += this.direction * col.baseSpeed * speedMultiplier;

      const totalLen = col.bits.length * col.charStep;
      if (this.direction === -1 && col.y + totalLen < -30) {
        col.y = this.height + 25 + Math.random() * 40;
      } else if (this.direction === 1 && col.y - totalLen > this.height + 30) {
        col.y = -25 - Math.random() * 40;
      }

      ctx.font = `${col.isForeground ? "600" : "400"} ${col.fontSize}px "JetBrains Mono", monospace`;

      for (let j = 0; j < col.bits.length; j++) {
        const bit = col.bits[j];
        const bitY = col.y - this.direction * (j * col.charStep);
        if (bitY < -20 || bitY > this.height + 20) continue;

        if (Math.random() < bit.flipRate * (1 + glowBoost * 3)) {
          bit.val = bit.val === "1" ? "0" : "1";
          if (Math.random() < 0.5) {
            bit.echoVal = bit.val === "1" ? "0" : "1";
          }
        }

        const headRatio = 1 - j / col.bits.length;
        const alpha = col.isForeground
          ? Math.pow(headRatio, 1.25) * (0.76 + glowBoost * 0.24)
          : Math.pow(headRatio, 1.5) * (0.32 + glowBoost * 0.35);

        if (bit.hasOverlay || glowBoost > 0.2) {
          ctx.fillStyle =
            this.direction === -1
              ? `rgba(56, 239, 125, ${(alpha * 0.44).toFixed(3)})`
              : `rgba(0, 245, 212, ${(alpha * 0.44).toFixed(3)})`;
          ctx.fillText(
            bit.echoVal,
            col.x + (col.isForeground ? -4 : 3),
            bitY + this.direction * (3 + glowBoost * 4)
          );
        }

        if (j === 0 && col.isForeground) {
          ctx.fillStyle = `rgba(240, 255, 250, ${Math.min(1, alpha + 0.25).toFixed(3)})`;
        } else if (glowBoost > 0.35 && j < 3) {
          ctx.fillStyle = `rgba(0, 245, 212, ${Math.min(1, alpha + 0.2).toFixed(3)})`;
        } else if (this.direction === -1) {
          ctx.fillStyle = col.isForeground
            ? `rgba(56, 239, 125, ${alpha.toFixed(3)})`
            : `rgba(120, 175, 145, ${alpha.toFixed(3)})`;
        } else {
          ctx.fillStyle = col.isForeground
            ? `rgba(0, 245, 212, ${(alpha * 0.92).toFixed(3)})`
            : `rgba(110, 170, 180, ${alpha.toFixed(3)})`;
        }

        ctx.fillText(bit.val, col.x, bitY);
      }
    }
  }
}

/**
 * 全站终端背景层：CRT 扫描线 + 左右两侧 TX/RX 二进制数据流。
 * 页面滚动时数据流短暂加速冲刺，随后平滑回到常态流速。
 */
export default function TerminalBackdrop() {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const left = leftCanvasRef.current
      ? new SideBinaryStream(leftCanvasRef.current, -1)
      : null;
    const right = rightCanvasRef.current
      ? new SideBinaryStream(rightCanvasRef.current, 1)
      : null;

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
      left?.render(dynamics.speed, dynamics.glow);
      right?.render(dynamics.speed, dynamics.glow);
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      left?.resize();
      right?.resize();
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

  return (
    <>
      {/* CRT 扫描线滤镜层 */}
      <div className="crt-overlay fixed inset-0 pointer-events-none z-40" />

      {/* 左侧 TX 二进制数据流（从下往上） */}
      <aside
        aria-hidden="true"
        className="binary-side-column fixed left-0 top-14 bottom-10 z-10 pointer-events-none hidden md:flex flex-col justify-between"
      >
        <canvas ref={leftCanvasRef} className="w-full h-full" />
        <div className="absolute left-4 top-3 bottom-3 flex flex-col justify-between text-[10px] select-none">
          <div className="flex items-center gap-1.5 text-[#38ef7d]/80 tracking-widest">
            <span className="inline-block w-1.5 h-1.5 bg-[#38ef7d] animate-ping" />
            <span>TX ▲</span>
          </div>
          <div className="text-neutral-600 tracking-widest">0x01_UP</div>
        </div>
      </aside>

      {/* 右侧 RX 二进制数据流（从上往下） */}
      <aside
        aria-hidden="true"
        className="binary-side-column fixed right-0 top-14 bottom-10 z-10 pointer-events-none hidden md:flex flex-col justify-between"
      >
        <canvas ref={rightCanvasRef} className="w-full h-full" />
        <div className="absolute right-4 top-3 bottom-3 flex flex-col justify-between items-end text-[10px] select-none">
          <div className="flex items-center gap-1.5 text-[#00f5d4]/80 tracking-widest">
            <span>RX ▼</span>
            <span className="inline-block w-1.5 h-1.5 bg-[#00f5d4] animate-ping" />
          </div>
          <div className="text-neutral-600 tracking-widest">0x10_DN</div>
        </div>
      </aside>
    </>
  );
}
