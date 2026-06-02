import type { AgeCategory, ServiceYearsCategory } from '../types'

export const parseDutchDate = (value: string): Date | null => {
  if (!value.trim()) {
    return null
  }

  const [day, month, year] = value.split('-').map(Number)
  if (!day || !month || !year) {
    return null
  }

  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export const parseNlNumber = (value: string): number | null => {
  const cleaned = value.trim().replace(/\./g, '').replace(',', '.')
  if (!cleaned) {
    return null
  }
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

export const normalizeGender = (value: string): 'Man' | 'Vrouw' | 'Onbekend' => {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'man') {
    return 'Man'
  }
  if (normalized === 'vrouw') {
    return 'Vrouw'
  }
  return 'Onbekend'
}

export const yearsBetween = (start: Date | null, end: Date): number | null => {
  if (!start) {
    return null
  }
  const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  return years < 0 ? 0 : years
}

export const getAgeCategory = (age: number | null): AgeCategory | null => {
  if (age === null) {
    return null
  }
  if (age < 25) return '<25'
  if (age <= 34) return '25-34'
  if (age <= 44) return '35-44'
  if (age <= 54) return '45-54'
  return '55+'
}

export const getServiceYearsCategory = (
  years: number | null,
): ServiceYearsCategory | null => {
  if (years === null) {
    return null
  }
  if (years <= 2) return '0-2'
  if (years <= 5) return '3-5'
  if (years <= 10) return '6-10'
  if (years <= 20) return '11-20'
  return '20+'
}

export const average = (numbers: number[]): number => {
  if (numbers.length === 0) {
    return 0
  }
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length
}

export const toPercentage = (base: number, compared: number): number => {
  if (base <= 0) {
    return 0
  }
  return ((base - compared) / base) * 100
}

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

export const formatPercentage = (value: number): string =>
  `${new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`
