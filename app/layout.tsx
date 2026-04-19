import { Work_Sans, Inter } from "next/font/google";

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Figma Clone",
  description: "A minimalist Figma clone using fabric.js",
};

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en' className={cn("font-sans", inter.variable)}>
    <body className={`${workSans.className} bg-background`}>
      <TooltipProvider>{children}</TooltipProvider>
    </body>
  </html>
);

export default RootLayout;
