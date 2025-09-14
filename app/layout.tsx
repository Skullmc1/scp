import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "SCP Foundation DB",
  description: "A database of SCP Foundation articles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
