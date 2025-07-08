'use client'

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

type Registro = {
  id: number
  data: string
  codigo: string
  quantidade: number
  descricao: string
  observacao: string
  estado: string
}

export default function ExportButtons({ registros }: { registros: Registro[] }) {
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      registros.map((r) => ({
        Data: new Date(r.data).toLocaleDateString(),
        Código: r.codigo,
        Quantidade: r.quantidade,
        Descrição: r.descricao,
        Observação: r.observacao,
        Estado: r.estado,
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros')

    XLSX.writeFile(workbook, 'registros.xlsx')
  }

  function exportToPDF() {
    const doc = new jsPDF()

    autoTable(doc, {
      head: [['Data', 'Código', 'Qtd', 'Descrição', 'Observação', 'Estado']],
      body: registros.map((r) => [
        new Date(r.data).toLocaleDateString(),
        r.codigo,
        r.quantidade,
        r.descricao,
        r.observacao,
        r.estado,
      ]),
    })

    doc.save('registros.pdf')
  }

  return (
    <div className="flex gap-4 my-4">
      <button
        onClick={exportToPDF}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Exportar PDF
      </button>
      <button
        onClick={exportToExcel}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Exportar Excel
      </button>
    </div>
  )
}
