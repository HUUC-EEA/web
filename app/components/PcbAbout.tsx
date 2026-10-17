"use client";

import { useEffect, useRef, useState } from "react";

/* 板面坐标系：640x420，中间留出丝印字带 */
const W = 640;
const H = 420;
const M = 20;
const BAND_TOP = 168;
const BAND_BOTTOM = 252;

/** 固定种子的伪随机数：保证服务端预渲染与客户端水合结果一致 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Trace = { d: string; width: number; delay: number; color: string };
type Node = { x: number; y: number; r: number; kind: "pad" | "via"; delay: number };
type Chip = { x: number; y: number; w: number; h: number; label: string; sub: string };

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

function buildBoard(seed: number) {
  const rnd = mulberry32(seed);
  const traces: Trace[] = [];
  const nodes: Node[] = [];

  /** 真实 PCB 布线风格：横平竖直的走线段之间用 45° 斜角过渡 */
  const addTrace = (x0: number, y0: number, yMin: number, yMax: number, delay: number) => {
    let x = x0;
    let y = y0;
    const pts: [number, number][] = [[x, y]];
    let horizontal = rnd() > 0.5;
    const segs = 4 + Math.floor(rnd() * 4);

    for (let i = 0; i < segs; i++) {
      if (horizontal) {
        const dir = rnd() > 0.5 ? 1 : -1;
        x = clamp(x + dir * (26 + rnd() * 72), M, W - M);
      } else {
        const dx = rnd() > 0.5 ? 1 : -1;
        const dy = rnd() > 0.5 ? 1 : -1;
        const len = 10 + rnd() * 20;
        x = clamp(x + dx * len, M, W - M);
        y = clamp(y + dy * len, yMin, yMax);
      }
      pts.push([x, y]);
      horizontal = !horizontal;
    }

    const d = "M " + pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(" L ");
    traces.push({
      d,
      width: rnd() > 0.78 ? 1.7 : 1.1,
      delay,
      color: rnd() > 0.82 ? "#00f5d4" : "#38ef7d",
    });
    for (const [px, py] of [pts[0], pts[pts.length - 1]]) {
      nodes.push({ x: px, y: py, r: 2.6, kind: "pad", delay: delay + 0.4 });
    }
  };

  // 上下两个布线区各撒一批走线
  let delay = 0;
  for (let i = 0; i < 34; i++) {
    addTrace(M + rnd() * (W - 2 * M), M + 8 + rnd() * (BAND_TOP - 40 - M), M + 6, BAND_TOP - 18, delay);
    delay += 0.02;
  }
  for (let i = 0; i < 34; i++) {
    addTrace(M + rnd() * (W - 2 * M), BAND_BOTTOM + 18 + rnd() * (H - M - 8 - BAND_BOTTOM - 18), BAND_BOTTOM + 18, H - M - 6, delay);
    delay += 0.02;
  }

  // 两组平行总线，模拟数据排线
  for (const [bx, by, vertical] of [
    [M + 30, BAND_TOP - 34, false],
    [M + 40, BAND_BOTTOM + 30, false],
  ] as [number, number, boolean][]) {
    for (let k = 0; k < 5; k++) {
      const off = k * 5;
      traces.push({
        d: vertical
          ? `M ${bx + off} ${by} L ${bx + off} ${by + 60}`
          : `M ${bx} ${by + off} L ${bx + 150} ${by + off} L ${bx + 190} ${by + off - 24} L ${bx + 300} ${by + off - 24}`,
        width: 1,
        delay: 0.5 + k * 0.05,
        color: k === 0 ? "#00f5d4" : "#38ef7d",
      });
    }
  }

  // 过孔
  for (let i = 0; i < 64; i++) {
    const y = rnd() > 0.5 ? M + rnd() * (BAND_TOP - 30 - M) : BAND_BOTTOM + 26 + rnd() * (H - M - BAND_BOTTOM - 40);
    nodes.push({ x: M + rnd() * (W - 2 * M), y, r: 1.3, kind: "via", delay: 0.8 + rnd() * 0.8 });
  }

  const chips: Chip[] = [
    { x: 66, y: 52, w: 118, h: 62, label: "U1", sub: "EEA-MCU" },
    { x: 452, y: 44, w: 122, h: 66, label: "U2", sub: "PWR-LDO" },
    { x: 84, y: 300, w: 108, h: 58, label: "U3", sub: "IO-EXP" },
    { x: 448, y: 302, w: 124, h: 62, label: "U4", sub: "LAB-2A109" },
  ];

  return { traces, nodes, chips };
}

const BOARD = buildBoard(20261017);

/**
 * 「关于我们」的 PCB 蚀刻板：程序化生成走线 / 过孔 / 芯片封装，
 * 滚动进入视口时走线按 stroke-dashoffset 逐条「蚀刻」出来。
 */
export default function PcbAbout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [etched, setEtched] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const done = () => {
      setEtched(true);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };

    const check = () => {
      if (reduced) {
        done();
        return;
      }
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visible >= Math.min(rect.height, vh) * 0.25) done();
    };

    const raf = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`rounded border border-[#38ef7d]/25 bg-[#071009] p-2.5 sm:p-3 shadow-[inset_0_0_60px_rgba(0,0,0,0.75)] ${
        etched ? "pcb-etched" : ""
      }`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        role="img"
        aria-label="HUUC-EEA 电路板艺术图"
      >
        {/* 基板与安装孔 */}
        <rect x="2" y="2" width={W - 4} height={H - 4} rx="10" fill="#08120c" stroke="#38ef7d" strokeOpacity="0.35" />
        {[
          [M - 6, M - 6],
          [W - M + 6, M - 6],
          [M - 6, H - M + 6],
          [W - M + 6, H - M + 6],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="6.5" fill="none" stroke="#00f5d4" strokeOpacity="0.5" strokeWidth="1.4" />
        ))}

        {/* 走线 */}
        {BOARD.traces.map((t, i) => (
          <path
            key={i}
            d={t.d}
            pathLength={1}
            fill="none"
            stroke={t.color}
            strokeOpacity={t.color === "#00f5d4" ? 0.6 : 0.5}
            strokeWidth={t.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pcb-trace"
            style={{ transitionDelay: `${t.delay.toFixed(2)}s` }}
          />
        ))}

        {/* 焊盘与过孔 */}
        {BOARD.nodes.map((n, i) =>
          n.kind === "pad" ? (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="#08120c"
              stroke="#38ef7d"
              strokeOpacity="0.7"
              strokeWidth="1.2"
              className="pcb-node"
              style={{ transitionDelay: `${n.delay.toFixed(2)}s` }}
            />
          ) : (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="#00f5d4"
              fillOpacity="0.5"
              className="pcb-node"
              style={{ transitionDelay: `${n.delay.toFixed(2)}s` }}
            />
          )
        )}

        {/* 芯片封装 */}
        {BOARD.chips.map((c) => (
          <g key={c.label} className="pcb-node" style={{ transitionDelay: "0.6s" }}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="3" fill="#040a06" stroke="#38ef7d" strokeOpacity="0.6" strokeWidth="1.2" />
            {Array.from({ length: Math.floor(c.w / 10) }, (_, i) => (
              <g key={i} stroke="#38ef7d" strokeOpacity="0.45" strokeWidth="1">
                <line x1={c.x + 6 + i * 10} y1={c.y - 7} x2={c.x + 6 + i * 10} y2={c.y} />
                <line x1={c.x + 6 + i * 10} y1={c.y + c.h} x2={c.x + 6 + i * 10} y2={c.y + c.h + 7} />
              </g>
            ))}
            <text x={c.x + 8} y={c.y + 20} className="font-tech" fontSize="12" fill="#38ef7d" fillOpacity="0.85">
              {c.label}
            </text>
            <text x={c.x + 8} y={c.y + c.h - 10} className="font-tech" fontSize="10" fill="#9ca3af" fillOpacity="0.7">
              {c.sub}
            </text>
          </g>
        ))}

        {/* 中央丝印字标：描边空心的蚀刻字 */}
        <g className="pcb-word">
          <text
            x={W / 2 + 2}
            y={222}
            textAnchor="middle"
            className="font-pixel"
            fontSize="58"
            fill="none"
            stroke="#00f5d4"
            strokeOpacity="0.35"
            strokeWidth="1"
            letterSpacing="6"
          >
            HUUC-EEA
          </text>
          <text
            x={W / 2}
            y={220}
            textAnchor="middle"
            className="font-pixel"
            fontSize="58"
            fill="none"
            stroke="#38ef7d"
            strokeOpacity="0.9"
            strokeWidth="1.2"
            letterSpacing="6"
          >
            HUUC-EEA
          </text>
          <text x={W / 2} y={244} textAnchor="middle" className="font-tech" fontSize="11" fill="#9ca3af" fillOpacity="0.75" letterSpacing="3">
            REV 2.0 · LAB 2A109 · HUUC
          </text>
        </g>
      </svg>
    </div>
  );
}
