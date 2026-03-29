import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sequenta Health Coaching",
  description: "Executive Health Coaching Platform powered by Sequenta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-zinc-100 selection:bg-lime-500/30">
        <AuthProvider>
          <div className="relative min-h-screen overflow-hidden">
            {/* Layer 1: Fixed Ambient Glows */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed -top-40 right-[-20%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-0 left-[-10%] w-[800px] h-[400px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Layer 2: Technical Mesh Grid */}
            <div className="lumina-grid pointer-events-none" />

            {/* Layer 3: Main Navigation & Content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
