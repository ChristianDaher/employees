import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Navbar />
      <main className="pt-24 px-8 pb-8">{children}</main>
    </>
  );
}
