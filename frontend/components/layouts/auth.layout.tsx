export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav> navbar </nav>
      <main>{children}</main>
    </>
  );
}
