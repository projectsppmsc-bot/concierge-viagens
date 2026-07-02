import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { SearchProvider } from "@/context/SearchContext";
import { ConciergeProvider } from "@/context/ConciergeContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <SearchProvider>
            <ConciergeProvider>
              {children}
            </ConciergeProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
