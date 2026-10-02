// Turn rows into CSV text. `columns` is a list of { label, value(row) }.
function escapeCell(value) {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(rows, columns) {
  const header = columns.map((c) => escapeCell(c.label)).join(',')
  const lines = rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(','))
  return [header, ...lines].join('\r\n')
}

// Starts a browser download. Returns true on success, false if something went wrong.
export function downloadCsv(filename, csvText) {
  try {
    const blob = new Blob(['\uFEFF' + csvText], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('CSV export failed', error)
    return false
  }
}
