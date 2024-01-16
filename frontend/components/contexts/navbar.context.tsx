"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";

interface NavbarState {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

const defaultNavbarState: NavbarState = {
  isOpen: false,
  setIsOpen: () => {},
  title: "",
  setTitle: () => {},
};

export const NavbarContext = createContext<NavbarState>(defaultNavbarState);

export default function NavbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <NavbarContext.Provider value={{ isOpen, setIsOpen, title, setTitle }}>
      {children}
    </NavbarContext.Provider>
  );
}
