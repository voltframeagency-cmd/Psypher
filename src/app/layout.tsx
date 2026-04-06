import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-eb-garamond" });

export const metadata: Metadata = {
  title: "PSYPHER | The Intelligence Layer for Human Communication",
  description: "Transform fragmented communication into actionable psychological intelligence. Advanced human intelligence parsing for executive decision-making.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} ${ebGaramond.variable}`}>
      <body className={inter.className}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
