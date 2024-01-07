import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employees",
  description: "Employee management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-primary">{children}</body>
    </html>
  );
}
