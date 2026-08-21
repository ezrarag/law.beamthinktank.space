import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthBootstrapper } from "@/components/AuthBootstrapper";
import { AppLayoutShell } from "@/components/AppLayoutShell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BEAM Law & Legal Operations Hub",
  description: "Shared-state legal task aggregator, multi-ngo regulatory compliance hub, and earn-while-learning practicum workspace under licensed attorney supervision.",
  keywords: "legal aid, justice, law, community, IP support, governance reform, BEAM, legal operations, practicum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#070912] text-slate-100 antialiased`}>
        <AuthBootstrapper>
          <AppLayoutShell>{children}</AppLayoutShell>
        </AuthBootstrapper>
      </body>
    </html>
  );
}
