// src/components/AdminPanel.tsx
export default function AdminPanel() {
  return (
    <section className="max-w-4xl mx-auto py-10 px-6 bg-black/30 rounded-xl shadow-2xl mt-8">
      <h2 className="text-3xl font-bold mb-8 text-white">Admin Panel (Demo)</h2>
      <div className="bg-white/20 rounded-xl p-8 text-white">
        <p>Εδώ θα εμφανίζονται όλες οι κρατήσεις (από Google Sheets), με λειτουργίες approve/cancel/export κλπ.</p>
      </div>
    </section>
  );
}
