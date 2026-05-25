import type { GalleryItem } from '@/components/Gallery'
import { galleryCortoBackstage, galleryCortoLocandine } from '@/data/images'

export interface EdizioneCorto {
  anno: string
  titolo: string
  regia: string
  attori: string[]
  descrizione?: string
  trama: string
  trailerSrc?: string
  premi?: string[]
  locandina?: string
  backstagePhotos: GalleryItem[]
}

export const cortoBackstageStudenti: GalleryItem[] = galleryCortoBackstage

export const cortoCitazioneBg =
  '/images/Cortometraggio/Gallery locandine, foto premi ecc/troupe-cinematografica-set-cortometraggio.jpg'

export const edizioniData: EdizioneCorto[] = [
  {
    anno: '2024',
    titolo: 'Le Faremo Sapere',
    regia: 'Beppe Tufarulo',
    attori: ['Giorgio Marchesi', 'Antonia Fotaras'],
    descrizione:
      "La prima edizione di questo percorso ha dato vita al cortometraggio Le Faremo Sapere, diretto da Beppe Tufarulo e interpretato da Giorgio Marchesi e Antonia Fotaras. Il progetto ha ottenuto importanti riconoscimenti nel circuito festivaliero, tra cui due premi al Cortinametraggio, i premi per Miglior Sceneggiatura e Miglior Attore Protagonista al E Fu Cinema Festival di Pomarance, il Premio Troisi Videocorto Nettuno e due riconoscimenti come Miglior Attore e Miglior Attrice al Movievalley Festival Bologna. Il cortometraggio è inoltre entrato nella shortlist dei David di Donatello e successivamente selezionato tra i finalisti dei Nastri d'Argento.",
    trama:
      'Un giovane aspirante attore si presenta a quello che crede sia un normale colloquio di lavoro. Ben presto scopre che la stanza, i selezionatori e persino le domande sono qualcosa di molto diverso da ciò che si aspettava: quello che sembrava un colloquio è in realtà uno screen test.',
    trailerSrc: 'jAWTBDdikig',
    premi: [
      'Due premi — Cortinametraggio',
      'Miglior Sceneggiatura + Miglior Attore Protagonista — E Fu Cinema Festival, Pomarance',
      'Premio Troisi — Videocorto Nettuno',
      'Miglior Attore + Miglior Attrice — Movievalley Festival, Bologna',
      'Shortlist David di Donatello',
      "Shortlist Nastri d'Argento",
    ],
    locandina:
      '/images/Cortometraggio/Gallery locandine, foto premi ecc/Locandina-Le-Faremo-Sapere.jpg',
    backstagePhotos: galleryCortoLocandine,
  },
  {
    anno: '2025',
    titolo: 'Sono Sempre Qui Per Te',
    regia: 'Marco Pacchiana',
    attori: ['Jacopo Olmo Antinori', 'Walter Tiraboschi', 'Giulia Gonella'],
    descrizione:
      'La seconda edizione ha portato alla realizzazione di Sono sempre qui per te, diretto da Marco Pacchiana e interpretato da Jacopo Olmo Antinori, Walter Tiraboschi e Giulia Gonella. Il cortometraggio è attualmente in distribuzione nei principali festival nazionali e sarà disponibile alla visione al termine del suo percorso nel circuito festivaliero.',
    trama:
      "Manuel è un copywriter di 25 anni che lavora in una piccola agenzia pubblicitaria. Quando arriva una consegna importante e i colleghi iniziano ad affidarsi all'AI per accelerare il lavoro, Manuel si ritrova a interrogarsi sul valore del merito, della creatività e della sua stessa presenza in quell'ufficio.",
    trailerSrc: '',
    locandina: '',
    backstagePhotos: [],
  },
]
