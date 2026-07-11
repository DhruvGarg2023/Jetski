import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Jetski",
    default: "Jetski - Real-Time AI Code Reviewer",
  },
  description: "Modern, production-grade AI code reviewer platform to streamline your development workflow with instant feedback and insights.",
  keywords: ["AI Code Review", "GitHub Integration", "Developer Tools", "Code Quality", "Jetski"],
  authors: [{ name: "Jetski Team" }],
  openGraph: {
    title: "Jetski - Real-Time AI Code Reviewer",
    description: "Modern, production-grade AI code reviewer platform to streamline your development workflow with instant feedback and insights.",
    url: "https://jetski.dev",
    siteName: "Jetski",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jetski - Real-Time AI Code Reviewer",
    description: "Modern, production-grade AI code reviewer platform.",
  },
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
