import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Newsreader } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { DisclaimerGate } from "@/components/DisclaimerGate";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const sans = Newsreader({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "modih.in | Political satire, responsibly moderated",
  description: "A moderated meme platform for political satire and parody.",
  openGraph: {
    title: "modih.in",
    description: "Political satire and parody memes, responsibly moderated.",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <NavBar />
        <DisclaimerGate />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
