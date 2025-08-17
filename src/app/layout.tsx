import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BEAM Law & Justice League",
  description: "Empowering communities through legal aid, IP support, and governance reform. Join the fight for justice and equality.",
  keywords: "legal aid, justice, law, community, IP support, governance reform, BEAM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
