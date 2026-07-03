import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HITU | جامعة حلوان التكنولوجية الدولية",
    template: "%s | HITU",
  },
  description:
    "المنصة الرقمية الرسمية لجامعة حلوان التكنولوجية الدولية - الأقسام العلمية، الجداول الذكية، المساعد الذكي، وأكثر",
  keywords: [
    "HITU",
    "جامعة حلوان التكنولوجية الدولية",
    "Helwan International Technology University",
    "ذكاء اصطناعي",
    "علوم بيانات",
    "أمن سيبراني",
    "ميكاترونكس",
    "أوتوترونكس",
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "HITU Platform",
    title: "HITU | جامعة حلوان التكنولوجية الدولية",
    description:
      "المنصة الرقمية الرسمية لجامعة حلوان التكنولوجية الدولية",
    images: [
      {
        url: "https://nbrain-hitu.web.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "جامعة حلوان التكنولوجية الدولية - HITU",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HITU | جامعة حلوان التكنولوجية الدولية",
    description: "المنصة الرقمية الرسمية لجامعة حلوان التكنولوجية الدولية",
    images: ["https://nbrain-hitu.web.app/og-image.png"],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#050505" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${cairo.variable} ${inter.variable} font-[family-name:var(--font-cairo)] bg-[#050505] text-gray-100 min-h-screen antialiased`}
        style={{ colorScheme: 'dark' }}
      >
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
