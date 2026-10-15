import SnapSection from "./components/SnapSection";
import HeroIcons from "./components/HeroIcons";

export default function Home() {
  return (
    <main className="flex-grow">
      {/* Hero：全屏首屏，独立区块便于快速加载 */}
      <SnapSection id="home">
        <div className="relative text-center max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-12 space-y-6">
          <HeroIcons />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-periwinkle via-teal-blue to-navy">
              电子爱好者协会
            </span>
          </h1>

          <p className="font-mono text-xs sm:text-sm text-steel/50 tracking-widest uppercase">
            Electronics Enthusiasts Association
          </p>

          <p className="text-base sm:text-lg text-steel/60 leading-relaxed max-w-xl mx-auto">
            电子数码爱好者校园聚集地
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#join"
              className="px-6 py-3 rounded-full bg-navy hover:bg-steel text-white text-sm font-medium transition-colors"
            >
              加入我们
            </a>
            <a
              href="#about"
              className="px-6 py-3 rounded-full border border-mist bg-white hover:bg-mist/30 text-steel text-sm font-medium transition-colors"
            >
              了解更多
            </a>
          </div>
        </div>
      </SnapSection>

      {/* 关于我们（占位区块） */}
      <SnapSection id="about">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-teal-blue">/about</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-steel mt-1">
                关于我们
              </h2>
            </div>
            <p className="text-sm text-steel/50">区块副标题占位</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="soft-card rounded-3xl p-7 space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-mist/50" />
                <div className="space-y-2.5">
                  <h3 className="text-lg font-semibold text-steel">
                    区块标题 {i}
                  </h3>
                  <p className="text-sm text-steel/60 leading-relaxed">
                    区块描述占位文案，后续补充社团相关内容。
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SnapSection>

      {/* 社团项目（占位区块） */}
      <SnapSection id="projects" className="bg-mist/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-teal-blue">/projects</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-steel mt-1">
                社团项目
              </h2>
            </div>
            <p className="text-sm text-steel/50">区块副标题占位</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <a
                key={i}
                href="#"
                className="soft-card rounded-3xl p-6 space-y-4 block"
              >
                <div className="aspect-[16/10] rounded-2xl bg-mist/40" />
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-steel">
                    项目名称 {i}
                  </h3>
                  <p className="text-sm text-steel/60 leading-relaxed">
                    项目简介占位文案。
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </SnapSection>

      {/* 加入我们（占位区块） */}
      <SnapSection id="join">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12">
          <div className="rounded-3xl bg-navy text-white px-7 sm:px-12 py-14 sm:py-20 flex flex-col items-center text-center gap-6">
            <h2 className="text-2xl sm:text-3xl font-semibold">加入我们</h2>
            <p className="text-sm text-white/60 max-w-md leading-relaxed">
              招新说明占位文案，此处后续放置 QQ 群号与二维码。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button className="px-6 py-3 rounded-full bg-white text-navy text-sm font-medium hover:bg-mist transition-colors">
                加入社群（占位）
              </button>
              <button className="px-6 py-3 rounded-full border border-white/25 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                联系方式（占位）
              </button>
            </div>
          </div>
        </div>
      </SnapSection>
    </main>
  );
}
