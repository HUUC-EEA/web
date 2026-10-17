"use client";

import { useEffect, useRef } from "react";

const UART_HEADER_TEXT =
  "UART0_INIT: 115200 8N1 | PARITY: NONE | SYS_CLK: 168MHz";

const PLANET_ASCII = [
  ":  .                  _,oo,           *  [3.3V]",
  "                 _.u{{X;:..          .odXXXVVV'",
  "              .oMMMMUU{{{X;:=, ,.o@P^    XVM^  ",
  "             oVMMMMMUU{{{X;::=.,       dP_     ",
  "            dNOOONMMMUU{{{X;:==.   .o@P^  |    ",
  "    +      dOOOOOOOMMMUU{{{X;:=. o@^[0xEA]     ",
  "           dNOOOONMMMUU{{{X~.o@P^              ",
  "           MMMMMMMMMCC{{{Xo@^=,.        .      ",
  "         ,oTMMMMMOOCC{{Xo@P^:==,.              ",
  "       .@^  TCZZCC{Xo@^;::===;.                ",
  "      oMP     ^Xo@P^;:::===;.    ..            ",
  "     .dVXX    .o@^ ^;::===;..                  ",
  "    dVVVXXXX@^`      `^^^^^                  : ",
  "   YVVVVP^    :                         [GND]  ",
  "    ^^                                         ",
];

const TITLE_ASCII = [
  " _   _  _   _  _   _   ____        _____    _       _    ",
  "| | | || | | || | | | / ___|      | ____|  / \\     / \\   ",
  "| |_| || | | || | | || |    _____ |  _|   / _ \\   / _ \\  ",
  "|  _  || |_| || |_| || |___|_____|| |___ / ___ \\ / ___ \\ ",
  "|_| |_| \\___/  \\___/  \\____|      |_____/_/   \\_\\/_/   \\_\\",
];

const SCHEMATIC_LINE =
  "───/\\/\\/\\───[ +3.3V ]───||───PWM───_|-|_|-|_───[ GND ]───";

const CHINESE_SUBTITLE = "电子爱好者协会";
const GLITCH_CHARS = ["0", "1", "F", "E", "A", "x", "#", "+"];

type GroupType = "planet" | "title" | "schematic";

type CharNode = {
  el: HTMLSpanElement;
  origChar: string;
  defaultColor: string;
  baseX: number;
  baseY: number;
  curX: number;
  curY: number;
  revealed: boolean;
  glitchTick: number;
};

/**
 * 终端 Hero（与示例 HTML 1:1 对齐）：
 * 串口引导行 → ASCII 星环行星 → HUUC-EAA 主标题 → 原理图分割线
 * → 中文副标题逐字打印；鼠标视差 + 字符级电磁探针排斥交互。
 */
export default function HeroTerminal() {
  const uartRef = useRef<HTMLSpanElement>(null);
  const planetLayerRef = useRef<HTMLDivElement>(null);
  const titleLayerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const uartEl = uartRef.current;
    const planetLayer = planetLayerRef.current;
    const titleLayer = titleLayerRef.current;
    const subtitleEl = subtitleRef.current;
    if (!uartEl || !planetLayer || !titleLayer || !subtitleEl) return;

    const planetPre = planetLayer.querySelector("pre");
    const titlePre = titleLayer.querySelector("pre");
    const schematicPre = titleLayer.querySelectorAll("pre")[1];
    if (!planetPre || !titlePre || !schematicPre) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const charNodes: CharNode[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const mouse = {
      x: -9999,
      y: -9999,
      normX: 0,
      normY: 0,
      smoothX: 0,
      smoothY: 0,
      active: false,
    };
    let raf = 0;

    /** 与原版一致：逐字符构建 span 网格，空格保留为文本节点 */
    const prepareAsciiGrid = (
      container: Element,
      lines: string[],
      groupType: GroupType
    ) => {
      container.innerHTML = "";
      const nodes: CharNode[] = [];

      lines.forEach((line, rowIdx) => {
        const lineDiv = document.createElement("div");
        for (let colIdx = 0; colIdx < line.length; colIdx++) {
          const ch = line[colIdx];
          if (ch === " ") {
            lineDiv.appendChild(document.createTextNode(" "));
            continue;
          }
          const span = document.createElement("span");
          span.className = "ascii-char";
          span.textContent = ch;
          span.style.visibility = reduced ? "visible" : "hidden";

          // 星球中的极客高亮标识 [0xEA] [3.3V] [GND]
          const isGeekTag =
            (rowIdx === 0 && colIdx >= 39) ||
            (rowIdx === 5 && colIdx >= 35) ||
            (rowIdx === 13 && colIdx >= 39);
          const isCore = "M0NUVX@#|_\\/".includes(ch);
          let defaultColor = "#e5e5e5";

          if (groupType === "planet") {
            defaultColor = isGeekTag
              ? "#38ef7d"
              : isCore
                ? "#ededed"
                : "#9a9a9a";
          } else if (groupType === "title") {
            defaultColor = "#ffffff";
          } else {
            defaultColor = "+-|_/\\".includes(ch) ? "#737373" : "#38ef7d";
          }

          span.style.color = defaultColor;
          lineDiv.appendChild(span);
          const node: CharNode = {
            el: span,
            origChar: ch,
            defaultColor,
            baseX: 0,
            baseY: 0,
            curX: 0,
            curY: 0,
            revealed: reduced,
            glitchTick: 0,
          };
          charNodes.push(node);
          nodes.push(node);
        }
        container.appendChild(lineDiv);
      });

      return nodes;
    };

    const planetNodes = prepareAsciiGrid(planetPre, PLANET_ASCII, "planet");
    const titleNodes = prepareAsciiGrid(titlePre, TITLE_ASCII, "title");
    const schematicNodes = prepareAsciiGrid(schematicPre, [SCHEMATIC_LINE], "schematic");

    /** 缓存字符基准坐标（文档坐标系，探针距离计算用） */
    const cacheGridPositions = () => {
      for (const node of charNodes) {
        const rect = node.el.getBoundingClientRect();
        node.baseX = rect.left + rect.width * 0.5;
        node.baseY = rect.top + rect.height * 0.5 + window.scrollY;
      }
    };

    /** 与原版一致的分批点亮（先闪绿再还原默认色） */
    const revealBatch = (batch: CharNode[], restoreDelay: number) => {
      batch.forEach((node) => {
        node.el.style.visibility = "visible";
        node.el.style.color = "#38ef7d";
        node.revealed = true;
      });
      timers.push(
        setTimeout(() => {
          batch.forEach((node) => {
            node.el.style.color = node.defaultColor;
          });
        }, restoreDelay)
      );
    };

    /** 串口终端打字机序列（阶段与节奏 1:1 对齐原版） */
    const runTypewriter = () => {
      uartEl.textContent = "";
      subtitleEl.textContent = "";
      let delay = 40;

      for (let i = 1; i <= UART_HEADER_TEXT.length; i++) {
        timers.push(
          setTimeout(() => {
            uartEl.textContent = UART_HEADER_TEXT.slice(0, i);
          }, delay)
        );
        delay += 7;
      }

      delay += 45;

      for (let i = 0; i < planetNodes.length; i += 6) {
        const batch = planetNodes.slice(i, i + 6);
        timers.push(setTimeout(() => revealBatch(batch, 45), delay));
        delay += 12;
      }

      delay += 70;

      for (let i = 0; i < titleNodes.length; i += 5) {
        const batch = titleNodes.slice(i, i + 5);
        timers.push(setTimeout(() => revealBatch(batch, 50), delay));
        delay += 13;
      }

      delay += 65;

      for (let i = 0; i < schematicNodes.length; i += 3) {
        const batch = schematicNodes.slice(i, i + 3);
        timers.push(
          setTimeout(() => {
            batch.forEach((node) => {
              node.el.style.visibility = "visible";
              node.revealed = true;
            });
          }, delay)
        );
        delay += 14;
      }

      delay += 80;

      for (let i = 1; i <= CHINESE_SUBTITLE.length; i++) {
        timers.push(
          setTimeout(() => {
            subtitleEl.textContent = CHINESE_SUBTITLE.slice(0, i);
          }, delay + i * 75)
        );
      }
    };

    /**
     * 主循环：视差 + 电磁探针。
     * 与原版一致：字符恢复逻辑每帧都会执行（不受鼠标是否活跃影响），
     * 保证探针离开后乱码字符立即还原，ASCII 图案不会停留在损坏状态。
     */
    const loop = () => {
      mouse.smoothX += (mouse.normX - mouse.smoothX) * 0.08;
      mouse.smoothY += (mouse.normY - mouse.smoothY) * 0.08;

      planetLayer.style.transform = `translate3d(${(mouse.smoothX * 14).toFixed(2)}px, ${(mouse.smoothY * 10).toFixed(2)}px, 0)`;
      titleLayer.style.transform = `translate3d(${(mouse.smoothX * 6).toFixed(2)}px, ${(mouse.smoothY * 5).toFixed(2)}px, 0)`;

      const heroVisible = window.scrollY < window.innerHeight * 0.5;
      const probeRadius = 86;
      const probeRadiusSq = probeRadius * probeRadius;
      const probeActive = heroVisible && mouse.active;
      const mouseDocY = mouse.y + window.scrollY;

      for (let i = 0; i < charNodes.length; i++) {
        const node = charNodes[i];
        if (!node.revealed) continue;

        let targetX = 0;
        let targetY = 0;
        let inProbeField = false;

        if (probeActive) {
          const dx = node.baseX - mouse.x;
          const dy = node.baseY - mouseDocY;
          const distSq = dx * dx + dy * dy;

          if (distSq < probeRadiusSq && distSq > 0.5) {
            inProbeField = true;
            const dist = Math.sqrt(distSq);
            const force = Math.pow(1 - dist / probeRadius, 1.8);
            targetX = (dx / dist) * force * 9;
            targetY = (dy / dist) * force * 9;

            node.el.style.color =
              dist < probeRadius * 0.45 ? "#00f5d4" : "#38ef7d";
            node.glitchTick++;
            if (node.glitchTick % 4 === 0) {
              node.el.textContent =
                GLITCH_CHARS[(i + node.glitchTick) % GLITCH_CHARS.length];
            }
          }
        }

        // 探针不在场内时立即还原字符与颜色（与原版行为一致）
        if (
          !inProbeField &&
          (node.el.textContent !== node.origChar ||
            node.el.style.color !== node.defaultColor)
        ) {
          node.el.textContent = node.origChar;
          node.el.style.color = node.defaultColor;
          node.glitchTick = 0;
        }

        node.curX += (targetX - node.curX) * 0.22;
        node.curY += (targetY - node.curY) * 0.22;

        if (Math.abs(node.curX) > 0.05 || Math.abs(node.curY) > 0.05) {
          node.el.style.transform = `translate3d(${node.curX.toFixed(2)}px, ${node.curY.toFixed(2)}px, 0)`;
        } else if (node.el.style.transform !== "") {
          node.curX = 0;
          node.curY = 0;
          node.el.style.transform = "";
        }
      }

      raf = requestAnimationFrame(loop);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.normX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.normY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.normX = 0;
      mouse.normY = 0;
    };

    const onResize = () => cacheGridPositions();

    if (reduced) {
      uartEl.textContent = UART_HEADER_TEXT;
      subtitleEl.textContent = CHINESE_SUBTITLE;
      requestAnimationFrame(cacheGridPositions);
      return;
    }

    runTypewriter();
    requestAnimationFrame(() => requestAnimationFrame(cacheGridPositions));

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center px-4 text-center">
      {/* 串口状态引导行 */}
      <div className="mb-2.5 flex items-center gap-2 text-[11px] sm:text-xs text-neutral-500 font-mono tracking-wider">
        <span className="text-[#38ef7d]">$</span>
        <span ref={uartRef} className="text-neutral-400" />
      </div>

      {/* ASCII 星环行星 */}
      <div ref={planetLayerRef} className="mb-2 sm:mb-3">
        <pre
          aria-hidden="true"
          className="planet-pre font-mono text-neutral-300 ascii-glow whitespace-pre text-left"
        />
      </div>

      {/* 主标题 + 原理图分割线 + 中文副标题 */}
      <div ref={titleLayerRef} className="flex flex-col items-center">
        <h1 className="sr-only">河南城建学院电子爱好者协会 HUUC-EAA</h1>
        <pre
          aria-hidden="true"
          className="title-pre font-mono font-bold text-white title-glow whitespace-pre text-left"
        />
        <pre
          aria-hidden="true"
          className="schematic-pre font-mono text-neutral-500 mt-3 sm:mt-4 whitespace-pre tracking-tight"
        />
        <div className="font-cn mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 min-h-[2.25rem]">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-medium tracking-[0.38em] pl-[0.38em] text-neutral-100 title-glow flex items-center">
            <span ref={subtitleRef} />
            <span className="terminal-cursor ml-1 text-base sm:text-xl">█</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
