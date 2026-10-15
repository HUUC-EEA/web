import Image from "next/image";

export default function Footer() {
  return (
    <footer className="snap-start bg-navy text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3">
            <Image
              src="/logo-full.jpg"
              alt="电子爱好者协会 Logo"
              width={320}
              height={280}
              className="w-48 sm:w-60 h-auto rounded-2xl"
            />
            <p className="text-xs text-white/50 max-w-xs leading-relaxed">
              电子数码爱好者校园聚集地
            </p>
          </div>

          <div className="flex gap-16 text-sm">
            <div className="space-y-2.5">
              <p className="text-xs text-white/40 font-medium tracking-wider">
                导航
              </p>
              <a href="#home" className="block text-white/70 hover:text-white transition-colors text-xs">
                首页
              </a>
              <a href="#projects" className="block text-white/70 hover:text-white transition-colors text-xs">
                社团项目
              </a>
              <a href="#join" className="block text-white/70 hover:text-white transition-colors text-xs">
                加入我们
              </a>
              <a href="#about" className="block text-white/70 hover:text-white transition-colors text-xs">
                关于我们
              </a>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs text-white/40 font-medium tracking-wider">
                联系
              </p>
              <p className="text-white/70 text-xs">QQ 群：246625562</p>
              <p className="text-white/70 text-xs">邮箱：待填写</p>
              <p className="text-white/70 text-xs">地点：河南城建学院电气工程学院</p>
              <p className="text-white/70 text-xs">域名：eea.huuc.top</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/40">
          <p>河南城建学院 · 电子爱好者协会</p>
          <p className="font-mono">© 2026 EEA · HUUC · eea.huuc.top</p>
        </div>
      </div>
    </footer>
  );
}
