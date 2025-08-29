// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-0">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl px-8 py-14 text-center mt-20"
      >
        <motion.img
          src="/logo.svg"
          alt="Mira Cars"
          className="mx-auto mb-8 w-24 h-24"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow">
          Mira Cars
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-200 font-light">
          Η απόλυτη premium εμπειρία ενοικίασης αυτοκινήτου στην Κρήτη
        </p>
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <Button href="/gallery" className="px-8 py-4 text-lg shadow-lg">Δες τα αυτοκίνητα</Button>
          <Button href="/booking" variant="outline" className="px-8 py-4 text-lg border-white border-2 text-white shadow-lg">
            Κάνε Κράτηση
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
