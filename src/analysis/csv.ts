import type { Employee } from '../types'
import {
  getAgeCategory,
  getServiceYearsCategory,
  normalizeGender,
  parseDutchDate,
  parseNlNumber,
  yearsBetween,
} from './helpers'

const HOURS_IN_MONTH_FACTOR = 4.33
const REQUIRED_HEADERS = [
  'Volledige naam',
  'Personeelsnummer',
  'Geslacht',
  'Dienstverband - In dienst',
  'Functie',
  'Standaardfunctie',
  'Afdeling',
  'Basisloon',
  'Basisloon eenheid',
]

const parseDelimitedCsv = (csvContent: string): Record<string, string>[] => {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(';').map((header) => header.trim())

  return lines.slice(1).map((line) => {
    const columns = line.split(';')
    return headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = (columns[index] ?? '').trim()
      return record
    }, {})
  })
}

const ensureHeaders = (rows: Record<string, string>[]): void => {
  if (rows.length === 0) {
    return
  }

  const existingHeaders = new Set(Object.keys(rows[0]))
  const missing = REQUIRED_HEADERS.filter((header) => !existingHeaders.has(header))

  if (missing.length > 0) {
    throw new Error(`Verplichte kolommen ontbreken: ${missing.join(', ')}`)
  }
}

const pickLatestRowsPerEmployee = (
  rows: Record<string, string>[],
): Record<string, string>[] => {
  const byPersonnelNumber = new Map<string, Record<string, string>>()

  for (const row of rows) {
    const personnelNumber = row['Personeelsnummer']
    if (!personnelNumber || !row['Basisloon']) {
      continue
    }

    const candidateDate = parseDutchDate(row['Dienstverband - In dienst'])
    const current = byPersonnelNumber.get(personnelNumber)

    if (!current) {
      byPersonnelNumber.set(personnelNumber, row)
      continue
    }

    const currentDate = parseDutchDate(current['Dienstverband - In dienst'])
    if ((candidateDate?.getTime() ?? 0) >= (currentDate?.getTime() ?? 0)) {
      byPersonnelNumber.set(personnelNumber, row)
    }
  }

  return [...byPersonnelNumber.values()]
}

const calculateOutlierBounds = (values: number[]) => {
  if (values.length < 4) {
    return { lowerBound: Number.NEGATIVE_INFINITY, upperBound: Number.POSITIVE_INFINITY }
  }

  const sorted = [...values].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const iqr = q3 - q1

  return {
    lowerBound: q1 - 1.5 * iqr,
    upperBound: q3 + 1.5 * iqr,
  }
}

const parseEmployee = (
  row: Record<string, string>,
  referenceDate: Date,
): Employee | null => {
  const baseSalary = parseNlNumber(row['Basisloon'])
  if (baseSalary === null || baseSalary <= 0) {
    return null
  }

  const baseSalaryUnitRaw = row['Basisloon eenheid']
  const baseSalaryUnit =
    baseSalaryUnitRaw === 'Uurloon' ? 'Uurloon' : ('Periodeloon' as const)

  const afwijkend = parseNlNumber(row['Afwijkend uren per week'])
  const defaultHours = parseNlNumber(row['Ploeg uren per week'])
  const hoursPerWeek = afwijkend ?? defaultHours

  if (!hoursPerWeek || hoursPerWeek <= 0) {
    return null
  }

  const hourlyWage =
    baseSalaryUnit === 'Uurloon'
      ? baseSalary
      : baseSalary / (HOURS_IN_MONTH_FACTOR * hoursPerWeek)

  const monthlySalary =
    baseSalaryUnit === 'Periodeloon'
      ? baseSalary
      : baseSalary * HOURS_IN_MONTH_FACTOR * hoursPerWeek

  const startDate = parseDutchDate(row['Dienstverband - In dienst'])
  const dateOfBirth = parseDutchDate(row['Geboortedatum'])
  const age = yearsBetween(dateOfBirth, referenceDate)
  const yearsOfService = yearsBetween(startDate, referenceDate)

  return {
    fullName: row['Volledige naam'] || 'Onbekend',
    personnelNumber: row['Personeelsnummer'],
    nationality: row['Nationaliteit'] || 'Onbekend',
    gender: normalizeGender(row['Geslacht']),
    dateOfBirth,
    startDate,
    jobTitle: row['Functie'] || 'Onbekend',
    standardFunction: row['Standaardfunctie'] || row['Functiegroep'] || 'Onbekend',
    department: row['Afdeling'] || 'Onbekend',
    employer: row['Werkgever'] || 'Onbekend',
    location: row['Vestiging'] || 'Onbekend',
    cao: row['Cao'] || 'Onbekend',
    salaryScale: row['Salarisschaal'] || 'Onbekend',
    salaryCell: row['Salariscel'] || 'Onbekend',
    baseSalary,
    baseSalaryUnit,
    hoursPerWeek,
    hourlyWage,
    monthlySalary,
    age,
    yearsOfService,
    ageCategory: getAgeCategory(age),
    serviceYearsCategory: getServiceYearsCategory(yearsOfService),
    isOutlier: false,
  }
}

export const parseEmployeesFromCsv = (
  csvContent: string,
  referenceDate = new Date(),
): Employee[] => {
  const parsedRows = parseDelimitedCsv(csvContent)
  ensureHeaders(parsedRows)

  const latestRows = pickLatestRowsPerEmployee(parsedRows)
  const employees = latestRows
    .map((row) => parseEmployee(row, referenceDate))
    .filter((employee): employee is Employee => employee !== null)

  const bounds = calculateOutlierBounds(employees.map((employee) => employee.hourlyWage))

  return employees.map((employee) => ({
    ...employee,
    isOutlier:
      employee.hourlyWage < bounds.lowerBound || employee.hourlyWage > bounds.upperBound,
  }))
}
