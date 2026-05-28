import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalFooter from "../components/GlobalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Split Bill",
  description: "Seamlessly scan receipts and split bills. Developed by stevenmulya@gmail.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          padding: '12px', 
          fontSize: '13px', 
          color: '#64748b', 
          zIndex: 100,
          pointerEvents: 'none' // Allows clicking through if not exactly on text
        }}>
          <a 
            href="mailto:stevenmulya@gmail.com" 
            style={{ 
              textDecoration: 'none', 
              color: 'inherit', 
              opacity: 0.8,
              pointerEvents: 'auto'
            }}
          >
            Split Bill — Developed by stevenmulya@gmail.com
          </a>
        </header>
        {children}
        <GlobalFooter />
      </body>
    </html>
  );
}
