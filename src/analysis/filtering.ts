import type { Employee, Filters } from '../types'

export const createEmptyFilters = (): Filters => ({
  employer: [],
  location: [],
  cao: [],
  standardFunction: [],
  salaryScale: [],
  ageCategory: [],
  serviceYearsCategory: [],
})

const matchesSelection = (value: string | null, selected: string[]): boolean =>
  selected.length === 0 || (value !== null && selected.includes(value))

export const applyFilters = (employees: Employee[], filters: Filters): Employee[] =>
  employees.filter((employee) => {
    return (
      matchesSelection(employee.employer, filters.employer) &&
      matchesSelection(employee.location, filters.location) &&
      matchesSelection(employee.cao, filters.cao) &&
      matchesSelection(employee.standardFunction, filters.standardFunction) &&
      matchesSelection(employee.salaryScale, filters.salaryScale) &&
      matchesSelection(employee.ageCategory, filters.ageCategory) &&
      matchesSelection(employee.serviceYearsCategory, filters.serviceYearsCategory)
    )
  })

export const collectFilterOptions = (employees: Employee[]) => {
  const uniqueSorted = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b))

  return {
    employer: uniqueSorted(employees.map((employee) => employee.employer)),
    location: uniqueSorted(employees.map((employee) => employee.location)),
    cao: uniqueSorted(employees.map((employee) => employee.cao)),
    standardFunction: uniqueSorted(employees.map((employee) => employee.standardFunction)),
    salaryScale: uniqueSorted(employees.map((employee) => employee.salaryScale)),
  }
}
