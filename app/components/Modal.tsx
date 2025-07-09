'use client'

import { useEffect, useRef } from 'react'

export default function Modal({
  titulo,
  descricao,
  onConfirm,
  onCancel,
}: {
  titulo: string
  descricao: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // ESC para fechar
  useEffect(() => {
    const escListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }

      if (e.key === 'Enter') {
        onConfirm()
      }
    }

    document.addEventListener('keydown', escListener)
    return () => document.removeEventListener('keydown', escListener)
  }, [onCancel, onConfirm])

  // Clicar fora do modal fecha
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === dialogRef.current) {
      onCancel()
    }
  }

  return (
    <div
      ref={dialogRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full space-y-4 transition-transform scale-100">
        <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
        <p className="text-gray-600">{descricao}</p>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}