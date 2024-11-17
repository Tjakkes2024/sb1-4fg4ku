import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Calculator, Trash2, Edit2 } from 'lucide-react';
import { BibliotheekSelector } from './BibliotheekSelector';
import { HoofdstukSelector } from './HoofdstukSelector';
import { Offerte } from './Offerte';
import { CalculatieStatus } from '../types';

export function Calculatie() {
  const { calculaties, klanten, addCalculatie, updateCalculatie, deleteCalculatie } = useStore();
  const [toonBibliotheekSelector, setToonBibliotheekSelector] = useState(false);
  const [toonHoofdstukSelector, setToonHoofdstukSelector] = useState(false);
  const [toonOfferte, setToonOfferte] = useState(false);
  const [selectedRegels, setSelectedRegels] = useState<Array<{
    regelId: string;
    aantal: number;
    hoofdstuk: string;
  }>>([]);
  const [projectDetails, setProjectDetails] = useState({
    projectNaam: '',
    projectLocatie: '',
    projectOmschrijving: '',
    klantId: '',
    winstRisicoPercentage: 10,
    btwPercentage: 21,
  });
  const [bewerkCalculatie, setBewerkCalculatie] = useState<string | null>(null);

  const handleLosseRegelToevoegen = (regelId: string, aantal: number, hoofdstuk: string) => {
    setSelectedRegels(prev => [...prev, { regelId, aantal, hoofdstuk }]);
  };

  const handleHoofdstukToevoegen = (hoofdstuk: any) => {
    setSelectedRegels(prev => [...prev, ...hoofdstuk.regels]);
  };

  const handleRegelVerwijderen = (regelId: string) => {
    setSelectedRegels(prev => prev.filter(r => r.regelId !== regelId));
  };

  const handleAantalWijzigen = (regelId: string, aantal: number) => {
    setSelectedRegels(prev =>
      prev.map(regel =>
        regel.regelId === regelId ? { ...regel, aantal } : regel
      )
    );
  };

  const handleCalculatieOpslaan = () => {
    if (!projectDetails.klantId || !projectDetails.projectNaam || selectedRegels.length === 0) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const nieuweCalculatie = {
      id: bewerkCalculatie || Date.now().toString(),
      ...projectDetails,
      datum: new Date().toISOString(),
      regels: selectedRegels,
      status: 'concept' as CalculatieStatus,
      totalen: berekenTotalen(),
    };

    if (bewerkCalculatie) {
      updateCalculatie(nieuweCalculatie);
    } else {
      addCalculatie(nieuweCalculatie);
    }

    // Reset form
    setProjectDetails({
      projectNaam: '',
      projectLocatie: '',
      projectOmschrijving: '',
      klantId: '',
      winstRisicoPercentage: 10,
      btwPercentage: 21,
    });
    setSelectedRegels([]);
    setBewerkCalculatie(null);
  };

  const handleCalculatieBewerken = (calculatie: any) => {
    setBewerkCalculatie(calculatie.id);
    setProjectDetails({
      projectNaam: calculatie.projectNaam,
      projectLocatie: calculatie.projectLocatie,
      projectOmschrijving: calculatie.projectOmschrijving,
      klantId: calculatie.klantId,
      winstRisicoPercentage: calculatie.winstRisicoPercentage,
      btwPercentage: calculatie.btwPercentage,
    });
    setSelectedRegels(calculatie.regels);
  };

  const handleCalculatieVerwijderen = (id: string) => {
    if (window.confirm('Weet u zeker dat u deze calculatie wilt verwijderen?')) {
      deleteCalculatie(id);
    }
  };

  const handleStatusUpdate = (calculatieId: string, nieuweStatus: CalculatieStatus) => {
    const calculatie = calculaties.find(c => c.id === calculatieId);
    if (calculatie) {
      updateCalculatie({
        ...calculatie,
        status: nieuweStatus
      });
    }
  };

  const getStatusBadgeClasses = (status: CalculatieStatus) => {
    switch (status) {
      case 'concept':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_behandeling':
        return 'bg-blue-100 text-blue-800';
      case 'goedgekeurd':
        return 'bg-green-100 text-green-800';
      case 'afgekeurd':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const berekenTotalen = () => {
    const { bibliotheekItems } = useStore.getState();
    const totalen = selectedRegels.reduce(
      (acc, regel) => {
        const item = bibliotheekItems.find(i => i.id === regel.regelId);
        if (!item) return acc;

        return {
          arbeid: acc.arbeid + (item.type === 'arbeid' ? item.prijs * regel.aantal : 0),
          materiaal: acc.materiaal + (item.type === 'materiaal' ? item.prijs * regel.aantal : 0),
          materieel: acc.materieel + (item.type === 'materieel' ? item.prijs * regel.aantal : 0),
          onderaanneming: acc.onderaanneming,
        };
      },
      { arbeid: 0, materiaal: 0, materieel: 0, onderaanneming: 0 }
    );

    const subtotaal = totalen.arbeid + totalen.materiaal + totalen.materieel + totalen.onderaanneming;
    const winstRisico = (subtotaal * projectDetails.winstRisicoPercentage) / 100;
    const btw = ((subtotaal + winstRisico) * projectDetails.btwPercentage) / 100;

    return {
      ...totalen,
      subtotaal,
      winstRisico,
      btw,
      totaalIncBtw: subtotaal + winstRisico + btw,
    };
  };

  const totalen = berekenTotalen();
  const regelsByHoofdstuk = selectedRegels.reduce((acc, regel) => {
    if (!acc[regel.hoofdstuk]) {
      acc[regel.hoofdstuk] = [];
    }
    acc[regel.hoofdstuk].push(regel);
    return acc;
  }, {} as Record<string, typeof selectedRegels>);

  return (
    <div className="container mx-auto p-6">
      {/* Calculaties overzicht */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-red-100">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-red-800">
          <Calculator className="mr-2" />
          Calculaties
        </h2>

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
                <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {calculaties.map((calculatie) => {
                const klant = klanten.find(k => k.id === calculatie.klantId);
                return (
                  <tr key={calculatie.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(calculatie.datum).toLocaleDateString('nl-NL')}
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <select
                        value={calculatie.status}
                        onChange={(e) => handleStatusUpdate(calculatie.id, e.target.value as CalculatieStatus)}
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClasses(calculatie.status)}`}
                      >
                        <option value="concept">Concept</option>
                        <option value="in_behandeling">In behandeling</option>
                        <option value="goedgekeurd">Goedgekeurd</option>
                        <option value="afgekeurd">Afgekeurd</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleCalculatieBewerken(calculatie)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleCalculatieVerwijderen(calculatie.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-red-100">
        <h2 className="text-2xl font-bold mb-4 text-red-800">
          {bewerkCalculatie ? 'Calculatie Bewerken' : 'Nieuwe Calculatie'}
        </h2>

        {/* Project Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-red-700">Project Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Klant</label>
              <select
                value={projectDetails.klantId}
                onChange={(e) => setProjectDetails({ ...projectDetails, klantId: e.target.value })}
                className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="">Selecteer een klant...</option>
                {klanten.map((klant) => (
                  <option key={klant.id} value={klant.id}>
                    {klant.bedrijf || klant.naam}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Naam</label>
              <input
                type="text"
                value={projectDetails.projectNaam}
                onChange={(e) => setProjectDetails({ ...projectDetails, projectNaam: e.target.value })}
                className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Locatie</label>
              <input
                type="text"
                value={projectDetails.projectLocatie}
                onChange={(e) => setProjectDetails({ ...projectDetails, projectLocatie: e.target.value })}
                className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Omschrijving</label>
              <textarea
                value={projectDetails.projectOmschrijving}
                onChange={(e) => setProjectDetails({ ...projectDetails, projectOmschrijving: e.target.value })}
                className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Winst & Risico %</label>
              <input
                type="number"
                value={projectDetails.winstRisicoPercentage}
                onChange={(e) => setProjectDetails({ ...projectDetails, winstRisicoPercentage: Number(e.target.value) })}
                className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BTW %</label>
              <input
                type="number"
                value={projectDetails.btwPercentage}
                onChange={(e) => setProjectDetails({ ...projectDetails, btwPercentage: Number(e.target.value) })}
                className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Regels */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-700">Regels</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setToonBibliotheekSelector(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <Plus className="mr-2" />
                Losse Regels Toevoegen
              </button>
              <button
                onClick={() => setToonHoofdstukSelector(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <Plus className="mr-2" />
                Toevoegen vanuit Bibliotheek
              </button>
            </div>
          </div>

          {/* Regels per hoofdstuk */}
          {Object.entries(regelsByHoofdstuk).map(([hoofdstukNaam, hoofdstukRegels], index) => {
            const hoofdstukTotaal = hoofdstukRegels.reduce((sum, regel) => {
              const item = useStore.getState().bibliotheekItems.find(i => i.id === regel.regelId);
              if (!item) return sum;
              return sum + (item.prijs * regel.aantal);
            }, 0);

            return (
              <div key={hoofdstukNaam} className={index > 0 ? 'mt-6' : ''}>
                <h4 className="font-bold text-red-800 mb-2">{hoofdstukNaam}</h4>
                <table className="min-w-full mb-2">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Code</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Naam</th>
                      <th className="px-4 py-2 text-right">Aantal</th>
                      <th className="px-4 py-2 text-left">Eenheid</th>
                      <th className="px-4 py-2 text-right">Prijs</th>
                      <th className="px-4 py-2 text-right">Totaal</th>
                      <th className="px-4 py-2 text-right">Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hoofdstukRegels.map((regel) => {
                      const item = useStore.getState().bibliotheekItems.find(i => i.id === regel.regelId);
                      if (!item) return null;

                      const totaal = item.prijs * regel.aantal;

                      return (
                        <tr key={`${hoofdstukNaam}-${regel.regelId}`} className="hover:bg-red-50">
                          <td className="px-4 py-2 font-mono text-sm">{item.code}</td>
                          <td className="px-4 py-2 capitalize">{item.type}</td>
                          <td className="px-4 py-2">{item.naam}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="1"
                              value={regel.aantal}
                              onChange={(e) => handleAantalWijzigen(regel.regelId, Number(e.target.value))}
                              className="w-20 rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                          </td>
                          <td className="px-4 py-2">{item.eenheid}</td>
                          <td className="px-4 py-2 text-right">€{item.prijs.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">€{totaal.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => handleRegelVerwijderen(regel.regelId)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-red-50 font-medium">
                      <td colSpan={6} className="px-4 py-2 text-right">
                        Subtotaal {hoofdstukNaam}
                      </td>
                      <td className="px-4 py-2 text-right">€{hoofdstukTotaal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Totalen */}
        <div className="border-t border-red-200 pt-4">
          <div className="w-1/2 ml-auto space-y-2">
            <div className="flex justify-between">
              <span>Arbeid:</span>
              <span className="text-red-600">€{totalen.arbeid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Materiaal:</span>
              <span className="text-red-600">€{totalen.materiaal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Materieel:</span>
              <span className="text-red-600">€{totalen.materieel.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Onderaanneming:</span>
              <span className="text-red-600">€{totalen.onderaanneming.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-red-100">
              <span>Subtotaal:</span>
              <span className="text-red-600">€{totalen.subtotaal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Winst & Risico ({projectDetails.winstRisicoPercentage}%):</span>
              <span className="text-red-600">€{totalen.winstRisico.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>BTW ({projectDetails.btwPercentage}%):</span>
              <span className="text-red-600">€{totalen.btw.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-red-100">
              <span>Totaal incl. BTW:</span>
              <span className="text-red-700">€{totalen.totaalIncBtw.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actie knoppen */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => {
              setProjectDetails({
                projectNaam: '',
                projectLocatie: '',
                projectOmschrijving: '',
                klantId: '',
                winstRisicoPercentage: 10,
                btwPercentage: 21,
              });
              setSelectedRegels([]);
              setBewerkCalculatie(null);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuleren
          </button>
          <button
            onClick={handleCalculatieOpslaan}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {bewerkCalculatie ? 'Wijzigingen Opslaan' : 'Calculatie Opslaan'}
          </button>
        </div>
      </div>

      {/* Modals */}
      {toonBibliotheekSelector && (
        <BibliotheekSelector
          onItemSelect={handleLosseRegelToevoegen}
          bestaandeHoofdstukken={[...new Set(selectedRegels.map(r => r.hoofdstuk))]}
          onClose={() => setToonBibliotheekSelector(false)}
        />
      )}

      {toonHoofdstukSelector && (
        <HoofdstukSelector
          onHoofdstukToevoegen={handleHoofdstukToevoegen}
          onClose={() => setToonHoofdstukSelector(false)}
        />
      )}

      {toonOfferte && projectDetails.klantId && (
        <Offerte
          offerte={{
            id: bewerkCalculatie || Date.now().toString(),
            ...projectDetails,
            datum: new Date().toISOString(),
            regels: selectedRegels,
            status: 'concept',
            totalen,
          }}
          klant={klanten.find(k => k.id === projectDetails.klantId)!}
          onClose={() => setToonOfferte(false)}
        />
      )}
    </div>
  );
}