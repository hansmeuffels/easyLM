# Loontransparantie Monitor (MVP)

Frontend-only signaleringsinstrument voor Nederlandse werkgevers ter voorbereiding op de Europese Richtlijn Loontransparantie.

> Deze applicatie geeft geen juridisch oordeel; het doel is werkgevers snel inzicht te geven in mogelijke risico's en aandachtspunten op basis van uurloon.

## Stack

- React + TypeScript (strict mode)
- Vite
- Tailwind CSS
- Recharts
- Zustand
- Vitest
- ESLint + Prettier

## Snel starten

```bash
npm install
npm run dev
```

Productiebuild:

```bash
npm run build
```

Checks:

```bash
npm run lint
npm run test
npm run format
```

## Data upload

- CSV-formaat: semicolon-separated (`;`)
- Datums: `dd-mm-jjjj`
- Getallen: NL-notatie (komma als decimaalteken)
- `Basisloon eenheid`: `Periodeloon` of `Uurloon`
- Meerdere rijen per werknemer: meest recente `Dienstverband - In dienst` per `Personeelsnummer` wordt gebruikt
- Rijen zonder geldig `Basisloon` of geldige uren worden genegeerd

Voorbeeldbestand:

- `public/sample-data/voorbeeld-medewerkers.csv`

## Architectuur

```text
src/
  analysis/      # pure analyse-engine (CSV parsing, filtering, KPI's, signaleringen)
  components/    # dashboard componenten
  store/         # Zustand state
  types/         # domeintypes
```

## Analyse-engine (uurloon centraal)

- Uurloon is altijd de primaire KPI-grondslag
- `Uurloon`: direct gebruikt
- `Periodeloon`: `uurloon = maandloon / (4,33 * uren_per_week)`
  - gebruikt `Afwijkend uren per week` indien beschikbaar, anders `Ploeg uren per week`
- Outlier-detectie: IQR op uurloon

## KPI's en dashboards

- Totale gender pay gap met stoplichtstatus
- Pay gap per functiegroep (minimaal 5 medewerkers)
- Risicomedewerkers (>5% onder gemiddeld uurloon van hoger betaalde geslacht)
- Dienstjarenanalyse
- Leeftijdsanalyse
- Dashboardfilters (werkgever, vestiging, cao, functiegroep, salarisschaal, leeftijd, dienstjaren)

## Uitbreidbaar richting EU-compliance

Voor toekomstige compliance-rapportages kan deze MVP worden uitgebreid met:

1. Versiebeheer op datasets + exporteerbare rapportmomenten
2. Verklarende variabelen (functiegewicht, prestatie, opleidingsniveau) naast signalering
3. Governance-workflow met dossiervorming per geconstateerd risico
4. Audit trail op filterinstellingen, analyses en rapportages
