import "./globals.css";
import Image from "next/image";
import { Playfair_Display, Inter } from "next/font/google";

const heading = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "EBS Barbers",
  description: "Premium barbershop in Borough Green, Sevenoaks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body style={{ fontFamily: "var(--font-body)" }}>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
          <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-center">
            {/* Centered logo */}
            <a href="/" className="flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="EBS Barbers logo"
                width={140}
                height={40}
                priority
              />
            </a>

            {/* Right-side nav (kept but visually secondary) */}
            <nav className="absolute right-6 hidden md:flex gap-8 text-sm">
              <a
                href="#services"
                className="text-white/90 hover:text-[#e1a730] transition"
              >
                Services
              </a>
              <a
                href="#location"
                className="text-white/90 hover:text-[#e1a730] transition"
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
