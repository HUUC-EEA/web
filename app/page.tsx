import SnapSection from "./components/SnapSection";
import HeroTerminal from "./components/HeroTerminal";
import NeofetchTerminal from "./components/NeofetchTerminal";
import { JOIN_URL } from "./links";

const REPO_ENTRIES = [
  {
    key: "REPO",
    cn: "社团项目仓库",
    desc: "本站源码、社团项目与硬件资料都在这里，欢迎 Star / Fork / 提 PR。",
    href: "https://github.com/HUUC-EEA/EEA",
    handle: "HUUC-EEA/EEA",
  },
  {
    key: "ACCOUNT",
    cn: "公共账号",
    desc: "协会对外的发布通道：活动记录、实验笔记与成员开源作品。",
    href: "https://github.com/HUUCEEA",
    handle: "HUUCEEA",
  },
  {
    key: "ORG",
    cn: "GitHub 组织",
    desc: "协会名下所有仓库的统一入口，社员可申请加入组织协作开发。",
    href: "https://github.com/HUUC-EEA",
    handle: "HUUC-EEA",
  },
];

export default function Home() {
  return (
    <main className="flex-grow">
      {/* 首页：终端 Hero（串口引导 + ASCII 星球 + HUUC-EAA 标题） */}
      <SnapSection id="home">
        <HeroTerminal />
      </SnapSection>

      {/* 系统配置：仿 Linux Konsole 的 neofetch 输出，滚动到此时逐字打出 */}
      <SnapSection id="neofetch">
        <NeofetchTerminal />
      </SnapSection>

      {/* 关于我们：内容未定，先留一个空的长条面板占位 */}
      <SnapSection id="about">
        <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-20">
          <div className="font-tech text-xs sm:text-sm text-neutral-500 mb-3 flex items-center gap-2">
            <span className="text-[#38ef7d]">02.</span>
            <span>ABOUT_US</span>
          </div>
          <h2 className="text-2xl sm:text-4xl tracking-wider text-white title-glow flex items-center gap-3">
            <span className="font-display">关于我们</span>
            <span className="text-neutral-700 font-tech text-lg sm:text-2xl">/</span>
          </h2>

          <div className="mt-8 min-h-[42vh] rounded border border-neutral-800/90 bg-black/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <span className="font-tech text-xs tracking-widest text-neutral-700">
              CONTENT_PENDING
            </span>
          </div>
        </div>
      </SnapSection>

      {/* 社团仓库：GitHub 仓库 / 公共账号 / 组织 */}
      <SnapSection id="repo">
        <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-20">
          <div className="font-tech text-xs sm:text-sm text-neutral-500 mb-3 flex items-center gap-2">
            <span className="text-[#38ef7d]">03.</span>
            <span>REPOSITORY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl tracking-wider text-white title-glow flex items-center gap-3">
            <span className="font-display">社团仓库</span>
            <span className="text-neutral-700 font-tech text-lg sm:text-2xl">/</span>
          </h2>

          <p className="font-cn text-sm sm:text-base text-neutral-400 leading-relaxed mt-4 max-w-2xl">
            协会的代码、图纸与文档全部开源在 GitHub 上：一个存放项目源码的仓库、
            一个对外发布记录的公共账号，以及统管协会全部项目的 GitHub 组织。
            欢迎围观、Star，或者直接提一个 PR 把你的作品挂进来。
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {REPO_ENTRIES.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded border border-neutral-800/90 bg-black/40 px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-5 hover:border-[#38ef7d]/50 hover:bg-[#38ef7d]/[0.04] transition-colors"
              >
                <span className="font-tech text-xs tracking-widest text-[#38ef7d] shrink-0 sm:w-24">
                  {item.key}
                </span>
                <span className="font-display text-base sm:text-lg text-neutral-100 shrink-0">
                  {item.cn}
                </span>
                <span className="font-cn text-xs sm:text-sm text-neutral-500 leading-relaxed flex-1">
                  {item.desc}
                </span>
                <span className="font-tech text-xs text-neutral-500 group-hover:text-[#00f5d4] transition-colors shrink-0">
                  {item.handle} ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </SnapSection>

      {/* 加入我们：终端指令风格 CTA */}
      <SnapSection id="join">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-12 flex flex-col items-center text-center">
          <div className="font-tech text-xs sm:text-sm text-neutral-500 mb-4 flex items-center gap-2">
            <span className="text-[#38ef7d]">$</span>
            <span>./join --huuc-eea --now</span>
            <span className="terminal-cursor">█</span>
          </div>

          <h2 className="text-2xl sm:text-4xl tracking-wider text-white title-glow flex items-center gap-3">
            <span className="font-tech text-[#38ef7d]">JOIN US</span>
            <span className="text-neutral-600 font-tech">{"//"}</span>
            <span className="font-display">加入我们</span>
          </h2>

          <p className="font-cn text-sm sm:text-base text-neutral-400 leading-relaxed mt-4 max-w-xl">
            无论你是零基础的大一新生，还是身经百赛的硬件极客，
            只要热爱电子与创造，这里就有你的工位与焊台。
          </p>

          <div className="mt-7">
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
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
