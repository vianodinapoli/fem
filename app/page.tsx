import { prisma } from '../lib/prisma'
import RegistroList from './components/RegistroList'

export default async function Home() {
  const registrosFromDb = await prisma.registro.findMany({ orderBy: { id: 'desc' } })
  const registros = registrosFromDb.map(registro => ({
    ...registro,
    data: registro.data.toISOString(),
  }))

  return <RegistroList registros={registros} />
}
