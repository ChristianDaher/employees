import CustomLink from "@/components/custom-link";
import { CustomLinkProps } from "@/utils/interfaces/components";
import { useContext } from "react";
import { NavbarContext } from "@/components/contexts/navbar.context";

export default function Navbar() {
  const { isOpen, setIsOpen, setTitle } = useContext(NavbarContext);

  const links = [
    {
      title: "home",
      children: [
        { href: "/departments", title: "Departments", icon: "pi-building" },
        { href: "/regions", title: "Regions", icon: "pi-map" },
        { href: "/users", title: "Users", icon: "pi-user" },
        { href: "/customers", title: "Customers", icon: "pi-briefcase" },
        { href: "/contacts", title: "Contacts", icon: "pi-phone" },
      ],
    },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-95 inset-0 bg-black/50 ${
          isOpen ? "w-screen h-screen" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <nav
        className={`fixed z-99 top-0 left-0 h-screen overflow-y-auto bg-default rounded-md shadow-md w-64 py-2 px-6 transform transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        <ul>
          {links.map((link, linkIndex) => (
            <li key={linkIndex} className="text-primary font-bold capitalize">
              <p className="my-1">{link.title}</p>
              <ul className="text-sm text-secondary flex flex-col gap-1 px-2">
                {link.children.map(
                  (child: CustomLinkProps, childIndex: number) => (
                    <li key={childIndex}>
                      <CustomLink
                        href={child.href}
                        title={child.title}
                        icon={child.icon}
                        onClick={() => setTitle(child.title)}
                      />
                    </li>
                  )
                )}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
