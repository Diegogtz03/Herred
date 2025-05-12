import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased overflow-hidden`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
