import { parseEmployeesFromCsv } from '../analysis'

interface UploadPanelProps {
  onEmployeesLoaded: (csv: string, sourceFileName: string) => void
  onError: (message: string) => void
}

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Kon het CSV-bestand niet lezen.'))
    reader.readAsText(file)
  })

export const UploadPanel = ({ onEmployeesLoaded, onError }: UploadPanelProps) => {
  const handleContent = (content: string, sourceFileName: string) => {
    try {
      parseEmployeesFromCsv(content)
      onEmployeesLoaded(content, sourceFileName)
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : 'CSV kon niet worden verwerkt. Controleer het formaat.',
      )
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const content = await readFile(file)
      handleContent(content, file.name)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Onbekende fout bij upload.')
    }
  }

  const handleSampleLoad = async () => {
    try {
      const response = await fetch('/sample-data/voorbeeld-medewerkers.csv')
      if (!response.ok) {
        throw new Error('Voorbeelddata kon niet worden geladen.')
      }
      const csv = await response.text()
      handleContent(csv, 'voorbeeld-medewerkers.csv')
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Onbekende fout bij voorbeelddata.')
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">CSV upload</h2>
      <p className="mt-2 text-sm text-slate-600">
        Upload een puntkomma-gescheiden CSV met Nederlandse getalnotatie.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          Selecteer CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <button
          type="button"
          onClick={handleSampleLoad}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Gebruik voorbeelddata
        </button>
      </div>
    </section>
  )
}
