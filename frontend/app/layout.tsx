import type { Metadata } from "next";
import Head from "next/head";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./globals.css";
import NavbarProvider from "@/components/contexts/navbar.context";
import { PrimeReactProvider } from "primereact/api";

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
      <Head>
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
      </Head>
      <body className="font-primary text-primary bg-background">
        <PrimeReactProvider>
          <NavbarProvider>{children}</NavbarProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
