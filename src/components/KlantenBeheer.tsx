import React, { useState } from 'react';
import { useStore } from '../store';
import { Klant } from '../types';
import { UserPlus, Trash2 } from 'lucide-react';

export function KlantenBeheer() {
  const { klanten, addKlant } = useStore();
  const [nieuweKlant, setNieuweKlant] = useState<Partial<Klant>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nieuweKlant.naam && nieuweKlant.email) {
      addKlant({
        id: Date.now().toString(),
        naam: nieuweKlant.naam,
        bedrijf: nieuweKlant.bedrijf || '',
        email: nieuweKlant.email,
        telefoon: nieuweKlant.telefoon || '',
        adres: nieuweKlant.adres || '',
        postcode: nieuweKlant.postcode || '',
        plaats: nieuweKlant.plaats || '',
        kvkNummer: nieuweKlant.kvkNummer,
        btwNummer: nieuweKlant.btwNummer,
      });
      setNieuweKlant({});
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-red-100">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-red-800">
          <UserPlus className="mr-2" />
          Nieuwe Klant Toevoegen
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Naam</label>
              <input
                type="text"
                value={nieuweKlant.naam || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, naam: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bedrijf</label>
              <input
                type="text"
                value={nieuweKlant.bedrijf || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, bedrijf: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={nieuweKlant.email || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefoon</label>
              <input
                type="tel"
                value={nieuweKlant.telefoon || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, telefoon: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adres</label>
              <input
                type="text"
                value={nieuweKlant.adres || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, adres: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postcode</label>
              <input
                type="text"
                value={nieuweKlant.postcode || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, postcode: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plaats</label>
              <input
                type="text"
                value={nieuweKlant.plaats || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, plaats: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">KvK Nummer</label>
              <input
                type="text"
                value={nieuweKlant.kvkNummer || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, kvkNummer: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">BTW Nummer</label>
              <input
                type="text"
                value={nieuweKlant.btwNummer || ''}
                onChange={(e) => setNieuweKlant({ ...nieuweKlant, btwNummer: e.target.value })}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Klant Toevoegen
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-red-100">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Klantenlijst</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Naam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Bedrijf
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Telefoon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {klanten.map((klant) => (
                <tr key={klant.id} className="hover:bg-red-50">
                  <td className="px-6 py-4 whitespace-nowrap">{klant.naam}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{klant.bedrijf}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{klant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{klant.telefoon}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}