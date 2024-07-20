import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Dosis, Vazirmatn } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/nav/site-header";
import { Footer } from "@/components/nav/footer";

import CookieConsentComponent from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"] });


const dosis = Dosis({ subsets: ["latin"] });
const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "MDX Blog Basic",
  description: "Simple static blog built with Next.js and MDX.",
  keywords: ["next.js", "mdx", "blog", "static"],
};

export default function RootLayout({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug?: string;
}) {

  const direction = "rtl" ;
  const font = vazirmatn;

  return (
    <html lang="en" dir={direction}>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex flex-col items-center  min-h-[calc(100vh-200px)] pt-12 pb-12 px-6 sm:px-0 sm:pt-20 sm:pb-20">
            <div className="flex justify-center text-lg sm:text-base max-w-5xl w-full mx-auto">
              {children}
            </div>
          </main>
          <CookieConsentComponent />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
