import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TypographyProvider } from "@/contexts/TypographyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Typegraph",
  description: "A web-based experimental typography editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TypographyProvider>
            {children}
          </TypographyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
