import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidMiner - Video Analysis Platform",
  description: "Upload, transcribe, and search through your videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
