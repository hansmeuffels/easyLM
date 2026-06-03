import type { AgeCategory, Filters, ServiceYearsCategory } from '../types'

interface FilterBarProps {
  filters: Filters
  options: {
    employer: string[]
    location: string[]
    cao: string[]
    standardFunction: string[]
    salaryScale: string[]
  }
  onChange: (filters: Filters) => void
  onReset: () => void
}

const AGE_OPTIONS: AgeCategory[] = ['<25', '25-34', '35-44', '45-54', '55+']
const SERVICE_OPTIONS: ServiceYearsCategory[] = ['0-2', '3-5', '6-10', '11-20', '20+']

const toValues = (select: HTMLSelectElement): string[] =>
  [...select.selectedOptions].map((option) => option.value)

const MultiSelect = ({
  label,
  values,
  options,
  onChange,
}: {
  label: string
  values: string[]
  options: string[]
  onChange: (value: string[]) => void
}) => (
  <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
    {label}
    <select
      multiple
      value={values}
      onChange={(event) => onChange(toValues(event.target))}
      className="h-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
)

export const FilterBar = ({ filters, options, onChange, onReset }: FilterBarProps) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900">Dashboardfilters</h3>
      <button
        type="button"
        onClick={onReset}
        className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
      >
        Reset filters
      </button>
    </div>

    <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
      <MultiSelect
        label="Werkgever"
        values={filters.employer}
        options={options.employer}
        onChange={(employer) => onChange({ ...filters, employer })}
      />
      <MultiSelect
        label="Vestiging"
        values={filters.location}
        options={options.location}
        onChange={(location) => onChange({ ...filters, location })}
      />
      <MultiSelect
        label="Cao"
        values={filters.cao}
        options={options.cao}
        onChange={(cao) => onChange({ ...filters, cao })}
      />
      <MultiSelect
        label="Standaardfunctie"
        values={filters.standardFunction}
        options={options.standardFunction}
        onChange={(standardFunction) => onChange({ ...filters, standardFunction })}
      />
      <MultiSelect
        label="Salarisschaal"
        values={filters.salaryScale}
        options={options.salaryScale}
        onChange={(salaryScale) => onChange({ ...filters, salaryScale })}
      />
      <MultiSelect
        label="Leeftijd"
        values={filters.ageCategory}
        options={AGE_OPTIONS}
        onChange={(ageCategory) => onChange({ ...filters, ageCategory: ageCategory as AgeCategory[] })}
      />
      <MultiSelect
        label="Dienstjaren"
        values={filters.serviceYearsCategory}
        options={SERVICE_OPTIONS}
        onChange={(serviceYearsCategory) =>
          onChange({
            ...filters,
            serviceYearsCategory: serviceYearsCategory as ServiceYearsCategory[],
          })
        }
      />
    </div>
  </section>
)
