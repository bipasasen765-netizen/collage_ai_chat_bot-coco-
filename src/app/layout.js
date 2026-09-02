import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClickEffect from "./components/ClickEffect"; // <--- ClickEffect ইমপোর্ট

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EIILM Kolkata Jalpaiguri Campus AI Portal",
  description: "Official AI Student Companion Portal",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClickEffect /> {/* <--- গ্লোবালি রেন্ডার করা হলো */}
        {children}
      </body>
    </html>
  );
}