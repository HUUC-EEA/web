import type { Metadata } from "next";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource/press-start-2p";
import "@fontsource/silkscreen";
import "@fontsource/vt323";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TerminalBackdrop from "./components/TerminalBackdrop";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUUC-EAA | 河南城建学院电子爱好者协会",
  description:
    "河南城建学院电子爱好者协会（HUUC-EAA）——电子数码爱好者校园聚集地。嵌入式、电路与开源硬件的极客实验室。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col bg-term text-neutral-300">
        <TerminalBackdrop />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
