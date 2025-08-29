// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 bg-black/80 text-gray-200 flex flex-col md:flex-row items-center justify-between mt-10">
      <div>
        <span>© {new Date().getFullYear()} Mira Cars | </span>
        <span>Premium Car Rental in Crete</span>
      </div>
      <div className="flex gap-4 mt-3 md:mt-0">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="tel:+302810000000" target="_blank" rel="noopener noreferrer">Τηλέφωνο</a>
      </div>
    </footer>
  );
}
