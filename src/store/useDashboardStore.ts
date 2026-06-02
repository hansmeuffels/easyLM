import { create } from 'zustand'
import type { Employee, Filters } from '../types'
import { createEmptyFilters } from '../analysis'

interface DashboardState {
  employees: Employee[]
  filters: Filters
  sourceFileName: string
  setEmployees: (employees: Employee[], sourceFileName: string) => void
  setFilters: (filters: Filters) => void
  resetFilters: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  employees: [],
  filters: createEmptyFilters(),
  sourceFileName: '',
  setEmployees: (employees, sourceFileName) =>
    set({ employees, sourceFileName, filters: createEmptyFilters() }),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: createEmptyFilters() }),
}))
