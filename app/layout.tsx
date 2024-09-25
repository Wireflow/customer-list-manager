import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Order Manager",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} h-full`}
      suppressHydrationWarning
    >
      <Providers>
        <body className="h-full overflow-hidden">{children}</body>
      </Providers>
    </html>
  );
}
