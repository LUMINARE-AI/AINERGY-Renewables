import type { Metadata } from "next";
import { Montserrat, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotFab } from "@/components/copilot/CopilotFab";
import { SITE_URL } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AINERGY — The Energy OS for Business",
    template: "%s | AINERGY",
  },
  description:
    "AINERGY designs, develops and operates renewable-energy infrastructure and uses AI to optimize how businesses generate, procure, store and consume energy.",
  keywords: [
    "renewable energy for businesses",
    "C&I renewable energy India",
    "commercial industrial solar",
    "open access renewable energy",
    "corporate renewable energy",
    "energy-as-a-service",
    "battery energy storage",
    "energy management",
    "AI energy optimization",
    "24x7 renewable energy",
  ],
  authors: [{ name: "AINERGY Renewable LLP" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "AINERGY",
    title: "AINERGY — The Energy OS for Business",
    description:
      "Intelligent clean energy for a more resilient, efficient and sustainable business.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AINERGY — The Energy OS for Business",
    description:
      "Intelligent clean energy for a more resilient, efficient and sustainable business.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AINERGY Renewable LLP",
  alternateName: "AINERGY",
  url: SITE_URL,
  description:
    "AINERGY develops and operates renewable-energy infrastructure and provides intelligent energy solutions for Commercial & Industrial customers in India.",
  slogan: "The Energy OS for Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Navbar />
          <main>{children}</main>
          <Footer />
          <CopilotFab />
      </body>
    </html>
  );
}
