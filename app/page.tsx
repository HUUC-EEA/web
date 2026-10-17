import SnapSection from "./components/SnapSection";
import HeroTerminal from "./components/HeroTerminal";

export default function Home() {
  return (
    <main className="flex-grow">
      {/* 首页：终端 Hero（串口引导 + ASCII 星球 + HUUC-EAA 标题） */}
      <SnapSection id="home">
        <HeroTerminal />
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

          <div className="mt-7">
            <a
              href="#join"
              className="join-cta-btn font-cn font-semibold tracking-wider px-6 py-2.5 rounded text-sm"
            >
              + 加入我们
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
