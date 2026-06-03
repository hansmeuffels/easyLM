import type { Employee } from '../types'
import { formatNumber } from '../analysis'

interface EmployeeTableProps {
  employees: Employee[]
}

const formatOptionalNumber = (value: number | null): string =>
  value === null
    ? '-'
    : new Intl.NumberFormat('nl-NL', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value)

export const EmployeeTable = ({ employees }: EmployeeTableProps) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Werknemergegevens</h3>
        <p className="text-xs text-slate-500">{employees.length} gefilterde werknemers</p>
      </div>
    </div>

    <div className="overflow-auto">
      <table className="min-w-full text-left text-xs">
        <thead className="text-slate-500">
          <tr>
            <th className="pb-2 pr-4">Medewerker</th>
            <th className="pb-2 pr-4">Personeelsnummer</th>
            <th className="pb-2 pr-4">Geslacht</th>
            <th className="pb-2 pr-4">Standaardfunctie</th>
            <th className="pb-2 pr-4">Werkgever</th>
            <th className="pb-2 pr-4">Afdeling</th>
            <th className="pb-2 pr-4">Salarisschaal</th>
            <th className="pb-2 pr-4">Uurloon</th>
            <th className="pb-2 pr-4">Maandloon</th>
            <th className="pb-2 pr-4">Uren p/w</th>
            <th className="pb-2 pr-4">Leeftijd</th>
            <th className="pb-2 pr-4">Dienstjaren</th>
            <th className="pb-2">Outlier</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.personnelNumber} className="border-t border-slate-100 text-slate-700">
              <td className="py-2 pr-4 font-medium text-slate-900">{employee.fullName}</td>
              <td className="py-2 pr-4">{employee.personnelNumber}</td>
              <td className="py-2 pr-4">{employee.gender}</td>
              <td className="py-2 pr-4">{employee.standardFunction}</td>
              <td className="py-2 pr-4">{employee.employer}</td>
              <td className="py-2 pr-4">{employee.department}</td>
              <td className="py-2 pr-4">{employee.salaryScale}</td>
              <td className="py-2 pr-4">€ {formatNumber(employee.hourlyWage)}</td>
              <td className="py-2 pr-4">€ {formatNumber(employee.monthlySalary)}</td>
              <td className="py-2 pr-4">{formatNumber(employee.hoursPerWeek)}</td>
              <td className="py-2 pr-4">{formatOptionalNumber(employee.age)}</td>
              <td className="py-2 pr-4">{formatOptionalNumber(employee.yearsOfService)}</td>
              <td className="py-2">{employee.isOutlier ? 'Ja' : 'Nee'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)
