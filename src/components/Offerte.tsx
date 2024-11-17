import React, { forwardRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Offerte as OfferteType, Klant } from '../types';
import { useStore } from '../store';

interface OfferteProps {
  offerte: OfferteType;
  klant: Klant;
  onClose: () => void;
}

const PrintableContent = forwardRef<HTMLDivElement, { offerte: OfferteType; klant: Klant }>(
  ({ offerte, klant }, ref) => {
    const { bibliotheekItems } = useStore();
    const datum = new Date().toLocaleDateString('nl-NL');
    
    // Group rules by chapter
    const regelsByHoofdstuk = offerte.regels.reduce((acc, regel) => {
      if (!acc[regel.hoofdstuk]) {
        acc[regel.hoofdstuk] = [];
      }
      acc[regel.hoofdstuk].push(regel);
      return acc;
    }, {} as Record<string, typeof offerte.regels>);

    const winstFactor = 1 + (offerte.projectDetails.winstRisicoPercentage / 100);

    return (
      <div ref={ref} className="p-12 bg-white min-h-[297mm] w-[210mm] mx-auto">
        {/* Briefhoofd met logo en bedrijfsgegevens */}
        <div className="mb-12 flex justify-between items-start">
          <div className="space-y-1">
            <div className="w-56">
              <img 
                src="/tjakkesbouw-logo.png" 
                alt="Tjakkesbouw"
                className="w-full h-auto"
              />
            </div>
            <div className="mt-6 text-gray-600 text-sm">
              <p className="text-red-900 font-semibold mb-2">Tjakkesbouw</p>
              <p>De Viermaster 2</p>
              <p>9514EJ Gasselternijveen</p>
              <p>Tel: 0628244928</p>
              <p>Email: info@tjakkesbouw.nl</p>
              <p>KvK: 57409242</p>
              <p>BTW: NL103717766B01</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-br from-red-700 to-red-800 text-white px-8 py-4 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold tracking-tight">OFFERTE</h2>
              <div className="mt-3 text-red-50">
                <p>Offertenummer: OFF-{offerte.id}</p>
                <p>Datum: {datum}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Klantgegevens */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-lg border-l-4 border-red-700">
            <h3 className="font-bold text-red-800 mb-3 text-lg">Geadresseerde</h3>
            <div className="space-y-1 text-gray-700">
              <p className="font-semibold text-lg">{klant.bedrijf}</p>
              <p>T.a.v. {klant.naam}</p>
              <p>{klant.adres}</p>
              <p>{klant.postcode} {klant.plaats}</p>
              {klant.kvkNummer && <p className="text-sm mt-2">KvK: {klant.kvkNummer}</p>}
              {klant.btwNummer && <p className="text-sm">BTW: {klant.btwNummer}</p>}
            </div>
          </div>
        </div>

        {/* Aanhef en Voorwoord */}
        <div className="mb-10">
          <p className="text-gray-700 mb-4">Geachte {klant.naam},</p>
          <div className="text-gray-700 space-y-4">
            <p>
              Hartelijk dank voor uw interesse in Tjakkesbouw. Met genoegen bieden wij u deze offerte aan 
              voor het project zoals hieronder gespecificeerd. Als vakkundig bouwbedrijf staan wij garant 
              voor een professionele uitvoering met oog voor detail.
            </p>
            <p>
              Na zorgvuldige bestudering van uw wensen hebben wij een passend voorstel samengesteld. 
              Naast het werken volgens de geldende bouwvoorschriften, onderscheiden wij ons door onze 
              professionele en persoonlijke aanpak.
            </p>
            <p>
              Tjakkesbouw staat voor:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Professioneel vakmanschap</li>
              <li>Hoogwaardige materialen</li>
              <li>Deskundige projectbegeleiding</li>
              <li>Transparante communicatie</li>
            </ul>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-10">
          <div className="border-b-2 border-red-700 mb-4 pb-1">
            <h3 className="text-xl font-bold text-red-800">Project Details</h3>
          </div>
          <div className="space-y-2 text-gray-700 pl-4">
            <p><span className="font-semibold text-red-800">Project:</span> {offerte.projectDetails.projectNaam}</p>
            <p><span className="font-semibold text-red-800">Locatie:</span> {offerte.projectDetails.projectLocatie}</p>
            {offerte.projectDetails.projectOmschrijving && (
              <p className="mt-4 text-gray-600 italic">{offerte.projectDetails.projectOmschrijving}</p>
            )}
          </div>
        </div>

        {/* Specificatie per hoofdstuk */}
        <div className="mb-10">
          <div className="border-b-2 border-red-700 mb-6 pb-1">
            <h3 className="text-xl font-bold text-red-800">Specificatie</h3>
          </div>

          {Object.entries(regelsByHoofdstuk).map(([hoofdstukNaam, hoofdstukRegels], index) => {
            const hoofdstukTotaal = hoofdstukRegels.reduce((sum, regel) => {
              const item = bibliotheekItems.find(i => i.id === regel.regelId);
              if (!item) return sum;
              return sum + (item.prijs * regel.aantal * winstFactor);
            }, 0);

            return (
              <div key={hoofdstukNaam} className={index > 0 ? 'mt-8' : ''}>
                <div className="bg-gradient-to-r from-red-700 to-red-800 text-white px-4 py-2 rounded-t-lg">
                  <h4 className="text-lg font-semibold">{hoofdstukNaam}</h4>
                </div>
                <div className="border border-red-200 rounded-b-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-50 to-white">
                        <th className="px-4 py-3 text-left text-red-800 font-semibold">Omschrijving</th>
                        <th className="px-4 py-3 text-right text-red-800 font-semibold">Aantal</th>
                        <th className="px-4 py-3 text-left text-red-800 font-semibold">Eenheid</th>
                        <th className="px-4 py-3 text-right text-red-800 font-semibold">Prijs</th>
                        <th className="px-4 py-3 text-right text-red-800 font-semibold">Totaal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-100">
                      {hoofdstukRegels.map((regel) => {
                        const item = bibliotheekItems.find(i => i.id === regel.regelId);
                        if (!item) return null;

                        const prijsPerEenheid = item.prijs * winstFactor;
                        const totaal = prijsPerEenheid * regel.aantal;

                        return (
                          <tr key={regel.regelId} className="hover:bg-red-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-800">{item.naam}</div>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-700">{regel.aantal}</td>
                            <td className="px-4 py-3 text-gray-700">{item.eenheid}</td>
                            <td className="px-4 py-3 text-right text-gray-700">€{prijsPerEenheid.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-800">€{totaal.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gradient-to-r from-red-50 to-white font-semibold">
                        <td colSpan={4} className="px-4 py-3 text-right text-red-800">
                          Subtotaal {hoofdstukNaam}
                        </td>
                        <td className="px-4 py-3 text-right text-red-800">
                          €{hoofdstukTotaal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Totalen */}
          <div className="mt-10">
            <div className="w-1/2 ml-auto">
              <div className="bg-gradient-to-r from-red-50 to-white rounded-lg p-6 border-l-4 border-red-700">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotaal:</span>
                    <span>€{(offerte.totalen.subtotaal * winstFactor).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>BTW ({offerte.projectDetails.btwPercentage}%):</span>
                    <span>€{offerte.totalen.btw.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-red-200">
                    <span className="text-red-800">Totaal incl. BTW:</span>
                    <span className="text-red-800">€{offerte.totalen.totaalIncBtw.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slotwoord */}
        <div className="mb-10 text-gray-700 space-y-4">
          <p>
            Wij vertrouwen erop dat deze offerte aansluit bij uw wensen. Mocht u vragen hebben of 
            bepaalde punten willen bespreken, dan staan wij u graag te woord.
          </p>
          <p className="mt-6">
            Met vriendelijke groet,<br />
            Team Tjakkesbouw
          </p>
        </div>

        {/* Voorwaarden */}
        <div className="mb-10">
          <div className="border-b-2 border-red-700 mb-4 pb-1">
            <h3 className="text-xl font-bold text-red-800">Voorwaarden</h3>
          </div>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>Geldigheid offerte: 30 dagen</li>
            <li>Levertijd: In overleg</li>
            <li>Betalingsvoorwaarden: 14 dagen na factuurdatum</li>
            <li>Op deze offerte zijn onze algemene voorwaarden van toepassing</li>
          </ul>
        </div>

        {/* Ondertekening */}
        <div className="mt-16 grid grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-lg">
            <p className="font-bold mb-12 text-red-800">Voor akkoord opdrachtgever:</p>
            <div className="border-t border-red-200 pt-4 space-y-6 text-gray-600">
              <p>Naam: _______________________</p>
              <p>Datum: _______________________</p>
              <p>Handtekening: _______________</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-lg">
            <p className="font-bold mb-12 text-red-800">Namens Tjakkesbouw:</p>
            <div className="border-t border-red-200 pt-4 space-y-6 text-gray-600">
              <p>Naam: _______________________</p>
              <p>Datum: {datum}</p>
              <p>Handtekening: _______________</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export function Offerte({ offerte, klant, onClose }: OfferteProps) {
  const offerteRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => offerteRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    documentTitle: `Offerte-${offerte.id}-${new Date().toLocaleDateString('nl-NL')}`,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <PrintableContent ref={offerteRef} offerte={offerte} klant={klant} />
        
        {/* Knoppen */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-4 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Sluiten
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          >
            PDF Genereren
          </button>
        </div>
      </div>
    </div>
  );
}