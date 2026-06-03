import type { OverallGapResult, RiskResult, StandardFunctionGap } from '../types'
import { formatNumber, formatPercentage } from '../analysis'

interface KpiCardsProps {
  overallGap: OverallGapResult
  standardFunctionGaps: StandardFunctionGap[]
  riskResult: RiskResult
  outlierCount: number
}

const statusLabel = {
  green: '🟢 Groen',
  orange: '🟠 Oranje',
  red: '🔴 Rood',
}

const Card = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
  </article>
)

export const KpiCards = ({
  overallGap,
  standardFunctionGaps,
  riskResult,
  outlierCount,
}: KpiCardsProps) => {
  const groupsAboveThreshold = standardFunctionGaps.filter(
    (group) => Math.abs(group.gapPercentage) > 5,
  ).length

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card
        title="Totale Gender Pay Gap"
        value={formatPercentage(overallGap.gapPercentage)}
        subtitle={`${statusLabel[overallGap.status]} • M: €${formatNumber(overallGap.maleAverageHourlyWage)} / V: €${formatNumber(overallGap.femaleAverageHourlyWage)}`}
      />
      <Card
        title="Standaardfuncties > 5% gap"
        value={String(groupsAboveThreshold)}
        subtitle={`van ${standardFunctionGaps.length} geanalyseerde standaardfuncties`}
      />
      <Card
        title="Risicomedewerkers"
        value={String(riskResult.total)}
        subtitle=">5% onder gemiddeld uurloon van ander geslacht"
      />
      <Card
        title="Top standaardfunctie"
        value={standardFunctionGaps[0] ? standardFunctionGaps[0].standardFunction : '-'}
        subtitle={
          standardFunctionGaps[0]
            ? `${formatPercentage(standardFunctionGaps[0].gapPercentage)} verschil`
            : 'Nog onvoldoende data'
        }
      />
      <Card
        title="Gedetecteerde outliers"
        value={String(outlierCount)}
        subtitle="IQR-gebaseerde detectie op uurloon"
      />
    </section>
  )
}
