import GameClientWrapper from './GameClientWrapper'
import { v4 as uuidv4 } from 'uuid'
export default async function AsykAtuPage() {
  const sessionId = uuidv4()

  return <GameClientWrapper sessionId={sessionId} />
}
