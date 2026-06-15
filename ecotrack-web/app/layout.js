import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--app-font-sans",
});

export const metadata = {
  title: "EcoTrack AI — Your Personal Carbon Footprint Tracker",
  description: "Track, reduce, and optimize your carbon footprint with precision-engineered AI insights and satisfying gamification.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
