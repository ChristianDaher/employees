import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ripple } from "primereact/ripple";
import { CustomLinkProps } from "@/utils/interfaces/components";

export default function CustomLink({
  href,
  title,
  icon,
}: CustomLinkProps) {
  const path = usePathname();
  const isActive = path === href;

  return (
    <Link
      href={href}
      className={`flex gap-2 items-center p-2.5 p-ripple transition duration-200 hover:bg-hover outline-none focus:ring-2 ring-accent/50 rounded-md ${
        isActive ? "font-bold text-accent ring-2" : ""
      }`}
    >
      <i className={`pi ${icon}`} />
      {title}
      <Ripple />
    </Link>
  );
}
