import type {
  CategoryPayGap,
  Employee,
  StandardFunctionGap,
  OverallGapResult,
  RiskEmployee,
  RiskResult,
} from '../types'
import { average, toPercentage } from './helpers'

const MIN_GROUP_SIZE = 5

const splitByGender = (employees: Employee[]) => {
  const men = employees.filter((employee) => employee.gender === 'Man')
  const women = employees.filter((employee) => employee.gender === 'Vrouw')

  return { men, women }
}

export const calculateOverallGap = (employees: Employee[]): OverallGapResult => {
  const { men, women } = splitByGender(employees)
  const maleAverageHourlyWage = average(men.map((employee) => employee.hourlyWage))
  const femaleAverageHourlyWage = average(women.map((employee) => employee.hourlyWage))
  const gapPercentage = toPercentage(maleAverageHourlyWage, femaleAverageHourlyWage)

  const status = gapPercentage < 3 ? 'green' : gapPercentage <= 5 ? 'orange' : 'red'

  return {
    maleAverageHourlyWage,
    femaleAverageHourlyWage,
    gapPercentage,
    status,
  }
}

export const calculateFunctionGroupGaps = (employees: Employee[]): StandardFunctionGap[] => {
  const groups = new Map<string, Employee[]>()

  for (const employee of employees) {
    const group = groups.get(employee.standardFunction) ?? []
    group.push(employee)
    groups.set(employee.standardFunction, group)
  }

  const results: StandardFunctionGap[] = []

  for (const [standardFunction, members] of groups.entries()) {
    if (members.length < MIN_GROUP_SIZE) {
      continue
    }

    const { men, women } = splitByGender(members)
    if (men.length === 0 || women.length === 0) {
      continue
    }

    const maleAverageHourlyWage = average(men.map((employee) => employee.hourlyWage))
    const femaleAverageHourlyWage = average(women.map((employee) => employee.hourlyWage))

    results.push({
      standardFunction,
      employees: members.length,
      maleAverageHourlyWage,
      femaleAverageHourlyWage,
      gapPercentage: toPercentage(maleAverageHourlyWage, femaleAverageHourlyWage),
    })
  }

  return results.sort((a, b) => Math.abs(b.gapPercentage) - Math.abs(a.gapPercentage))
}

export const calculateRiskEmployees = (employees: Employee[]): RiskResult => {
  const standardFunctionGaps = calculateFunctionGroupGaps(employees)
  const riskEmployees: RiskEmployee[] = []

  for (const groupGap of standardFunctionGaps) {
    const groupEmployees = employees.filter(
      (employee) => employee.standardFunction === groupGap.standardFunction,
    )

    const lowerPaidGender =
      groupGap.femaleAverageHourlyWage <= groupGap.maleAverageHourlyWage ? 'Vrouw' : 'Man'
    const comparisonAverage =
      lowerPaidGender === 'Vrouw'
        ? groupGap.maleAverageHourlyWage
        : groupGap.femaleAverageHourlyWage

    for (const employee of groupEmployees) {
      if (employee.gender !== lowerPaidGender) {
        continue
      }

      const relativeSalary = employee.hourlyWage / comparisonAverage
      if (relativeSalary <= 0.95) {
        riskEmployees.push({
          fullName: employee.fullName,
          personnelNumber: employee.personnelNumber,
          standardFunction: employee.standardFunction,
          employer: employee.employer,
          hourlyWage: employee.hourlyWage,
          gapToOtherGenderPercentage: toPercentage(comparisonAverage, employee.hourlyWage),
        })
      }
    }
  }

  const byEmployer: Record<string, number> = {}
  const byStandardFunction: Record<string, number> = {}

  for (const employee of riskEmployees) {
    byEmployer[employee.employer] = (byEmployer[employee.employer] ?? 0) + 1
    byStandardFunction[employee.standardFunction] =
      (byStandardFunction[employee.standardFunction] ?? 0) + 1
  }

  return {
    total: riskEmployees.length,
    byEmployer,
    byStandardFunction,
    employees: riskEmployees.sort(
      (a, b) => b.gapToOtherGenderPercentage - a.gapToOtherGenderPercentage,
    ),
  }
}

export const calculateCategoryPayGap = (
  employees: Employee[],
  categorySelector: (employee: Employee) => string | null,
): CategoryPayGap[] => {
  const categories = new Map<string, Employee[]>()

  for (const employee of employees) {
    const category = categorySelector(employee)
    if (!category) {
      continue
    }

    const records = categories.get(category) ?? []
    records.push(employee)
    categories.set(category, records)
  }

  return [...categories.entries()].map(([category, members]) => {
    const { men, women } = splitByGender(members)
    const maleAverageHourlyWage = average(men.map((employee) => employee.hourlyWage))
    const femaleAverageHourlyWage = average(women.map((employee) => employee.hourlyWage))

    return {
      category,
      maleAverageHourlyWage,
      femaleAverageHourlyWage,
      gapPercentage: toPercentage(maleAverageHourlyWage, femaleAverageHourlyWage),
    }
  })
}

export const calculateTrendByStartYear = (employees: Employee[]) => {
  const byYear = new Map<number, Employee[]>()

  for (const employee of employees) {
    if (!employee.startDate) {
      continue
    }
    const year = employee.startDate.getFullYear()
    const members = byYear.get(year) ?? []
    members.push(employee)
    byYear.set(year, members)
  }

  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, members]) => {
      const overall = calculateOverallGap(members)
      return {
        year,
        gapPercentage: overall.gapPercentage,
      }
    })
}

export const calculateSignals = (employees: Employee[]): string[] => {
  const standardFunctionGaps = calculateFunctionGroupGaps(employees)
  const risk = calculateRiskEmployees(employees)

  const insights: string[] = []

  const topGap = standardFunctionGaps[0]
  if (topGap && Math.abs(topGap.gapPercentage) > 5) {
    insights.push(
      `Standaardfunctie ${topGap.standardFunction} toont een loonverschil van ${topGap.gapPercentage.toFixed(1).replace('.', ',')}%.`,
    )
  }

  const topEmployer = Object.entries(risk.byEmployer).sort((a, b) => b[1] - a[1])[0]
  if (topEmployer) {
    insights.push(`Werkgever ${topEmployer[0]} heeft ${topEmployer[1]} risicomedewerkers.`)
  }

  const topSalaryScale = employees.reduce<Record<string, number>>((acc, employee) => {
    if (employee.salaryScale !== 'Onbekend' && employee.isOutlier) {
      acc[employee.salaryScale] = (acc[employee.salaryScale] ?? 0) + 1
    }
    return acc
  }, {})

  const topScale = Object.entries(topSalaryScale).sort((a, b) => b[1] - a[1])[0]
  if (topScale) {
    insights.push(
      `Verschillen concentreren zich voornamelijk in salarisschaal ${topScale[0]}.`,
    )
  }

  if (standardFunctionGaps.length > 0) {
    insights.push(
      `Loonverschillen binnen standaardfuncties vragen nadere toetsing op factoren zoals dienstjaren en functiezwaarte.`,
    )
  }

  return insights
}
