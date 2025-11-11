import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "todump - AI Todo App",
  description: "A todo app for people who are bad at todo apps",
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
