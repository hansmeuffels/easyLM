import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CategoryPayGap, Employee } from '../types'

interface ChartsSectionProps {
  employees: Employee[]
  serviceYearGap: CategoryPayGap[]
  ageGap: CategoryPayGap[]
}

interface ScatterTooltipPayload {
  payload?: Employee
}

interface ScatterTooltipProps {
  active?: boolean
  payload?: ScatterTooltipPayload[]
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
    <div className="h-72">{children}</div>
  </article>
)

const formatTooltipNumber = (value: number | null): string =>
  value === null
    ? '-'
    : new Intl.NumberFormat('nl-NL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)

const getGenderColor = (gender: Employee['gender']): string => {
  if (gender === 'Vrouw') {
    return '#ec4899'
  }

  if (gender === 'Man') {
    return '#2563eb'
  }

  return '#94a3b8'
}

const ScatterTooltip = ({ active, payload }: ScatterTooltipProps) => {
  const employee = payload?.[0]?.payload

  if (!active || !employee) {
    return null
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
      <p className="font-semibold text-slate-900">{employee.fullName}</p>
      <p>Geslacht: {employee.gender}</p>
      <p>Dienstjaren: {formatTooltipNumber(employee.yearsOfService)}</p>
      <p>Uurloon: € {formatTooltipNumber(employee.hourlyWage)}</p>
    </div>
  )
}

export const ChartsSection = ({ employees, serviceYearGap, ageGap }: ChartsSectionProps) => {
  const scatterData = employees.filter((employee) => employee.yearsOfService !== null)

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Scatterplot dienstjaren vs uurloon">
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearsOfService" type="number" name="Dienstjaren" />
            <YAxis dataKey="hourlyWage" type="number" name="Uurloon" />
            <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Medewerkers" data={scatterData}>
              {scatterData.map((employee) => (
                <Cell key={employee.personnelNumber} fill={getGenderColor(employee.gender)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Leeftijd vs gemiddeld uurloon">
        <ResponsiveContainer>
          <BarChart data={ageGap}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="maleAverageHourlyWage" name="Man" fill="#2563eb" />
            <Bar dataKey="femaleAverageHourlyWage" name="Vrouw" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Dienstjaren vs gemiddeld uurloon">
        <ResponsiveContainer>
          <BarChart data={serviceYearGap}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="maleAverageHourlyWage" name="Man" fill="#2563eb" />
            <Bar dataKey="femaleAverageHourlyWage" name="Vrouw" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  )
}
