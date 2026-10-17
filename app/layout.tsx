import type { Metadata } from "next";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource/share-tech-mono";
import "./fonts/smiley-sans.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobilePager from "./components/MobilePager";
import TerminalBackdrop from "./components/TerminalBackdrop";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUUC-EEA | 河南城建学院电子爱好者协会",
  description:
    "河南城建学院电子爱好者协会（HUUC-EEA）——电子数码爱好者校园聚集地。嵌入式、电路与开源硬件的极客实验室。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased scroll-smooth"
    >
      {/* 首屏导航栏 / Hero 立即用到的像素字体子集，提前发起请求避免 swap 闪烁 */}
      <link
        rel="preload"
        href="/fonts/fusion-pixel-12px-proportional-sc.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <body className="min-h-full flex flex-col bg-term text-neutral-300">
        <TerminalBackdrop />
        <Navbar />
        <MobilePager />
        {children}
        <Footer />
      </body>
    </html>
  );
}
