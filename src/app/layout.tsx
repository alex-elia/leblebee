import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { ProductAssistant } from "@/components/product-assistant";
import { getLocale } from "@/lib/i18n/get-locale";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext", "greek"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Leblebee",
    template: "%s · Leblebee",
  },
  description:
    "Easier short-term rental ops for apartment and house owners, and for local suppliers who manage several owners. Better stays, more return.",
  metadataBase: new URL("https://www.leblebee.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink">
        {children}
        <ProductAssistant />
      </body>
    </html>
  );
}
