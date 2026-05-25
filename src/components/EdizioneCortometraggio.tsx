import CortoCard from './CortoCard'
import type { EdizioneCorto } from '@/data/cortometraggio'

interface EdizioneCortometraggioProps {
  edizione: EdizioneCorto
  index: number
}

export default function EdizioneCortometraggio({ edizione, index }: EdizioneCortometraggioProps) {
  return <CortoCard edizione={edizione} index={index} />
}
