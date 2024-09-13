import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Order Manager",
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
