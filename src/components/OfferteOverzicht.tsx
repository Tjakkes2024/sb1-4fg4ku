import React, { useState } from 'react';
import { useStore } from '../store';
import { FileText, Plus, Trash2, Edit2, Eye, Download } from 'lucide-react';
import { Offerte as OfferteComponent } from './Offerte';

export function OfferteOverzicht() {
  const { calculaties, offertes, klanten, addOfferte, updateOfferte, deleteOfferte } = useStore();
  const [selectedOfferte, setSelectedOfferte] = useState<string | null>(null);
  const [toonOfferte, setToonOfferte] = useState(false);
  const [toonNieuweOfferte, setToonNieuweOfferte] = useState(false);
  const [selectedCalculatie, setSelectedCalculatie] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL');
  };

  const getOfferteNummer = (id: string) => {
    return `OFF-${new Date().getFullYear()}-${id.slice(-4).padStart(4, '0')}`;
  };

  const handleNieuweOfferte = (calculatieId: string) => {
    const calculatie = calculaties.find(c => c.id === calculatieId);
    if (!calculatie) return;

    const nieuweOfferte = {
      id: Date.now().toString(),
      calculatieId: calculatie.id,
      datum: new Date().toISOString(),
      klantId: calculatie.klantId,
      projectDetails: {
        projectNaam: calculatie.projectNaam,
        projectLocatie: calculatie.projectLocatie,
        projectOmschrijving: calculatie.projectOmschrijving,
        winstRisicoPercentage: calculatie.winstRisicoPercentage,
        btwPercentage: calculatie.btwPercentage,
      },
      regels: calculatie.regels,
      status: 'concept' as const,
      totalen: calculatie.totalen,
    };

    addOfferte(nieuweOfferte);
    setToonNieuweOfferte(false);
    setSelectedCalculatie(null);
  };

  const handleStatusUpdate = (offerteId: string, nieuweStatus: 'concept' | 'definitief' | 'geaccepteerd' | 'afgewezen') => {
    const offerte = offertes.find(o => o.id === offerteId);
    if (offerte) {
      updateOfferte({
        ...offerte,
        status: nieuweStatus
      });
    }
  };

  const handleVerwijderOfferte = (id: string) => {
    if (window.confirm('Weet u zeker dat u deze offerte wilt verwijderen?')) {
      deleteOfferte(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Nieuwe offerte maken */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-red-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-800 flex items-center">
            <FileText className="mr-2" />
            Offertes
          </h2>
          <button
            onClick={() => setToonNieuweOfferte(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            <Plus className="mr-2" />
            Nieuwe Offerte
          </button>
        </div>

        {toonNieuweOfferte && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Selecteer Calculatie</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                      Datum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                      Klant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                      Totaal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                      Actie
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-200">
                  {calculaties
                    .filter(c => c.status === 'concept')
                    .map((calculatie) => {
                      const klant = klanten.find(k => k.id === calculatie.klantId);
                      return (
                        <tr key={calculatie.id} className="hover:bg-red-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(calculatie.datum)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {klant?.bedrijf || klant?.naam}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {calculatie.projectNaam}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            €{calculatie.totalen.totaalIncBtw.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleNieuweOfferte(calculatie.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                            >
                              <Plus className="mr-2" />
                              Offerte Maken
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bestaande offertes */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Offerte Nr.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Klant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                  Totaal
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {offertes.map((offerte) => {
                const klant = klanten.find(k => k.id === offerte.klantId);
                return (
                  <tr key={offerte.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOfferteNummer(offerte.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(offerte.datum)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {klant?.bedrijf || klant?.naam}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offerte.projectDetails.projectNaam}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      €{offerte.totalen.totaalIncBtw.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <select
                        value={offerte.status}
                        onChange={(e) => handleStatusUpdate(offerte.id, e.target.value as any)}
                        className={`px-2 py-1 rounded-full text-xs ${
                          offerte.status === 'concept' ? 'bg-yellow-100 text-yellow-800' :
                          offerte.status === 'definitief' ? 'bg-blue-100 text-blue-800' :
                          offerte.status === 'geaccepteerd' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="concept">Concept</option>
                        <option value="definitief">Definitief</option>
                        <option value="geaccepteerd">Geaccepteerd</option>
                        <option value="afgewezen">Afgewezen</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOfferte(offerte.id);
                            setToonOfferte(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Bekijken"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleVerwijderOfferte(offerte.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Verwijderen"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offerte Modal */}
      {toonOfferte && selectedOfferte && (
        <OfferteComponent
          offerte={offertes.find(o => o.id === selectedOfferte)!}
          klant={klanten.find(k => k.id === offertes.find(o => o.id === selectedOfferte)?.klantId)!}
          onClose={() => {
            setToonOfferte(false);
            setSelectedOfferte(null);
          }}
        />
      )}
    </div>
  );
}