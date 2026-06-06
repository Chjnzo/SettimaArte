import CortoCard from './CortoCard'
import type { EdizioneCorto } from '@/data/cortometraggio'

interface EdizioneCortometraggioProps {
  edizione: EdizioneCorto
}

export default function EdizioneCortometraggio({ edizione }: EdizioneCortometraggioProps) {
  return <CortoCard edizione={edizione} />
}
