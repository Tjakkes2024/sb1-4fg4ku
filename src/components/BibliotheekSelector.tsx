import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, Check } from 'lucide-react';
import { ItemType } from '../types';

interface BibliotheekSelectorProps {
  onItemSelect: (regelId: string, aantal: number, hoofdstuk: string) => void;
  bestaandeHoofdstukken?: string[];
  onClose: () => void;
}

export function BibliotheekSelector({ onItemSelect, bestaandeHoofdstukken = [], onClose }: BibliotheekSelectorProps) {
  const { bibliotheekItems } = useStore();
  const [activeTab, setActiveTab] = useState<ItemType>('arbeid');
  const [zoekterm, setZoekterm] = useState('');
  const [geselecteerdeItems, setGeselecteerdeItems] = useState<Array<{
    regelId: string;
    aantal: number;
  }>>([]);
  const [nieuwHoofdstuk, setNieuwHoofdstuk] = useState('');
  const [geselecteerdHoofdstuk, setGeselecteerdHoofdstuk] = useState<string>('');

  // Filter items op type en zoekterm
  const getFilteredItems = () => {
    return bibliotheekItems
      .filter(item => 
        item.type === activeTab && 
        (item.naam.toLowerCase().includes(zoekterm.toLowerCase()) ||
         item.code.toLowerCase().includes(zoekterm.toLowerCase()))
      )
      .sort((a, b) => a.code.localeCompare(b.code));
  };

  const handleItemsToevoegen = () => {
    const hoofdstuk = geselecteerdHoofdstuk || nieuwHoofdstuk;
    if (!hoofdstuk) {
      alert('Selecteer een bestaand hoofdstuk of maak een nieuwe aan');
      return;
    }

    // Voeg alle geselecteerde items toe
    geselecteerdeItems.forEach(item => {
      onItemSelect(item.regelId, item.aantal, hoofdstuk);
    });
    onClose();
  };

  const toggleSelectItem = (regelId: string) => {
    setGeselecteerdeItems(prev => {
      const bestaand = prev.find(item => item.regelId === regelId);
      if (bestaand) {
        return prev.filter(item => item.regelId !== regelId);
      }
      return [...prev, { regelId, aantal: 1 }];
    });
  };

  const updateAantal = (regelId: string, aantal: number) => {
    setGeselecteerdeItems(prev =>
      prev.map(item =>
        item.regelId === regelId ? { ...item, aantal } : item
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-800">Regels Toevoegen</h2>
            <div className="text-sm text-gray-600">
              {geselecteerdeItems.length} {geselecteerdeItems.length === 1 ? 'regel' : 'regels'} geselecteerd
            </div>
          </div>

          {/* Hoofdstuk selectie/creatie */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecteer of maak een hoofdstuk
            </label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={geselecteerdHoofdstuk}
                onChange={(e) => {
                  setGeselecteerdHoofdstuk(e.target.value);
                  if (e.target.value) setNieuwHoofdstuk('');
                }}
                className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="">Kies een bestaand hoofdstuk...</option>
                {bestaandeHoofdstukken.map((hoofdstuk) => (
                  <option key={hoofdstuk} value={hoofdstuk}>
                    {hoofdstuk}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <span className="text-gray-500 self-center">of</span>
                <input
                  type="text"
                  placeholder="Maak nieuw hoofdstuk..."
                  value={nieuwHoofdstuk}
                  onChange={(e) => {
                    setNieuwHoofdstuk(e.target.value);
                    if (e.target.value) setGeselecteerdHoofdstuk('');
                  }}
                  className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => setActiveTab('arbeid')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'arbeid'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 hover:bg-red-50'
              }`}
            >
              Arbeid
            </button>
            <button
              onClick={() => setActiveTab('materiaal')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'materiaal'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 hover:bg-red-50'
              }`}
            >
              Materiaal
            </button>
            <button
              onClick={() => setActiveTab('materieel')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'materieel'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 hover:bg-red-50'
              }`}
            >
              Materieel
            </button>
          </div>

          {/* Zoekbalk */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={zoekterm}
              onChange={(e) => setZoekterm(e.target.value)}
              className="block w-full pl-10 rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Zoek op naam of code..."
            />
          </div>

          {/* Items tabel */}
          <div className="border border-red-100 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Naam</th>
                  <th className="px-4 py-2 text-left">Eenheid</th>
                  <th className="px-4 py-2 text-right">Prijs</th>
                  <th className="px-4 py-2 text-center">Aantal</th>
                  <th className="px-4 py-2 text-center">Selecteer</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredItems().map((item) => {
                  const geselecteerd = geselecteerdeItems.find(
                    gi => gi.regelId === item.id
                  );
                  return (
                    <tr key={item.id} className="hover:bg-red-50 border-t border-red-100">
                      <td className="px-4 py-2 font-mono text-sm">{item.code}</td>
                      <td className="px-4 py-2">{item.naam}</td>
                      <td className="px-4 py-2">{item.eenheid}</td>
                      <td className="px-4 py-2 text-right">€{item.prijs.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        {geselecteerd && (
                          <input
                            type="number"
                            min="1"
                            value={geselecteerd.aantal}
                            onChange={(e) =>
                              updateAantal(item.id, Number(e.target.value))
                            }
                            className="w-20 rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 mx-auto block"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => toggleSelectItem(item.id)}
                          className={`w-6 h-6 rounded ${
                            geselecteerd 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'border border-red-300 text-transparent hover:border-red-400'
                          } flex items-center justify-center transition-colors`}
                        >
                          <Check size={16} className={geselecteerd ? 'opacity-100' : 'opacity-0'} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {!geselecteerdHoofdstuk && !nieuwHoofdstuk 
              ? 'Selecteer of maak een hoofdstuk aan'
              : 'Selecteer regels om toe te voegen'}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Annuleren
            </button>
            <button
              onClick={handleItemsToevoegen}
              disabled={geselecteerdeItems.length === 0 || (!geselecteerdHoofdstuk && !nieuwHoofdstuk)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {geselecteerdeItems.length === 0 
                ? 'Selecteer regels' 
                : `${geselecteerdeItems.length} ${geselecteerdeItems.length === 1 ? 'regel' : 'regels'} toevoegen`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}