// src/app/booking/page.tsx
import BookingForm from '@/components/BookingForm';

export default function BookingPage() {
  return (
    <div>
      <h2 className="text-center text-4xl font-bold mt-10 mb-6 text-white">Κράτηση Αυτοκινήτου</h2>
      <BookingForm />
    </div>
  );
}
