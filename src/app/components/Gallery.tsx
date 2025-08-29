// src/components/Gallery.tsx
export const sampleCars = [
  {
    name: 'Fiat 500',
    img: '/cars/fiat500.jpg',
    category: 'Economy',
  },
  {
    name: 'BMW X1',
    img: '/cars/bmwx1.jpg',
    category: 'SUV',
  },
  {
    name: 'Mercedes E-Class',
    img: '/cars/mercedese.jpg',
    category: 'Luxury',
  },
];

export default function Gallery() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-4 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sampleCars.map(car => (
        <div key={car.name} className="bg-white/10 rounded-xl shadow-lg p-6 hover:scale-105 transition">
          <img src={car.img} alt={car.name} className="w-full h-52 object-cover rounded-lg mb-4" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg text-white">{car.name}</span>
            <span className="bg-teal-500 px-3 py-1 rounded-full text-white text-xs">{car.category}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
