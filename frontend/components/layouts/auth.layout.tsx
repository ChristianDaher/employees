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
      <main className="pt-32 px-8 pb-8">
        <div className="bg-default rounded-md shadow-md transition-all duration-200 p-8">
          {children}
        </div>
      </main>
    </>
  );
}
