import { useMemo, useState } from 'react'
import {
  applyFilters,
  calculateCategoryPayGap,
  calculateFunctionGroupGaps,
  calculateOverallGap,
  calculateRiskEmployees,
  calculateSignals,
  collectFilterOptions,
  createEmptyFilters,
  parseEmployeesFromCsv,
} from './analysis'
import { ChartsSection } from './components/ChartsSection'
import { EmployeeTable } from './components/EmployeeTable'
import { FilterBar } from './components/FilterBar'
import { KpiCards } from './components/KpiCards'
import { RiskTables } from './components/RiskTables'
import { UploadPanel } from './components/UploadPanel'
import { useDashboardStore } from './store/useDashboardStore'

const DISCLAIMER =
  'De Loontransparantie Monitor is een signaleringsinstrument en geeft geen juridisch oordeel.'

function App() {
  const { employees, filters, sourceFileName, setEmployees, setFilters, resetFilters } =
    useDashboardStore()
  const [error, setError] = useState('')

  const filterOptions = useMemo(() => collectFilterOptions(employees), [employees])
  const filteredEmployees = useMemo(() => applyFilters(employees, filters), [employees, filters])

  const overallGap = useMemo(() => calculateOverallGap(filteredEmployees), [filteredEmployees])
  const standardFunctionGaps = useMemo(
    () => calculateFunctionGroupGaps(filteredEmployees),
    [filteredEmployees],
  )
  const riskResult = useMemo(() => calculateRiskEmployees(filteredEmployees), [filteredEmployees])

  const serviceYearGap = useMemo(
    () => calculateCategoryPayGap(filteredEmployees, (employee) => employee.serviceYearsCategory),
    [filteredEmployees],
  )
  const ageGap = useMemo(
    () => calculateCategoryPayGap(filteredEmployees, (employee) => employee.ageCategory),
    [filteredEmployees],
  )
  const signals = useMemo(() => calculateSignals(filteredEmployees), [filteredEmployees])

  const handleEmployeesLoaded = (csvContent: string, fileName: string) => {
    const parsedEmployees = parseEmployeesFromCsv(csvContent)
    setEmployees(parsedEmployees, fileName)
    setError('')
  }

  const outlierCount = filteredEmployees.filter((employee) => employee.isOutlier).length

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Loontransparantie Monitor · MVP
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Inzicht in potentiële beloningsrisico&apos;s
          </h1>
          <p className="mt-3 text-sm text-slate-600">{DISCLAIMER}</p>
          {sourceFileName && (
            <p className="mt-2 text-xs text-slate-500">Actieve databron: {sourceFileName}</p>
          )}
        </header>

        <UploadPanel onEmployeesLoaded={handleEmployeesLoaded} onError={setError} />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {employees.length > 0 ? (
          <>
            <FilterBar
              filters={filters}
              options={filterOptions}
              onChange={setFilters}
              onReset={() => setFilters(createEmptyFilters())}
            />
            <KpiCards
              overallGap={overallGap}
              standardFunctionGaps={standardFunctionGaps}
              riskResult={riskResult}
              outlierCount={outlierCount}
            />
            <ChartsSection
              employees={filteredEmployees}
              serviceYearGap={serviceYearGap}
              ageGap={ageGap}
            />
            <RiskTables
              standardFunctionGaps={standardFunctionGaps}
              riskResult={riskResult}
              signals={signals}
            />
            <EmployeeTable employees={filteredEmployees} />
          </>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Upload een CSV-bestand of start met voorbeelddata om KPI&apos;s, grafieken en signaleringen
            te bekijken.
          </section>
        )}

        {employees.length > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="self-start rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Filters wissen
          </button>
        )}
      </main>
    </div>
  )
}

export default App
