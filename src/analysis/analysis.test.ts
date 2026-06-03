import { describe, expect, test } from 'vitest'
import {
  calculateFunctionGroupGaps,
  calculateOverallGap,
  calculateRiskEmployees,
  parseEmployeesFromCsv,
} from './index'

const csvFixture = `Volledige naam;Personeelsnummer;Nationaliteit;Geslacht;Geboortedatum;Dienstverband - In dienst;Historische datum in dienst;Ploeg uren per week;Afwijkend uren per week;Functie;Functiegroep;Afw. functiegroep;Afw. functie;Standaardfunctie;Afdeling;Basisloon;Basisloon eenheid;Salarisschaal;Salariscel
Nieuwste Vrouw;100;Nederlandse;Vrouw;01-01-1990;01-01-2024;;40,00;;Analist;A;;;Finance;Operations;1732,00;Periodeloon;7;A
Oude Vrouw;100;Nederlandse;Vrouw;01-01-1990;01-01-2020;;40,00;;Analist;A;;;Finance;Operations;800,00;Periodeloon;7;A
Man Een;101;Nederlandse;Man;01-01-1988;01-01-2022;;40,00;;Analist;A;;;Finance;Operations;30,00;Uurloon;7;A
Man Twee;102;Nederlandse;Man;01-01-1989;01-01-2022;;40,00;;Analist;A;;;Finance;Operations;30,00;Uurloon;7;A
Man Drie;103;Nederlandse;Man;01-01-1987;01-01-2022;;40,00;;Analist;A;;;Finance;Operations;30,00;Uurloon;7;A
Man Vier;104;Nederlandse;Man;01-01-1986;01-01-2022;;40,00;;Analist;A;;;Finance;Operations;30,00;Uurloon;7;A
Vrouw Twee;105;Nederlandse;Vrouw;01-01-1991;01-01-2022;;40,00;;Analist;A;;;Finance;Operations;30,00;Uurloon;7;A`

describe('analysis engine', () => {
  test('parses csv, keeps newest contract row and converts periodeloon to uurloon', () => {
    const employees = parseEmployeesFromCsv(csvFixture, new Date('2026-01-01'))

    expect(employees).toHaveLength(6)

    const latestEmployee = employees.find((employee) => employee.personnelNumber === '100')
    expect(latestEmployee?.hourlyWage).toBeCloseTo(10, 2)
    expect(latestEmployee?.standardFunction).toBe('Finance')
  })

  test('calculates overall and function group pay gap plus risk employees', () => {
    const employees = parseEmployeesFromCsv(csvFixture, new Date('2026-01-01'))

    const overall = calculateOverallGap(employees)
    expect(overall.gapPercentage).toBeGreaterThan(5)
    expect(overall.status).toBe('red')

    const groups = calculateFunctionGroupGaps(employees)
    expect(groups).toHaveLength(1)
    expect(groups[0].standardFunction).toBe('Finance')

    const risks = calculateRiskEmployees(employees)
    expect(risks.total).toBe(1)
    expect(risks.employees[0].personnelNumber).toBe('100')
    expect(risks.employees[0].standardFunction).toBe('Finance')
  })
})
