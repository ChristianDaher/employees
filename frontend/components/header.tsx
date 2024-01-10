import { useContext } from "react";
import { NavbarContext } from "@/components/contexts/navbar.context";

export default function Header() {
  const { isOpen, setIsOpen, title } = useContext(NavbarContext);

  return (
    <header className="py-4 px-8 flex justify-end items-center gap-4 shadow-md fixed top-0 left-0 z-25 w-full bg-default">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-cursor rounded-full w-10 h-10 flex items-center justify-center transition duration-200 text-secondary hover:text-primary hover:bg-hover outline-none focus:ring-2 ring-accent/50"
      >
        <i className="pi pi-bars text-xl" />
      </button>
    </header>
  );
}
