import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CategoryPayGap, Employee, StandardFunctionGap } from '../types'

interface ChartsSectionProps {
  employees: Employee[]
  standardFunctionGaps: StandardFunctionGap[]
  serviceYearGap: CategoryPayGap[]
  ageGap: CategoryPayGap[]
  trendData: { year: number; gapPercentage: number }[]
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
    <div className="h-72">{children}</div>
  </article>
)

const quartiles = (values: number[]) => {
  if (values.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0 }
  }
  const sorted = [...values].sort((a, b) => a - b)
  const pos = (quantile: number) => sorted[Math.floor((sorted.length - 1) * quantile)]
  return {
    min: sorted[0],
    q1: pos(0.25),
    median: pos(0.5),
    q3: pos(0.75),
    max: sorted[sorted.length - 1],
  }
}

export const ChartsSection = ({
  employees,
  standardFunctionGaps,
  serviceYearGap,
  ageGap,
  trendData,
}: ChartsSectionProps) => {
  const rankingData = standardFunctionGaps.slice(0, 10).map((item) => ({
    ...item,
    gapAbs: Math.abs(item.gapPercentage),
  }))

  const heatmapData = standardFunctionGaps.slice(0, 12)

  const womenQuartiles = quartiles(
    employees.filter((employee) => employee.gender === 'Vrouw').map((employee) => employee.hourlyWage),
  )
  const menQuartiles = quartiles(
    employees.filter((employee) => employee.gender === 'Man').map((employee) => employee.hourlyWage),
  )

  const boxPlotData = [
    { gender: 'Vrouw', ...womenQuartiles },
    { gender: 'Man', ...menQuartiles },
  ]

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Trendgrafiek gender pay gap (per instroomjaar)">
        <ResponsiveContainer>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(1)}%`} />
            <Line dataKey="gapPercentage" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Horizontale ranking standaardfuncties (top 10)">
        <ResponsiveContainer>
          <BarChart layout="vertical" data={rankingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="%" />
            <YAxis type="category" dataKey="standardFunction" width={90} />
            <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(1)}%`} />
            <Bar dataKey="gapAbs" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Heatmap standaardfuncties vs pay gap">
        <div className="grid grid-cols-3 gap-2">
          {heatmapData.map((group) => {
            const intensity = Math.min(100, Math.abs(group.gapPercentage) * 12)
            return (
              <div
                key={group.standardFunction}
                className="rounded-md p-2 text-xs text-slate-900"
                style={{ backgroundColor: `hsl(14 100% ${100 - intensity / 2}%)` }}
              >
                <p className="font-semibold">{group.standardFunction}</p>
                <p>{group.gapPercentage.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>
      </ChartCard>

      <ChartCard title="Boxplot uurloonverdeling (indicatief)">
        <ResponsiveContainer>
          <BarChart data={boxPlotData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gender" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="min" stackId="box" fill="#e2e8f0" />
            <Bar dataKey="q1" stackId="box" fill="#cbd5e1" />
            <Bar dataKey="median" stackId="box" fill="#818cf8" />
            <Bar dataKey="q3" stackId="box" fill="#6366f1" />
            <Bar dataKey="max" stackId="box" fill="#4338ca" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Scatterplot dienstjaren vs uurloon">
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearsOfService" type="number" name="Dienstjaren" />
            <YAxis dataKey="hourlyWage" type="number" name="Uurloon" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name="Medewerkers"
              data={employees.filter((employee) => employee.yearsOfService !== null)}
              fill="#10b981"
            />
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
