import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
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
    "Bilingual host–provider ops for short-term rentals. Clear tasks, shared context, better stays.",
  metadataBase: new URL("https://leblebee.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink">{children}</body>
    </html>
  );
}
