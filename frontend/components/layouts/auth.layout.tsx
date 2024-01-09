import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { useContext } from "react";
import { NavbarContext } from "@/components/contexts/navbar.context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useContext(NavbarContext);

  return (
    <>
      <Header />
      <Navbar />
      <main
        className={`pt-24 px-8 pb-8 transform transition-all duration-200 pointer-events-none ${isOpen ? "w-[calc(100%-17rem)] translate-x-[17rem]" : ""}`}
      >
        {children}
      </main>
    </>
  );
}
