import SnapSection from "./components/SnapSection";
import HeroTerminal from "./components/HeroTerminal";

const ABOUT_CARDS = [
  {
    tag: "[0x01] EMBEDDED & FIRMWARE",
    tagColor: "text-[#38ef7d]",
    badge: "ARM/RISC-V",
    badgeCls: "bg-[#38ef7d]/10 border-[#38ef7d]/30 text-[#38ef7d]",
    title: "嵌入式与固件开发",
    ascii: `   ┌─┬─┬─┐
  ─┤M C U├─  [32-BIT CORTEX]
   └─┴─┴─┘   IRQ_HANDLERS: OK`,
    asciiColor: "text-[#00f5d4]/85",
    desc: "STM32 / RISC-V / ESP32 / RTOS 实时操作系统与底层寄存器驱动开发，掌握传感器姿态解算与控制算法。",
    stats: [
      ["CLK", "168MHz", "text-neutral-300"],
      ["BUS", "SPI/I2C/UART", "text-[#38ef7d]"],
    ],
  },
  {
    tag: "[0x02] PCB & HARDWARE",
    tagColor: "text-[#00f5d4]",
    badge: "EDA/LAYOUT",
    badgeCls: "bg-[#00f5d4]/10 border-[#00f5d4]/30 text-[#00f5d4]",
    title: "电路与硬件设计",
    ascii: `  ─/\\/\\/─┬─||─► [AMP_STAGE]
         └─|>|─ [SIGNAL_OK]
  CH1: ──_┌┐_┌┐_── 3.30Vpp`,
    asciiColor: "text-[#38ef7d]/85",
    desc: "EDA 原理图设计 / 多层高速 PCB 布线 / 模拟与数字信号调理，亲手完成从覆铜板焊接到示波器波形调试。",
    stats: [
      ["LAYER", "2/4L PCB", "text-neutral-300"],
      ["DRC", "0 ERRORS", "text-[#00f5d4]"],
    ],
  },
  {
    tag: "[0x03] GEEK LAB & CONTEST",
    tagColor: "text-[#38ef7d]",
    badge: "TI_CUP/LAB",
    badgeCls: "bg-[#38ef7d]/10 border-[#38ef7d]/30 text-[#38ef7d]",
    title: "极客共创与竞赛",
    ascii: `  _┌┐_┌┐_ [LAB]  git commit -m
  ├─► TI_CUP     "build hardware"
  └─► OPEN_HW    STATUS: READY`,
    asciiColor: "text-[#00f5d4]/85",
    desc: "全国大学生电子设计竞赛 / 智能车与物联网创客项目 / 开源硬件工作坊，与志同道合的伙伴组队攻坚。",
    stats: [
      ["MODE", "OPEN_SOURCE", "text-neutral-300"],
      ["LAB", "24/7 ACTIVE", "text-[#38ef7d]"],
    ],
  },
];

const PROJECT_PLACEHOLDERS = Array.from({ length: 6 }, (_, i) => ({
  idx: `0x0${i + 1}`,
  name: `PROJECT_${String(i + 1).padStart(2, "0")}`,
}));

export default function Home() {
  return (
    <main className="flex-grow">
      {/* 首页：终端 Hero（串口引导 + ASCII 星球 + HUUC-EAA 标题） */}
      <SnapSection id="home">
        <HeroTerminal />
      </SnapSection>

      {/* 关于我们：极客硬件规格卡片 */}
      <SnapSection id="about">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 md:px-16 pt-16 pb-12 flex flex-col items-center">
          <div className="w-full flex flex-col items-center text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white title-glow flex items-center gap-3">
              <span className="font-mono text-[#38ef7d]">ABOUT US</span>
              <span className="text-neutral-600 font-mono">{"//"}</span>
              <span className="font-cn">关于我们</span>
            </h2>

            <pre
              aria-hidden="true"
              className="font-mono text-[10px] sm:text-xs text-neutral-500 mt-2.5 whitespace-pre leading-tight select-none"
            >
              {`───┬───[VCC:3.3V]───┬───[ ╔═══┴═══┴═══╗ : HUUC-EAA_CORE ]───┬───[I2C/SPI]───┬───`}
            </pre>

            <p className="font-cn text-xs sm:text-base text-[#38ef7d] font-medium tracking-widest mt-3">
              「 以焊锡与代码构建硬件浪漫，连接每一位热爱电子工程的创造者 」
            </p>
            <p className="font-cn text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed mt-2.5">
              <strong className="text-neutral-200 font-medium">
                河南城建学院电子爱好者协会 (HUUC-EAA)
              </strong>{" "}
              是由热爱电路设计、嵌入式开发与开源硬件的青年极客组成的硬核技术社团。我们提供从零基础大一电子入门、仪器仪表实操，到全国大学生电子设计竞赛与创新项目孵化的全链路实验室环境。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full">
            {ABOUT_CARDS.map((card) => (
              <article key={card.tag} className="spec-card p-4 sm:p-5 rounded flex flex-col justify-between">
                <div>
                  <div
                    className={`flex items-center justify-between font-mono text-xs ${card.tagColor} mb-2`}
                  >
                    <span>{card.tag}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${card.badgeCls}`}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-cn text-base sm:text-lg font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <pre
                    aria-hidden="true"
                    className={`font-mono text-[10px] sm:text-[11px] leading-tight ${card.asciiColor} bg-black/50 border border-neutral-800/90 rounded p-2 mb-3 whitespace-pre`}
                  >
                    {card.ascii}
                  </pre>
                  <p className="font-cn text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-neutral-500">
                  {card.stats.map(([label, value, cls]) => (
                    <span key={label}>
                      {label}:{" "}
                      <strong className={cls}>{value}</strong>
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 mt-6 rounded bg-black/50 border border-neutral-800/90 font-mono text-[11px] text-neutral-400">
            <span>
              FOUNDED: <strong className="text-neutral-200">HUUC_LAB</strong>
            </span>
            <span className="text-neutral-700">|</span>
            <span>
              VOLTAGE: <strong className="text-[#38ef7d]">3.3V / 5.0V</strong>
            </span>
            <span className="text-neutral-700">|</span>
            <span>
              STATUS: <strong className="text-[#00f5d4]">ACTIVE_ONLINE</strong>
            </span>
          </div>
        </div>
      </SnapSection>

      {/* 社团项目：开源仓库风格占位卡片 */}
      <SnapSection id="projects">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 md:px-16 pt-16 pb-12 flex flex-col items-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white title-glow flex items-center gap-3 mb-3">
            <span className="font-mono text-[#00f5d4]">PROJECTS</span>
            <span className="text-neutral-600 font-mono">{"//"}</span>
            <span className="font-cn">社团项目</span>
          </h2>
          <p className="font-cn text-xs sm:text-sm text-neutral-500 mb-8">
            开源硬件与竞赛作品仓库，项目索引持续同步中。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {PROJECT_PLACEHOLDERS.map((p) => (
              <a key={p.idx} href="#" className="spec-card p-4 sm:p-5 rounded block">
                <div className="flex items-center justify-between font-mono text-xs text-[#38ef7d] mb-2">
                  <span>[{p.idx}] REPO</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38ef7d]/10 border border-[#38ef7d]/30">
                    OPEN_HW
                  </span>
                </div>
                <h3 className="font-mono text-sm font-semibold text-white mb-1.5">
                  {p.name}
                </h3>
                <p className="font-cn text-xs text-neutral-400 leading-relaxed">
                  项目简介占位文案，后续补充社团项目相关内容。
                </p>
                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[10px] text-neutral-500">
                  <span>
                    BRANCH: <strong className="text-neutral-300">main</strong>
                  </span>
                  <span>
                    SYNC: <strong className="text-[#00f5d4]">OK</strong>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </SnapSection>

      {/* 加入我们：终端指令风格 CTA */}
      <SnapSection id="join">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-12 flex flex-col items-center text-center">
          <div className="font-mono text-xs sm:text-sm text-neutral-500 mb-4 flex items-center gap-2">
            <span className="text-[#38ef7d]">$</span>
            <span>./join --huuc-eea --now</span>
            <span className="terminal-cursor">█</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-wider text-white title-glow flex items-center gap-3">
            <span className="font-mono text-[#38ef7d]">JOIN US</span>
            <span className="text-neutral-600 font-mono">{"//"}</span>
            <span className="font-cn">加入我们</span>
          </h2>

          <p className="font-cn text-sm sm:text-base text-neutral-400 leading-relaxed mt-4 max-w-xl">
            无论你是零基础的大一新生，还是身经百赛的硬件极客，
            只要热爱电子与创造，这里就有你的工位与焊台。
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#join"
              className="join-cta-btn font-cn font-semibold tracking-wider px-6 py-2.5 rounded text-sm"
            >
              + 加入我们
            </a>
            <a
              href="#about"
              className="font-cn font-medium tracking-wider px-6 py-2.5 rounded text-sm text-neutral-400 border border-neutral-800 hover:text-[#38ef7d] hover:border-[#38ef7d]/40 transition-colors"
            >
              了解更多
            </a>
          </div>

          <div className="mt-8 px-5 py-2.5 rounded bg-black/50 border border-neutral-800/90 font-mono text-[11px] sm:text-xs text-neutral-400 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            <span>
              QQ_GROUP: <strong className="text-[#38ef7d]">246625562</strong>
            </span>
            <span className="text-neutral-700">|</span>
            <span className="font-cn">
              地点: <strong className="text-neutral-300">河南城建学院电气工程学院</strong>
            </span>
          </div>
        </div>
      </SnapSection>
    </main>
  );
}
