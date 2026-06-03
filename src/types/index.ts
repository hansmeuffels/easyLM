export type Gender = 'Man' | 'Vrouw' | 'Onbekend'

export type AgeCategory = '<25' | '25-34' | '35-44' | '45-54' | '55+'
export type ServiceYearsCategory = '0-2' | '3-5' | '6-10' | '11-20' | '20+'

export interface Employee {
  fullName: string
  personnelNumber: string
  nationality: string
  gender: Gender
  dateOfBirth: Date | null
  startDate: Date | null
  jobTitle: string
  standardFunction: string
  department: string
  employer: string
  location: string
  cao: string
  salaryScale: string
  salaryCell: string
  baseSalary: number
  baseSalaryUnit: 'Periodeloon' | 'Uurloon'
  hoursPerWeek: number
  hourlyWage: number
  monthlySalary: number
  age: number | null
  yearsOfService: number | null
  ageCategory: AgeCategory | null
  serviceYearsCategory: ServiceYearsCategory | null
  isOutlier: boolean
}

export interface Filters {
  employer: string[]
  location: string[]
  cao: string[]
  standardFunction: string[]
  salaryScale: string[]
  ageCategory: AgeCategory[]
  serviceYearsCategory: ServiceYearsCategory[]
}

export interface OverallGapResult {
  maleAverageHourlyWage: number
  femaleAverageHourlyWage: number
  gapPercentage: number
  status: 'green' | 'orange' | 'red'
}

export interface StandardFunctionGap {
  standardFunction: string
  employees: number
  maleAverageHourlyWage: number
  femaleAverageHourlyWage: number
  gapPercentage: number
}

export interface RiskEmployee {
  fullName: string
  personnelNumber: string
  standardFunction: string
  employer: string
  hourlyWage: number
  gapToOtherGenderPercentage: number
}

export interface RiskResult {
  total: number
  byEmployer: Record<string, number>
  byStandardFunction: Record<string, number>
  employees: RiskEmployee[]
}

export interface CategoryPayGap {
  category: string
  maleAverageHourlyWage: number
  femaleAverageHourlyWage: number
  gapPercentage: number
}
