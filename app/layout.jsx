import { Inter } from "next/font/google";
import { Space_Grotesk } from 'next/font/google';
import { NextThemeProvider } from "./ThemeProvider";
import './globals.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap', // This is important for performance
  variable: '--font-space-grotesk', // This makes the font available as a CSS variable
});

export const metadata = {
  title: "Rudra",
  description: "my portfolio.",
  icons: {
    icon: "/favicon2.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}
