import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, Check, ChevronDown, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { BibliotheekSelector } from './BibliotheekSelector';

export function SamengesteldeHoofdstukken() {
  const { 
    samengesteldeHoofdstukken, 
    addSamengesteldHoofdstuk, 
    updateSamengesteldHoofdstuk,
    deleteSamengesteldHoofdstuk,
    bibliotheekItems
  } = useStore();

  const [nieuwHoofdstuk, setNieuwHoofdstuk] = useState({
    naam: '',
    omschrijving: '',
  });
  const [bewerkHoofdstuk, setBewerkHoofdstuk] = useState<any>(null);
  const [openHoofdstukken, setOpenHoofdstukken] = useState<string[]>([]);
  const [toonBibliotheekSelector, setToonBibliotheekSelector] = useState(false);
  const [geselecteerdHoofdstukId, setGeselecteerdHoofdstukId] = useState<string | null>(null);
  const [geselecteerdOnderdeelId, setGeselecteerdOnderdeelId] = useState<string | null>(null);
  const [nieuwOnderdeel, setNieuwOnderdeel] = useState({
    hoofdstukId: '',
    naam: '',
    omschrijving: '',
  });

  const toggleHoofdstuk = (hoofdstukId: string) => {
    setOpenHoofdstukken(prev =>
      prev.includes(hoofdstukId)
        ? prev.filter(id => id !== hoofdstukId)
        : [...prev, hoofdstukId]
    );
  };

  const handleHoofdstukToevoegen = () => {
    if (nieuwHoofdstuk.naam) {
      addSamengesteldHoofdstuk({
        naam: nieuwHoofdstuk.naam,
        omschrijving: nieuwHoofdstuk.omschrijving,
        onderdelen: [],
      });
      setNieuwHoofdstuk({ naam: '', omschrijving: '' });
    }
  };

  const handleOnderdeelToevoegen = (hoofdstukId: string) => {
    if (nieuwOnderdeel.naam) {
      const hoofdstuk = samengesteldeHoofdstukken.find(h => h.id === hoofdstukId);
      if (hoofdstuk) {
        updateSamengesteldHoofdstuk({
          ...hoofdstuk,
          onderdelen: [
            ...hoofdstuk.onderdelen,
            {
              id: Date.now().toString(),
              naam: nieuwOnderdeel.naam,
              omschrijving: nieuwOnderdeel.omschrijving,
              regels: [],
            },
          ],
        });
        setNieuwOnderdeel({ hoofdstukId: '', naam: '', omschrijving: '' });
      }
    }
  };

  const handleRegelToevoegen = (regelId: string, aantal: number) => {
    if (geselecteerdHoofdstukId && geselecteerdOnderdeelId) {
      const hoofdstuk = samengesteldeHoofdstukken.find(h => h.id === geselecteerdHoofdstukId);
      if (hoofdstuk) {
        const nieuweRegel = {
          id: Date.now().toString(),
          regelId,
          aantal,
        };
        
        updateSamengesteldHoofdstuk({
          ...hoofdstuk,
          onderdelen: hoofdstuk.onderdelen.map(o => 
            o.id === geselecteerdOnderdeelId
              ? { ...o, regels: [...o.regels, nieuweRegel] }
              : o
          ),
        });
      }
    }
    setToonBibliotheekSelector(false);
  };

  const handleVerwijderHoofdstuk = (id: string) => {
    if (window.confirm('Weet u zeker dat u dit hoofdstuk wilt verwijderen?')) {
      deleteSamengesteldHoofdstuk(id);
    }
  };

  const handleVerwijderOnderdeel = (hoofdstukId: string, onderdeelId: string) => {
    const hoofdstuk = samengesteldeHoofdstukken.find(h => h.id === hoofdstukId);
    if (hoofdstuk) {
      updateSamengesteldHoofdstuk({
        ...hoofdstuk,
        onderdelen: hoofdstuk.onderdelen.filter(o => o.id !== onderdeelId),
      });
    }
  };

  const handleVerwijderRegel = (hoofdstukId: string, onderdeelId: string, regelId: string) => {
    const hoofdstuk = samengesteldeHoofdstukken.find(h => h.id === hoofdstukId);
    if (hoofdstuk) {
      updateSamengesteldHoofdstuk({
        ...hoofdstuk,
        onderdelen: hoofdstuk.onderdelen.map(o => 
          o.id === onderdeelId
            ? { ...o, regels: o.regels.filter(r => r.id !== regelId) }
            : o
        ),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Nieuw hoofdstuk toevoegen */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-red-100">
        <h3 className="text-lg font-semibold mb-4 text-red-700">Nieuw Hoofdstuk</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
            <input
              type="text"
              value={nieuwHoofdstuk.naam}
              onChange={(e) => setNieuwHoofdstuk({ ...nieuwHoofdstuk, naam: e.target.value })}
              className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Omschrijving</label>
            <input
              type="text"
              value={nieuwHoofdstuk.omschrijving}
              onChange={(e) => setNieuwHoofdstuk({ ...nieuwHoofdstuk, omschrijving: e.target.value })}
              className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>
        <button
          onClick={handleHoofdstukToevoegen}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="mr-2" />
          Hoofdstuk Toevoegen
        </button>
      </div>

      {/* Hoofdstukken overzicht */}
      {samengesteldeHoofdstukken.map((hoofdstuk) => (
        <div key={hoofdstuk.id} className="bg-white rounded-lg shadow-lg border border-red-100">
          <div className="p-4 flex items-center justify-between border-b border-red-100">
            <button
              onClick={() => toggleHoofdstuk(hoofdstuk.id)}
              className="flex items-center text-lg font-semibold text-red-800"
            >
              {openHoofdstukken.includes(hoofdstuk.id) ? (
                <ChevronDown className="w-5 h-5 mr-2" />
              ) : (
                <ChevronRight className="w-5 h-5 mr-2" />
              )}
              {hoofdstuk.naam}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setBewerkHoofdstuk(hoofdstuk)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleVerwijderHoofdstuk(hoofdstuk.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {openHoofdstukken.includes(hoofdstuk.id) && (
            <div className="p-4">
              {/* Nieuw onderdeel toevoegen */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Onderdeel Naam
                    </label>
                    <input
                      type="text"
                      value={nieuwOnderdeel.hoofdstukId === hoofdstuk.id ? nieuwOnderdeel.naam : ''}
                      onChange={(e) =>
                        setNieuwOnderdeel({
                          hoofdstukId: hoofdstuk.id,
                          naam: e.target.value,
                          omschrijving: nieuwOnderdeel.omschrijving,
                        })
                      }
                      className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Omschrijving
                    </label>
                    <input
                      type="text"
                      value={
                        nieuwOnderdeel.hoofdstukId === hoofdstuk.id
                          ? nieuwOnderdeel.omschrijving
                          : ''
                      }
                      onChange={(e) =>
                        setNieuwOnderdeel({
                          hoofdstukId: hoofdstuk.id,
                          naam: nieuwOnderdeel.naam,
                          omschrijving: e.target.value,
                        })
                      }
                      className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleOnderdeelToevoegen(hoofdstuk.id)}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <Plus className="mr-2" />
                  Onderdeel Toevoegen
                </button>
              </div>

              {/* Onderdelen */}
              {hoofdstuk.onderdelen.map((onderdeel) => (
                <div
                  key={onderdeel.id}
                  className="mb-4 border border-red-100 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-red-700">{onderdeel.naam}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setGeselecteerdHoofdstukId(hoofdstuk.id);
                          setGeselecteerdOnderdeelId(onderdeel.id);
                          setToonBibliotheekSelector(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => handleVerwijderOnderdeel(hoofdstuk.id, onderdeel.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Regels tabel */}
                  <table className="min-w-full divide-y divide-red-200">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                          Naam
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                          Aantal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                          Eenheid
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                          Acties
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-red-200">
                      {onderdeel.regels.map((regel) => {
                        const bibliotheekItem = bibliotheekItems.find(
                          (item) => item.id === regel.regelId
                        );
                        if (!bibliotheekItem) return null;

                        return (
                          <tr key={regel.id} className="hover:bg-red-50">
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                              {bibliotheekItem.code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap capitalize">
                              {bibliotheekItem.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {bibliotheekItem.naam}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {regel.aantal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {bibliotheekItem.eenheid}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() =>
                                  handleVerwijderRegel(hoofdstuk.id, onderdeel.id, regel.id)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* BibliotheekSelector Modal */}
      {toonBibliotheekSelector && (
        <BibliotheekSelector
          onItemSelect={handleRegelToevoegen}
          onClose={() => setToonBibliotheekSelector(false)}
        />
      )}

      {/* Bewerk Modal */}
      {bewerkHoofdstuk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-4">Hoofdstuk Bewerken</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
                <input
                  type="text"
                  value={bewerkHoofdstuk.naam}
                  onChange={(e) =>
                    setBewerkHoofdstuk({ ...bewerkHoofdstuk, naam: e.target.value })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Omschrijving
                </label>
                <input
                  type="text"
                  value={bewerkHoofdstuk.omschrijving}
                  onChange={(e) =>
                    setBewerkHoofdstuk({ ...bewerkHoofdstuk, omschrijving: e.target.value })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setBewerkHoofdstuk(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  updateSamengesteldHoofdstuk(bewerkHoofdstuk);
                  setBewerkHoofdstuk(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}