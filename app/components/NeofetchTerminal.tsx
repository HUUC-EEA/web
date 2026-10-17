"use client";

import { useEffect, useRef } from "react";

/* 社团 Logo ASCII 生成参数（50 列 x 24 行）：外圈三色环抱人形 + 中心 12 引脚双层芯片 */
const COLS = 50;
const ROWS = 24;

const HEAD_ANGLES = [-Math.PI / 2, (5 * Math.PI) / 6, Math.PI / 6];
const SEG_START_ANGLES = [
  -Math.PI / 2 - Math.PI / 3,
  (5 * Math.PI) / 6 - Math.PI / 3,
  Math.PI / 6 - Math.PI / 3,
];

const HEAD_RADIUS = 0.885;
const HEAD_SIZE = 0.168;
const NECK_CUT_SIZE = 0.228;

const RING_OUTER_R = 0.86;
const RING_INNER_R = 0.54;
const RING_MID_R = (RING_OUTER_R + RING_INNER_R) / 2;
const RING_HALF_THICK = (RING_OUTER_R - RING_INNER_R) / 2;

/* 浅色系（低色度、高明度）配色：顶部冰晶蓝 / 左下嫩芽绿 / 右下奶油橙 */
const PALETTES = [
  { main: "#9be2ff", light: "#caf0ff", head: "#82d4ff" },
  { main: "#95ebB5", light: "#c4f7d6", head: "#7ee0a3" },
  { main: "#ffcb8c", light: "#ffe5c2", head: "#ffb969" },
];

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function posAngleDiff(a: number, b: number) {
  let d = (a - b) % (Math.PI * 2);
  if (d < 0) d += Math.PI * 2;
  return d;
}

function signedAngleDiff(a: number, b: number) {
  let d = (a - b) % (Math.PI * 2);
  if (d < -Math.PI) d += Math.PI * 2;
  if (d > Math.PI) d -= Math.PI * 2;
  return d;
}

function buildLogoLines(): string[] {
  const htmlLines: string[] = [];

  for (let r = 0; r < ROWS; r++) {
    let lineHtml = "";
    const y = ((r + 0.5) / ROWS) * 2.16 - 1.08;

    for (let c = 0; c < COLS; c++) {
      const x = ((c + 0.5) / COLS) * 2.16 - 1.08;
      const rad = Math.hypot(x, y);
      const ang = Math.atan2(y, x);

      let ch = " ";
      let color = "";

      // 1. 三个小人圆头与月牙形颈部镂空
      let inHeadIndex = -1;
      let headEdgeDist = 0;
      let inNeckGap = false;

      for (let i = 0; i < 3; i++) {
        const hx = HEAD_RADIUS * Math.cos(HEAD_ANGLES[i]);
        const hy = HEAD_RADIUS * Math.sin(HEAD_ANGLES[i]);
        const d = dist(x, y, hx, hy);
        if (d <= HEAD_SIZE) {
          inHeadIndex = i;
          headEdgeDist = HEAD_SIZE - d;
          break;
        } else if (d <= NECK_CUT_SIZE && rad > RING_INNER_R + 0.03) {
          inNeckGap = true;
        }
      }

      if (inHeadIndex !== -1) {
        color = PALETTES[inHeadIndex].head;
        if (headEdgeDist < 0.038) ch = ".";
        else if (headEdgeDist < 0.075) ch = "+";
        else ch = "o";
      } else if (!inNeckGap && rad >= RING_INNER_R && rad <= RING_OUTER_R) {
        // 2. 三色环抱圆弧与圆头交接缝隙
        let segIdx = -1;
        let localSpan = 0;

        for (let i = 0; i < 3; i++) {
          const diff = posAngleDiff(ang, SEG_START_ANGLES[i]);
          if (diff <= (2 * Math.PI) / 3) {
            segIdx = i;
            localSpan = diff / ((2 * Math.PI) / 3);
            break;
          }
        }

        if (segIdx !== -1) {
          let inJointCutout = false;
          let minTipDist = 999;

          for (let i = 0; i < 3; i++) {
            const boundaryAng = SEG_START_ANGLES[i];
            const tx = RING_MID_R * Math.cos(boundaryAng);
            const ty = RING_MID_R * Math.sin(boundaryAng);
            const dTip = dist(x, y, tx, ty);
            if (dTip < minTipDist) minTipDist = dTip;

            const sDiff = signedAngleDiff(ang, boundaryAng);
            if (sDiff > -0.09 && sDiff < 0.055) {
              if (dTip > RING_HALF_THICK * 0.76 || Math.abs(sDiff) < 0.032) {
                inJointCutout = true;
              }
            }
          }

          if (!inJointCutout) {
            const pal = PALETTES[segIdx];
            color = localSpan > 0.52 ? pal.light : pal.main;

            const radialEdge = Math.min(rad - RING_INNER_R, RING_OUTER_R - rad);
            if (radialEdge < 0.035 || minTipDist < 0.045) ch = ".";
            else if (radialEdge < 0.068) ch = "+";
            else ch = localSpan > 0.52 ? "s" : "o";
          }
        }
      }

      // 3. 正中央双层方芯片与四边 12 根引脚
      if (ch === " ") {
        const ax = Math.abs(x);
        const ay = Math.abs(y);

        const boxOuter = 0.255;
        const boxInner = 0.195;
        const coreOuter = 0.115;
        const coreInner = 0.068;
        const pinOuter = 0.365;

        const isPinTrackX = ax < 0.024 || Math.abs(ax - 0.125) < 0.024;
        const isPinTrackY = ay < 0.024 || Math.abs(ay - 0.125) < 0.024;

        const cornerDist = Math.hypot(
          Math.max(0, ax - (boxOuter - 0.04)),
          Math.max(0, ay - (boxOuter - 0.04))
        );

        if (
          ax <= boxOuter &&
          ay <= boxOuter &&
          cornerDist <= 0.048 &&
          (ax >= boxInner || ay >= boxInner)
        ) {
          ch = "#";
          color = "#89d4ff";
        } else if (
          ax <= coreOuter &&
          ay <= coreOuter &&
          (ax >= coreInner || ay >= coreInner)
        ) {
          ch = "=";
          color = "#b8ebff";
        } else if (ay > boxOuter && ay <= pinOuter && isPinTrackX) {
          ch = "|";
          color = "#89d4ff";
        } else if (ax > boxOuter && ax <= pinOuter && isPinTrackY) {
          ch = "-";
          color = "#89d4ff";
        }
      }

      lineHtml +=
        ch === " " ? " " : `<span style="color:${color}">${ch}</span>`;
    }
    htmlLines.push(lineHtml);
  }

  return htmlLines;
}

/* neofetch 输出的打字速度（字符/毫秒）与 Logo 逐行点亮时长 */
const TYPE_RATE = 0.85;
const LOGO_LINE_MS = 42;

export default function NeofetchTerminal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLPreElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const info = infoRef.current;
    if (!root || !logo || !info) return;

    const logoLines = buildLogoLines();
    const showAll = () => {
      logo.innerHTML = logoLines.join("\n");
      info.classList.remove("nf-pending");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showAll();
      return;
    }

    // 收集右侧配置信息的文本节点，按文档顺序逐个打字
    const walker = document.createTreeWalker(info, NodeFilter.SHOW_TEXT);
    const targets: { node: Text; full: string }[] = [];
    let current = walker.nextNode();
    while (current) {
      const text = current.nodeValue;
      if (text && text.trim()) targets.push({ node: current as Text, full: text });
      current = walker.nextNode();
    }

    let raf = 0;

    const play = () => {
      targets.forEach((t) => (t.node.nodeValue = ""));
      info.classList.remove("nf-pending");

      const totalChars = targets.reduce((sum, t) => sum + t.full.length, 0);
      const offsets: number[] = [];
      let acc = 0;
      targets.forEach((t) => {
        offsets.push(acc);
        acc += t.full.length;
      });

      const start = performance.now();
      const duration = Math.max(totalChars / TYPE_RATE, ROWS * LOGO_LINE_MS);
      let lastLogoCount = -1;

      const frame = (now: number) => {
        const elapsed = now - start;
        const typed = elapsed * TYPE_RATE;

        for (let i = 0; i < targets.length; i++) {
          const n = Math.min(Math.max(Math.floor(typed - offsets[i]), 0), targets[i].full.length);
          const node = targets[i].node;
          if (node.nodeValue?.length !== n) node.nodeValue = targets[i].full.slice(0, n);
        }

        const logoCount = Math.min(Math.floor(elapsed / LOGO_LINE_MS) + 1, ROWS);
        if (logoCount !== lastLogoCount) {
          lastLogoCount = logoCount;
          logo.innerHTML = logoLines.slice(0, logoCount).join("\n");
        }

        if (elapsed < duration) raf = requestAnimationFrame(frame);
        else showAll();
      };

      raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.2 }
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-10 flex justify-center">
      <div ref={rootRef} className="linux-terminal-window">
        {/* 原生 Linux KDE Plasma (Konsole) 窗口标题栏 */}
        <div className="kde-titlebar">
          <div className="kde-titlebar-left">
            <div className="kde-app-icon">&gt;_</div>
          </div>
          <div className="kde-window-title">member@huuc-eea : ~ — Konsole</div>
          <div className="kde-window-controls">
            <div className="kde-btn" title="Minimize">
              ─
            </div>
            <div className="kde-btn" title="Maximize">
              □
            </div>
            <div className="kde-btn close" title="Close">
              ✕
            </div>
          </div>
        </div>

        {/* 原生 Linux 终端菜单栏 */}
        <div className="kde-menubar">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Bookmarks</span>
          <span>Settings</span>
          <span>Help</span>
        </div>

        {/* 纯黑大留白终端内部区域 */}
        <div className="terminal-viewport">
          <div className="neofetch-wrapper">
            {/* 左侧：放大后的浅色圆滑 ASCII 社团 Logo，与右侧文字垂直居中对齐 */}
            <div className="logo-column">
              <pre ref={logoRef} id="ascii-logo" className="ascii-art" />
            </div>

            {/* 右侧：Neofetch 极客配置详情 */}
            <div ref={infoRef} className="info-column nf-pending">
              <div className="info-header">
                <span className="user">member</span>
                <span className="at">@</span>
                <span className="host">huuc-eea</span>
              </div>
              <div className="info-separator">---------------</div>
              <ul className="info-list">
                <li>
                  <span className="info-key">Association</span>
                  <span className="info-colon">:</span>
                  <span className="info-val-cn">河南城建学院 电子爱好者协会</span>
                </li>
                <li>
                  <span className="info-key">OS</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">HUUC-EEA Linux x86_64 / ARM64</span>
                </li>
                <li>
                  <span className="info-key">Host</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">Innovation Lab 402 (rev 2.4)</span>
                </li>
                <li>
                  <span className="info-key">Kernel</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">6.8.9-eea-rt1-embedded</span>
                </li>
                <li>
                  <span className="info-key">Uptime</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">23 years, 365 days, 24 hours</span>
                </li>
                <li>
                  <span className="info-key">Packages</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">1842 (pacman), 328 (kicad-lib)</span>
                </li>
                <li>
                  <span className="info-key">Shell</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">zsh 5.9 (oh-my-eea)</span>
                </li>
                <li>
                  <span className="info-key">Resolution 1</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">128x64 @ 60Hz (SSD1306 I2C OLED)</span>
                </li>
                <li>
                  <span className="info-key">Resolution 2</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">2560x1440 @ 144Hz (Lab Workbench)</span>
                </li>
                <li>
                  <span className="info-key">DE</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">KiCad 8.0 / Altium Designer</span>
                </li>
                <li>
                  <span className="info-key">WM</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">FreeRTOS &amp; Linux Wayland</span>
                </li>
                <li>
                  <span className="info-key">WM Theme</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">SolderMask-Green (ENIG Gold)</span>
                </li>
                <li>
                  <span className="info-key">Theme</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">Breeze-Dark [QT], PCB-Silk [GTK3/4]</span>
                </li>
                <li>
                  <span className="info-key">Icons</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">QFP-100-Pinout [QT/GTK]</span>
                </li>
                <li>
                  <span className="info-key">Terminal</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">konsole / minicom (115200 8N1)</span>
                </li>
                <li>
                  <span className="info-key">CPU</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">STM32H743IIT6 (480MHz) &amp; ESP32-S3</span>
                </li>
                <li>
                  <span className="info-key">GPU</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">Xilinx Zynq-7020 FPGA Fabric</span>
                </li>
                <li>
                  <span className="info-key">Memory</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">512 KiB SRAM / 16 MiB QSPI Flash</span>
                </li>
                <li>
                  <span className="info-key">Disk (/lab)</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">4096 Oscilloscopes &amp; Logic Analyzers</span>
                </li>
                <li>
                  <span className="info-key">Battery</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">24.0V DC Bench Power Supply [CC/CV]</span>
                </li>
                <li>
                  <span className="info-key">Locale</span>
                  <span className="info-colon">:</span>
                  <span className="info-val">en_US.UTF-8 (Solder_Flux=Enabled)</span>
                </li>
              </ul>

              {/* 底部 2x8 终端经典调色板 */}
              <div className="color-palette">
                <div className="palette-row">
                  <span className="swatch s-0" />
                  <span className="swatch s-1" />
                  <span className="swatch s-2" />
                  <span className="swatch s-3" />
                  <span className="swatch s-4" />
                  <span className="swatch s-5" />
                  <span className="swatch s-6" />
                  <span className="swatch s-7" />
                </div>
                <div className="palette-row">
                  <span className="swatch s-8" />
                  <span className="swatch s-9" />
                  <span className="swatch s-10" />
                  <span className="swatch s-11" />
                  <span className="swatch s-12" />
                  <span className="swatch s-13" />
                  <span className="swatch s-14" />
                  <span className="swatch s-15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
