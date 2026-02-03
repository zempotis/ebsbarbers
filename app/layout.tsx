import "./globals.css";

export const metadata = {
  title: "EBS Barbers",
  description: "Premium barbershop. Clean fades. Sharp beards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/15">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a
              href="/"
              className="font-bold tracking-wide text-white text-lg"
            >
              EBS BARBERS
            </a>

            <nav className="hidden md:flex gap-8 text-sm">
              <a
                href="#services"
                className="text-white hover:text-amber-300 transition focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
              >
                Services
              </a>
              <a
                href="#location"
                className="text-white hover:text-amber-300 transition focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
              >
                Location
              </a>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
