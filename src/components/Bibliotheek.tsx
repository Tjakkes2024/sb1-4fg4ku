import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Edit2, Library } from 'lucide-react';
import { ItemType } from '../types';
import { SamengesteldeHoofdstukken } from './SamengesteldeHoofdstukken';

export function Bibliotheek() {
  const { bibliotheekItems, addBibliotheekItem, updateBibliotheekItem, deleteBibliotheekItem } = useStore();
  const [activeTab, setActiveTab] = useState<'arbeid' | 'materiaal' | 'materieel' | 'samengesteld'>('arbeid');
  const [nieuwItem, setNieuwItem] = useState({
    naam: '',
    eenheid: '',
    prijs: 0,
    leverancier: '',
    artikelcode: '',
    opmerkingen: '',
  });
  const [bewerkItem, setBewerkItem] = useState<any>(null);

  const handleItemToevoegen = () => {
    if (nieuwItem.naam && nieuwItem.eenheid) {
      addBibliotheekItem({
        type: activeTab,
        naam: nieuwItem.naam,
        eenheid: nieuwItem.eenheid,
        prijs: nieuwItem.prijs,
        leverancier: nieuwItem.leverancier,
        artikelcode: nieuwItem.artikelcode,
        opmerkingen: nieuwItem.opmerkingen,
      });
      setNieuwItem({
        naam: '',
        eenheid: '',
        prijs: 0,
        leverancier: '',
        artikelcode: '',
        opmerkingen: '',
      });
    }
  };

  const handleVerwijderItem = (id: string) => {
    if (window.confirm('Weet u zeker dat u dit item wilt verwijderen?')) {
      deleteBibliotheekItem(id);
    }
  };

  const renderItemForm = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
        <input
          type="text"
          value={nieuwItem.naam}
          onChange={(e) => setNieuwItem({ ...nieuwItem, naam: e.target.value })}
          className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Eenheid</label>
        <input
          type="text"
          value={nieuwItem.eenheid}
          onChange={(e) => setNieuwItem({ ...nieuwItem, eenheid: e.target.value })}
          className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Prijs</label>
        <input
          type="number"
          value={nieuwItem.prijs}
          onChange={(e) => setNieuwItem({ ...nieuwItem, prijs: Number(e.target.value) })}
          className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Leverancier</label>
        <input
          type="text"
          value={nieuwItem.leverancier}
          onChange={(e) => setNieuwItem({ ...nieuwItem, leverancier: e.target.value })}
          className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Artikelcode</label>
        <input
          type="text"
          value={nieuwItem.artikelcode}
          onChange={(e) => setNieuwItem({ ...nieuwItem, artikelcode: e.target.value })}
          className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Opmerkingen</label>
        <input
          type="text"
          value={nieuwItem.opmerkingen}
          onChange={(e) => setNieuwItem({ ...nieuwItem, opmerkingen: e.target.value })}
          className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
    </div>
  );

  const renderItemsTable = () => {
    const items = bibliotheekItems.filter((item) => item.type === activeTab);

    return (
      <table className="min-w-full divide-y divide-red-200">
        <thead className="bg-red-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
              Naam
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
              Eenheid
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
              Prijs
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
              Leverancier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
              Artikelcode
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
              Acties
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-red-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-red-50">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{item.code}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.naam}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.eenheid}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">€{item.prijs.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.leverancier}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.artikelcode}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setBewerkItem(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleVerwijderItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Tabs voor type selectie */}
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
        <button
          onClick={() => setActiveTab('samengesteld')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'samengesteld'
              ? 'bg-red-600 text-white'
              : 'bg-white text-red-600 hover:bg-red-50'
          }`}
        >
          Samengesteld
        </button>
      </div>

      {activeTab === 'samengesteld' ? (
        <SamengesteldeHoofdstukken />
      ) : (
        <>
          {/* Nieuw item toevoegen */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-red-100">
            <h3 className="text-lg font-semibold mb-4 text-red-700">
              Nieuw {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Toevoegen
            </h3>
            {renderItemForm()}
            <button
              onClick={handleItemToevoegen}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <Plus className="mr-2" />
              Toevoegen
            </button>
          </div>

          {/* Items overzicht */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-red-100">
            <h3 className="text-lg font-semibold mb-4 text-red-700">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overzicht
            </h3>
            <div className="overflow-x-auto">
              {renderItemsTable()}
            </div>
          </div>
        </>
      )}

      {/* Bewerk Modal */}
      {bewerkItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-4">Item Bewerken</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
                <input
                  type="text"
                  value={bewerkItem.naam}
                  onChange={(e) =>
                    setBewerkItem({ ...bewerkItem, naam: e.target.value })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eenheid</label>
                <input
                  type="text"
                  value={bewerkItem.eenheid}
                  onChange={(e) =>
                    setBewerkItem({ ...bewerkItem, eenheid: e.target.value })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prijs</label>
                <input
                  type="number"
                  value={bewerkItem.prijs}
                  onChange={(e) =>
                    setBewerkItem({ ...bewerkItem, prijs: Number(e.target.value) })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leverancier
                </label>
                <input
                  type="text"
                  value={bewerkItem.leverancier}
                  onChange={(e) =>
                    setBewerkItem({ ...bewerkItem, leverancier: e.target.value })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artikelcode
                </label>
                <input
                  type="text"
                  value={bewerkItem.artikelcode}
                  onChange={(e) =>
                    setBewerkItem({ ...bewerkItem, artikelcode: e.target.value })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opmerkingen
                </label>
                <input
                  type="text"
                  value={bewerkItem.opmerkingen}
                  onChange={(e) =>
                    setBewerkItem({ ...bewerkItem, opmerkingen: e.target.value })
                  }
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setBewerkItem(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  updateBibliotheekItem(bewerkItem);
                  setBewerkItem(null);
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