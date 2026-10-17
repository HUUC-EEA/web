import { JOIN_URL } from "../links";

export default function Footer() {
  return (
    <footer className="snap-start relative z-30 w-full border-t border-neutral-900 bg-[#050706]/95">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38ef7d] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38ef7d]" />
              </span>
              <span className="font-display text-base tracking-wider text-neutral-100">
                河南城建学院电子爱好者协会
              </span>
              <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#38ef7d]/10 text-[#38ef7d] border border-[#38ef7d]/40 tracking-widest">
                HUUCEEA
              </span>
            </div>
            <p className="font-cn text-xs text-neutral-500 tracking-wide">
              电子数码爱好者校园聚集地
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 font-mono text-[11px] sm:text-xs">
              <span className="text-neutral-600">
                QQ: <strong className="text-neutral-300">246625562</strong>
              </span>
              <span className="text-neutral-600">
                MAIL: <strong className="text-neutral-300">eea@huuc.top</strong>
              </span>
              <span className="text-neutral-600">
                ADDR: <strong className="font-cn text-neutral-300">河南城建学院电气工程学院</strong>
              </span>
              <span className="text-neutral-600">
                HOST: <strong className="text-[#38ef7d]">eea.huuc.top</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] sm:text-xs text-neutral-600">
              <span className="text-neutral-700">NAV:</span>
              <a href="#home" className="font-cn hover:text-[#38ef7d] transition-colors">
                首页
              </a>
              <a href="#about" className="font-cn hover:text-[#38ef7d] transition-colors">
                关于我们
              </a>
              <a href="#repo" className="font-cn hover:text-[#38ef7d] transition-colors">
                社团仓库
              </a>
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-cn hover:text-[#38ef7d] transition-colors"
              >
                加入我们
              </a>
              <span className="text-neutral-800">|</span>
              <span className="font-cn">招新咨询请加 QQ 群</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-neutral-600">
          <span>© 2026 HUUC-EAA · ALL RIGHTS RESERVED</span>
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>
              BUILT_WITH: <strong className="text-neutral-500">Next.js 16 · Tailwind CSS 4</strong>
            </span>
            <span>
              STATUS: <strong className="text-[#00f5d4]">ACTIVE_ONLINE</strong>
            </span>
          </span>
        </div>

        <div className="mt-3 font-tech text-[11px] tracking-widest text-neutral-600 text-center sm:text-left">
          SITE_BY: <strong className="text-neutral-400">ShanyJin</strong>
        </div>
      </div>
    </footer>
  );
}
