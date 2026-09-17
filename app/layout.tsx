import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { brand } from "@/config/brand";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ToastProvider } from "@/components/providers/toast-provider";
import { StoreProvider } from "@/components/providers/store-provider";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  metadataBase: new URL(brand.siteUrl),
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: brand.colors.canvas,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <StoreProvider>
            <Navbar />
            {children}
            <Footer />
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
