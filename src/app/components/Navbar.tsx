// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-md flex justify-between items-center px-6 py-3 shadow-xl">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-xl text-white tracking-widest">Mira Cars</span>
      </Link>
      <div className="flex gap-6">
        <Link href="/gallery" className="text-white hover:text-teal-300 transition">Στόλος</Link>
        <Link href="/booking" className="text-white hover:text-teal-300 transition">Κράτηση</Link>
        <Link href="/admin" className="text-white hover:text-rose-300 transition">Admin</Link>
      </div>
    </nav>
  );
}
