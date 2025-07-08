'use server'

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function salvarRegistro(formData: FormData) {
  const data = formData.get('data') as string
  const codigo = formData.get('codigo') as string
  const quantidade = parseInt(formData.get('quantidade') as string, 10)
  const descricao = formData.get('descricao') as string
  const observacao = formData.get('observacao') as string
  const estado = formData.get('estado') as string

  await prisma.registro.create({
    data: {
      data: new Date(data),
      codigo,
      quantidade,
      descricao,
      observacao,
      estado,
    },
  })

  revalidatePath('/')
}
