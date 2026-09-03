import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "测测你的本命鸟｜15种中国野生鸟格",
  description:
    "12个判断，找到与你共享一套飞行方式的中国野生鸟。答案只在本地计算，不按稀有度分配结果。",
  applicationName: "测测你的本命鸟",
  keywords: ["本命鸟", "人格测试", "中国鸟类", "观鸟", "性格测试"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "测测你的本命鸟",
    description: "15种中国野生鸟格，哪一只与你共享飞行方式？",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "麻雀、长耳鸮与中华凤头燕鸥组成的本命鸟图鉴封面",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
