import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { brand } from "@/config/brand";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ToastProvider } from "@/components/providers/toast-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: `${brand.name} â€” ${brand.tagline}`,
  description: brand.description,
  metadataBase: new URL(brand.siteUrl),
  openGraph: {
    title: `${brand.name} â€” ${brand.tagline}`,
    description: brand.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: brand.colors.canvas,
  colorScheme: "dark",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
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