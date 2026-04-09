import type { Metadata } from "next";
import { Noto_Sans_KR, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const primaryFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
});

const koreanFont = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-korean",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "kurope Table",
  description: "kurope Table FE",
  icons: {
    icon: "/images/pabicon.png",
    shortcut: "/images/pabicon.png",
    apple: "/images/pabicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${primaryFont.variable} ${koreanFont.variable}`}>{children}</body>
    </html>
  );
}
