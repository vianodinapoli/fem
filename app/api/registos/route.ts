// app/api/registos/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma' // ajuste o caminho se estiver diferente

export async function GET() {
  try {
    const registos = await prisma.registro.findMany({
      orderBy: { id: 'desc' },
    })
    return NextResponse.json(registos)
  } catch (error) {
    console.error('Erro ao buscar registos:', error)
    return NextResponse.json({ message: 'Erro ao buscar registos' }, { status: 500 })
  }
}