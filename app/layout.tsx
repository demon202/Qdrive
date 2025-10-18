import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { UploadSyncProvider } from "@/components/UploadSyncProvider";

const poppins = Poppins ({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',

})
export const metadata: Metadata = {
  title: "Qdrive",
  description: "Store, hoard or download your data today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff0000" />
      </head>
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <UploadSyncProvider />
        {children}
      </body>
    </html>
  );
}
