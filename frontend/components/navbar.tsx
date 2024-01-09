import CustomLink from "@/components/custom-link";
import { CustomLinkProps } from "@/utils/interfaces/components";
import { useContext } from "react";
import { NavbarContext } from "@/components/contexts/navbar.context";

export default function Navbar() {
  const { isOpen, setTitle } = useContext(NavbarContext);

  const links: CustomLinkProps[] = [
    { href: "/departments", title: "Departments", icon: "pi-building" },
    { href: "/regions", title: "Regions", icon: "pi-map" },
    { href: "/users", title: "Users", icon: "pi-user" },
    { href: "/customers", title: "Customers", icon: "pi-briefcase" },
    { href: "/contacts", title: "Contacts", icon: "pi-phone" },
  ];

  // work with lg breakpoint
  return (
    <nav
      className={`fixed z-99 h-[calc(100%-9rem)] overflow-y-auto top-24 left-8 bg-default rounded-md shadow-md w-60 py-2 px-6 transform transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-[120%]"
      }`}
    >
      <ul className="text-sm flex flex-col gap-1">
        {links.map((link, index) => (
          <li key={index}>
            <CustomLink
              href={link.href}
              title={link.title}
              icon={link.icon}
              onClick={() => setTitle(link.title)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
