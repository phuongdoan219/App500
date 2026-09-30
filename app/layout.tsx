import type { Metadata } from "next";
import ReferralProgram from "@/components/referral-program";
import "./globals.css";
import "./referral.css";

export const metadata: Metadata = {
  title: "English in Wonderland",
  description: "Học tiếng Anh qua câu chuyện, luyện tập và lồng tiếng có hướng dẫn.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
        <ReferralProgram />
      </body>
    </html>
  );
}
