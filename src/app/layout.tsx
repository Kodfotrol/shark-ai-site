import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shark AI — Уничтожитель Syntx",
  description:
    "Shark AI — создавай изображения, сайты, ботов и приложения с помощью нейросетей. Быстро, удобно, без VPN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
