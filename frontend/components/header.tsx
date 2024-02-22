import { useContext } from "react";
import { NavbarContext } from "@/components/contexts/navbar.context";

export default function Header() {
  const { isOpen, setIsOpen, title } = useContext(NavbarContext);

  return (
    <div className="py-4 px-8 shadow-md fixed top-0 left-0 z-[999] w-full bg-default">
      <header className="flex items-center gap-4 mx-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-cursor rounded-full w-10 h-10 flex items-center justify-center transition duration-200 text-secondary hover:text-primary hover:bg-hover outline-none focus:ring-2 ring-accent/50"
        >
          <i className="pi pi-bars text-xl" />
        </button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
    </div>
  );
}
