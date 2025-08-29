// src/components/BookingForm.tsx
import { useState } from 'react';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    car: '',
    from: '',
    to: '',
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Η κράτησή σας υποβλήθηκε! (Στο επόμενο βήμα θα πηγαίνει Google Sheet)');
  };

  return (
    <form className="max-w-lg mx-auto my-12 bg-white/20 rounded-xl p-8 shadow-2xl" onSubmit={handleSubmit}>
      {step === 1 && (
        <>
          <h3 className="text-2xl font-bold mb-4 text-white">1. Επιλογή Αυτοκινήτου</h3>
          <select name="car" value={form.car} onChange={handleChange} className="w-full p-2 rounded mb-6">
            <option value="">Επιλέξτε όχημα</option>
            <option value="Fiat 500">Fiat 500</option>
            <option value="BMW X1">BMW X1</option>
            <option value="Mercedes E-Class">Mercedes E-Class</option>
          </select>
          <button type="button" onClick={handleNext} className="btn-primary w-full">Επόμενο</button>
        </>
      )}
      {step === 2 && (
        <>
          <h3 className="text-2xl font-bold mb-4 text-white">2. Ημερομηνίες</h3>
          <input name="from" type="date" value={form.from} onChange={handleChange} className="w-full mb-4 p-2 rounded" required />
          <input name="to" type="date" value={form.to} onChange={handleChange} className="w-full mb-4 p-2 rounded" required />
          <div className="flex justify-between">
            <button type="button" onClick={handleBack} className="btn-secondary">Πίσω</button>
            <button type="button" onClick={handleNext} className="btn-primary">Επόμενο</button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h3 className="text-2xl font-bold mb-4 text-white">3. Στοιχεία Πελάτη</h3>
          <input name="name" placeholder="Ονοματεπώνυμο" value={form.name} onChange={handleChange} className="w-full mb-3 p-2 rounded" required />
          <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} className="w-full mb-3 p-2 rounded" required />
          <input name="phone" placeholder="Τηλέφωνο" value={form.phone} onChange={handleChange} className="w-full mb-3 p-2 rounded" required />
          <div className="flex justify-between">
            <button type="button" onClick={handleBack} className="btn-secondary">Πίσω</button>
            <button type="submit" className="btn-primary">Υποβολή</button>
          </div>
        </>
      )}
    </form>
  );
}
