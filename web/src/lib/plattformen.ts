// Deep-Link-Verzeichnis: Plattformen, die wir aus rechtlichen Gründen (AGB/Login/Paywall)
// NICHT automatisch einlesen, aber verlinken. Siehe KONZEPT.md, Tier B.

export type PlattformKategorie = 'Stellenboerse' | 'Aggregator' | 'Work-Exchange' | 'Anbieter';

export interface Plattform {
  name: string;
  url: string;
  kategorie: PlattformKategorie;
  beschreibung: string;
  kostenlosMoeglich: boolean;
  hinweis?: string;
}

export const PLATTFORMEN: Plattform[] = [
  // --- Stellenbörsen & Praktika: frei durchsuchbar, oft bezahlt/mit Stipendium ----
  {
    name: 'Conservation Careers',
    url: 'https://www.conservation-careers.com/conservation-jobs/',
    kategorie: 'Stellenboerse',
    beschreibung: 'Große internationale Naturschutz-Jobbörse inkl. Praktika und Volunteer-Stellen.',
    kostenlosMoeglich: true,
    hinweis: 'Lesen wir nicht automatisch aus (AGB) – hier aber direkt durchsuchbar.',
  },
  {
    name: 'GoodWork.ca',
    url: 'https://www.goodwork.ca/jobs.php',
    kategorie: 'Stellenboerse',
    beschreibung: 'Kanadische Umwelt- und Naturschutz-Jobs, Praktika und Volunteer-Stellen.',
    kostenlosMoeglich: true,
  },
  {
    name: 'EnvironmentJob (UK)',
    url: 'https://environmentjob.co.uk/',
    kategorie: 'Stellenboerse',
    beschreibung: 'Britische Umwelt-Jobbörse mit Ökologie-Praktika und Traineeships.',
    kostenlosMoeglich: true,
  },
  {
    name: 'Student Conservation Association',
    url: 'https://www.thesca.org/',
    kategorie: 'Stellenboerse',
    beschreibung: 'US-Naturschutz-Praktika für junge Leute – meist mit Stipendium und Unterkunft.',
    kostenlosMoeglich: true,
  },
  {
    name: 'AmeriCorps',
    url: 'https://my.americorps.gov/mp/listing/publicRequestSearch.do',
    kategorie: 'Stellenboerse',
    beschreibung: 'US-Freiwilligenprogramme inkl. Conservation Corps – mit Taschengeld und oft Unterkunft.',
    kostenlosMoeglich: true,
  },
  {
    name: 'Society for Conservation Biology',
    url: 'https://careers.conbio.org/jobs',
    kategorie: 'Stellenboerse',
    beschreibung: 'Stellen, Praktika und Assistenzen rund um Naturschutzbiologie, weltweit.',
    kostenlosMoeglich: true,
  },
  {
    name: 'Ornithology Exchange',
    url: 'https://ornithologyexchange.org/jobs/',
    kategorie: 'Stellenboerse',
    beschreibung: 'Vogel-/Feldforschung: Saisonstellen, Feldassistenzen und Graduate-Projekte.',
    kostenlosMoeglich: true,
  },
  {
    name: 'Eurodesk Opportunity Finder',
    url: 'https://programmes.eurodesk.eu/',
    kategorie: 'Stellenboerse',
    beschreibung: 'Geförderte EU-Programme (u. a. ESC) – Freiwilligendienste mit Kost & Unterkunft.',
    kostenlosMoeglich: true,
  },
  {
    name: 'Volunteer World',
    url: 'https://www.volunteerworld.com/en/volunteer-abroad/wildlife-conservation',
    kategorie: 'Aggregator',
    beschreibung: 'Großes Vergleichsportal für Freiwilligenprojekte in über 80 Ländern.',
    kostenlosMoeglich: false,
    hinweis: 'Überwiegend kostenpflichtige Programme – auf Gebühren achten.',
  },
  {
    name: 'Go Overseas',
    url: 'https://www.gooverseas.com/volunteer-abroad/wildlife-conservation',
    kategorie: 'Aggregator',
    beschreibung: 'Bewertungen und Vergleich von Naturschutz- und Wildlife-Programmen.',
    kostenlosMoeglich: false,
  },
  {
    name: 'GoAbroad',
    url: 'https://www.goabroad.com/volunteer-abroad/search/environment/volunteer-abroad-1',
    kategorie: 'Aggregator',
    beschreibung: 'Suchportal für Umwelt- und Naturschutzprojekte weltweit.',
    kostenlosMoeglich: false,
  },
  {
    name: 'Idealist',
    url: 'https://www.idealist.org/en/volunteer',
    kategorie: 'Aggregator',
    beschreibung: 'Internationale Datenbank für gemeinnützige Stellen und Volunteering.',
    kostenlosMoeglich: true,
  },
  {
    name: 'Worldpackers',
    url: 'https://www.worldpackers.com/search?type=NGO',
    kategorie: 'Work-Exchange',
    beschreibung: 'Mitarbeit gegen Kost & Unterkunft, viele Öko- und Tierprojekte.',
    kostenlosMoeglich: true,
    hinweis: 'Mitgliedschaft nötig, um Hosts zu kontaktieren.',
  },
  {
    name: 'Workaway',
    url: 'https://www.workaway.info/en/host-list/conservation',
    kategorie: 'Work-Exchange',
    beschreibung: 'Weltweite Work-Exchange-Plattform mit Naturschutz- und Farmprojekten.',
    kostenlosMoeglich: true,
    hinweis: 'Kostenpflichtige Mitgliedschaft, um Hosts zu sehen/kontaktieren.',
  },
  {
    name: 'WWOOF',
    url: 'https://wwoof.net/',
    kategorie: 'Work-Exchange',
    beschreibung: 'Mitarbeit auf Bio-Höfen gegen Kost & Unterkunft, länderweise organisiert.',
    kostenlosMoeglich: true,
    hinweis: 'Nationale Mitgliedschaft pro Land erforderlich.',
  },
  {
    name: 'HelpX',
    url: 'https://www.helpx.net/',
    kategorie: 'Work-Exchange',
    beschreibung: 'Work-Exchange auf Höfen, Ranches und in Naturprojekten.',
    kostenlosMoeglich: true,
  },
  {
    name: 'HelpStay',
    url: 'https://www.helpstay.com/exchange/animal-conservation-projects',
    kategorie: 'Work-Exchange',
    beschreibung: 'Tier- und Naturschutzprojekte, teils mit freier Kost & Unterkunft.',
    kostenlosMoeglich: true,
  },
  {
    name: 'GVI',
    url: 'https://www.gviusa.com/volunteer-abroad/',
    kategorie: 'Anbieter',
    beschreibung: 'Organisierte Naturschutz- und Meeresprojekte mit Betreuung.',
    kostenlosMoeglich: false,
    hinweis: 'Kostenpflichtige Programme.',
  },
  {
    name: 'Biosphere Expeditions',
    url: 'https://www.biosphere-expeditions.org/',
    kategorie: 'Anbieter',
    beschreibung: 'Citizen-Science-Expeditionen im Wildtier- und Meeresschutz.',
    kostenlosMoeglich: false,
  },
  {
    name: 'Frontier',
    url: 'https://frontier.ac.uk/',
    kategorie: 'Anbieter',
    beschreibung: 'Naturschutz- und Forschungsprojekte für junge Freiwillige.',
    kostenlosMoeglich: false,
  },
  {
    name: 'Coral Cay Conservation',
    url: 'https://www.coralcay.org/',
    kategorie: 'Anbieter',
    beschreibung: 'Spezialist für Korallenriff- und Regenwaldschutz.',
    kostenlosMoeglich: false,
  },
  {
    name: 'Projects Abroad',
    url: 'https://www.projects-abroad.org/volunteer-projects/conservation-and-environment/',
    kategorie: 'Anbieter',
    beschreibung: 'Betreute Umwelt- und Naturschutzprojekte weltweit.',
    kostenlosMoeglich: false,
  },
  {
    name: 'GoEco',
    url: 'https://www.goeco.org/category/wildlife-volunteer-and-conservation',
    kategorie: 'Anbieter',
    beschreibung: 'Wildlife- und Naturschutzprogramme in über 40 Ländern.',
    kostenlosMoeglich: false,
  },
  {
    name: 'IVHQ',
    url: 'https://www.volunteerhq.org/volunteer-abroad-projects/wildlife-and-animal-care/',
    kategorie: 'Anbieter',
    beschreibung: 'Wildlife- und Tierpflegeprojekte mit Unterkunft und Verpflegung.',
    kostenlosMoeglich: false,
  },
  {
    name: 'Worldwide Vets',
    url: 'https://www.worldwide-vets.org/volunteer',
    kategorie: 'Anbieter',
    beschreibung: 'Tierschutz- und Wildlife-Vet-Projekte für Engagierte.',
    kostenlosMoeglich: false,
  },
  {
    name: 'Earthwatch',
    url: 'https://earthwatch.org/expeditions',
    kategorie: 'Anbieter',
    beschreibung: 'Citizen-Science-Expeditionen mit Forschenden – echte Feldforschung zum Mitmachen.',
    kostenlosMoeglich: false,
    hinweis: 'Teilnahmebeitrag; dafür wissenschaftlich betreut.',
  },
];
