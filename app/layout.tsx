import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { brand } from "@/config/brand";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ToastProvider } from "@/components/providers/toast-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { auth } from "@/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  metadataBase: new URL(brand.siteUrl),
  icons: {
    icon: "/images/brand/icon.svg",
    shortcut: "/images/brand/icon.svg",
    apple: "apple-touch-icon.png",
  },
  openGraph: {
    title: {
      default: `${brand.name} — ${brand.tagline}`,
      template: `%s | ${brand.name}`,
    },
    description: brand.description,
    siteName: brand.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: `${brand.name} — ${brand.tagline}`,
      template: `%s | ${brand.name}`,
    },
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: brand.colors.canvas,
  colorScheme: "light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ToastProvider>
          <StoreProvider>
            <Navbar session={session} />
            {children}
            <Footer />
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}