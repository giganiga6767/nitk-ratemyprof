import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NITK RateMyProf",
  description: "Rate your professors at NIT Karnataka, Surathkal — 100% anonymous reviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-gray-50 text-gray-900"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black text-sm">
                N
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white">NITK</span>{" "}
                <span className="text-white/70">RateMyProf</span>
              </span>
            </a>
            <div className="flex gap-3 items-center text-sm font-medium">
              <a
                href="/"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/professors/add"
                className="bg-white text-black px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-sm"
              >
                + Add Professor
              </a>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="bg-black text-white mt-20 py-8">
          <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-black text-xs">
                N
              </div>
              <span className="font-semibold text-sm">NITK RateMyProf</span>
            </div>
            <p className="text-white/30 text-xs text-center">
              NIT Karnataka, Surathkal · All reviews are anonymous and subject to approval
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
