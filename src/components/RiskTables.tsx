import type { RiskResult, StandardFunctionGap } from '../types'
import { formatNumber, formatPercentage } from '../analysis'

interface RiskTablesProps {
  standardFunctionGaps: StandardFunctionGap[]
  riskResult: RiskResult
  signals: string[]
}

export const RiskTables = ({ standardFunctionGaps, riskResult, signals }: RiskTablesProps) => (
  <section className="grid gap-4 xl:grid-cols-3">
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Automatische signaleringen</h3>
      <ul className="space-y-2 text-sm text-slate-700">
        {signals.length === 0 && <li>Geen signaleringen op basis van huidige selectie.</li>}
        {signals.map((signal) => (
          <li key={signal} className="rounded-md bg-slate-50 p-2">
            {signal}
          </li>
        ))}
      </ul>
    </article>

    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Risico standaardfuncties</h3>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="text-slate-500">
            <tr>
              <th>Standaardfunctie</th>
              <th>Medewerkers</th>
              <th>Gap %</th>
              <th>Risico</th>
            </tr>
          </thead>
          <tbody>
            {standardFunctionGaps.slice(0, 10).map((group) => (
              <tr key={group.standardFunction} className="border-t border-slate-100">
                <td className="py-2">{group.standardFunction}</td>
                <td>{group.employees}</td>
                <td>{formatPercentage(group.gapPercentage)}</td>
                <td>{Math.abs(group.gapPercentage) > 5 ? 'Hoog' : 'Beperkt'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>

    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Risicomedewerkers</h3>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="text-slate-500">
            <tr>
              <th>Medewerker</th>
              <th>Standaardfunctie</th>
              <th>Uurloon</th>
              <th>Verschil %</th>
            </tr>
          </thead>
          <tbody>
            {riskResult.employees.slice(0, 10).map((employee) => (
              <tr key={employee.personnelNumber} className="border-t border-slate-100">
                <td className="py-2">{employee.fullName}</td>
                <td>{employee.standardFunction}</td>
                <td>€ {formatNumber(employee.hourlyWage)}</td>
                <td>{formatPercentage(employee.gapToOtherGenderPercentage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  </section>
)
