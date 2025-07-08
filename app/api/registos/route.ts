import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const registros = await prisma.registro.findMany({ orderBy: { id: 'desc' } })
  return NextResponse.json(registros)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })

  await prisma.registro.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
