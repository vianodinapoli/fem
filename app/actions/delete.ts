'use server'

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function excluirRegistro(formData: FormData) {
  const id = formData.get('id')
  if (!id) throw new Error('ID não fornecido')

  const idNumber = Number(id)
  if (isNaN(idNumber)) throw new Error('ID inválido')

  await prisma.registro.delete({ where: { id: idNumber } })
  revalidatePath('/')
}
