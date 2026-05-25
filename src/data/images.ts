import type { GalleryItem } from '@/components/Gallery'

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface HeroSlide {
  type: 'image' | 'video'
  src: string
  alt?: string
  videoId?: string
  platform?: 'youtube' | 'vimeo'
}

export interface CortoEdizione {
  titolo: string
  locandina: string
  videoYT: string
  premi?: string[]
}

export interface EdizioneFSL {
  label: string
  corti: CortoEdizione[]
}

// ─── HOME ────────────────────────────────────────────────────────────────────

export const heroHomeSlides: HeroSlide[] = [
  {
    type: 'image',
    src: '/images/Home/Hero/esultanza-ragazzi-premio-oscar.jpg',
    alt: 'Ragazzi in esultanza alla premiazione',
  },
  {
    type: 'image',
    src: '/images/Home/Hero/ragazzo-ciack-camera-set-riprese.jpg',
    alt: 'Ragazzo con ciack su set di riprese',
  },
  {
    type: 'image',
    src: '/images/Home/Hero/studentessa-take-fsl.JPG',
    alt: 'Studentessa durante il take FSL',
  },
]

export const homeSezioniImages = {
  fsl: {
    src: '/images/Home/Sezione "Formazione Scuola-Lavoro attraverso il cinema"/ragazza-FSL-camera.jpg',
    alt: 'Ragazza con camera durante il percorso FSL',
  },
  festival: {
    src: '/images/Home/Sezione "I corti degli studenti sul grande schermo"/ragazzo-giuria-premio.webp',
    alt: 'Ragazzo premiato dalla giuria al Festival',
  },
  cortometraggio: {
    src: "/images/Home/Sezione \"Un set vero, una troupe vera, un'esperienza unica\"/camera-ripresa-scena-ragazzo-attore.jpg",
    alt: 'Camera da ripresa su set con ragazzo attore',
  },
}

// ─── FSL ─────────────────────────────────────────────────────────────────────

export const heroFSLImage: HeroSlide = {
  type: 'image',
  src: '/images/FSL/Hero/ragazzi-riprese-fsl.JPG',
  alt: 'Ragazzi durante le riprese FSL',
}

const _fslBkg = '/images/FSL/Galley "Backstage dalle edizioni"'

export const galleryFSLBackstage: GalleryItem[] = [
  { type: 'image', src: `${_fslBkg}/_MG_5380.JPG`, alt: 'Backstage FSL sul set' },
  { type: 'image', src: `${_fslBkg}/camera-ciak-fsl.jpg`, alt: 'Camera e ciack durante FSL' },
  { type: 'image', src: `${_fslBkg}/computer-montaggio-video.JPG`, alt: 'Computer per montaggio video' },
  { type: 'image', src: `${_fslBkg}/gruppo-ragazzi-fsl-lavoro-cortometraggio.JPG`, alt: 'Gruppo ragazzi FSL al lavoro sul cortometraggio' },
  { type: 'image', src: `${_fslBkg}/gruppo-ragazzi-guardano-ripresa.jpg`, alt: 'Gruppo ragazzi che guardano la ripresa' },
  { type: 'image', src: `${_fslBkg}/ragazza-videomaker-camera-ripresa.JPG`, alt: 'Ragazza videomaker con camera da ripresa' },
  { type: 'image', src: `${_fslBkg}/ragazze-ciack-camera.JPG`, alt: 'Ragazze con ciack e camera' },
  { type: 'image', src: `${_fslBkg}/ragazze-guardano-ripresa-camera.JPG`, alt: 'Ragazze guardano ripresa con camera' },
  { type: 'image', src: `${_fslBkg}/ragazze-inquadratura-scena-camera.JPG`, alt: 'Ragazze inquadrano scena con camera' },
  { type: 'image', src: `${_fslBkg}/ragazzi-camera-cartelletta-cuffie.JPG`, alt: 'Ragazzi con camera, cartelletta e cuffie' },
  { type: 'image', src: `${_fslBkg}/ragazzi-fsl-scale-riprese.JPG`, alt: 'Ragazzi FSL sulle scale durante riprese' },
  { type: 'image', src: `${_fslBkg}/ragazzi-soggetto-cortometraggio.JPG`, alt: 'Ragazzi discutono soggetto cortometraggio' },
  { type: 'image', src: `${_fslBkg}/ragazzi-sorridenti-cinema.JPG`, alt: 'Ragazzi sorridenti in cinema' },
  { type: 'image', src: `${_fslBkg}/ragazzi-sorridenti-guardano-schermo-cinema.jpg`, alt: 'Ragazzi sorridenti guardano schermo cinema' },
  { type: 'image', src: `${_fslBkg}/ragazzo-attore-ciack-scena.jpg`, alt: 'Ragazzo attore con ciack in scena' },
  { type: 'image', src: `${_fslBkg}/ragazzo-camera-stativo-ripresa.JPG`, alt: 'Ragazzo con camera su stativo per ripresa' },
  { type: 'image', src: `${_fslBkg}/sala-cinema-ragazzi-evento.JPG`, alt: "Sala cinema con ragazzi all'evento" },
  // Video backstage
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage ragazzi FSL evento dicembre 2024',
    videoId: 'SipgyXv5_5g',
    platform: 'youtube',
  },
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage ragazzi FSL evento giugno 2024',
    videoId: '', // TODO: aggiungere quando caricato su YouTube
    platform: 'youtube',
  },
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage ragazzi FSL evento maggio 2023',
    videoId: '', // TODO: aggiungere quando caricato su YouTube
    platform: 'youtube',
  },
  {
    type: 'video',
    src: '/images/placeholder-video.jpg',
    alt: 'Backstage ragazzi FSL evento maggio 2025',
    videoId: '', // TODO: aggiungere quando caricato su YouTube
    platform: 'youtube',
  },
]

const _loc2223 = '/images/FSL/Locandine 7arte 2022-2023'
const _loc2324 = '/images/FSL/Locandine 7arte 2023-2024'
const _loc2425 = '/images/FSL/Locandine 7arte 2024-2025'
const _loc2526 = '/images/FSL/Locandine 7arte 2025-2026'

export const locandinePerEdizione: Record<string, EdizioneFSL[]> = {
  '2022-2023': [
    {
      label: 'Edizione invernale',
      corti: [
        { titolo: 'K.onnessi', locandina: `${_loc2223}/K.Onnessi.png`, videoYT: 'https://youtu.be/6uP9XWQHc98?si=jHzFSY7CtO8E_oQb' },
        { titolo: 'La fragranza del contagio', locandina: `${_loc2223}/La fragranza del contagio.jpg`, videoYT: 'https://youtu.be/oqKOwFEWKsA?si=29Z0WB0vjZYVWQz_', premi: ['miglior cortometraggio'] },
        { titolo: "L'ombrello dal bozzetto al successo", locandina: `${_loc2223}/L_ombrello.png`, videoYT: 'https://youtu.be/5wsiU4JCcew?si=-kmHj4ysOWqux47t', premi: ['premio giuria'] },
        { titolo: 'The last lamp', locandina: `${_loc2223}/The Last Lamp.jpg`, videoYT: 'https://youtu.be/keEZZwR-3BE' },
        { titolo: 'Move on from straws', locandina: `${_loc2223}/Move On From Straws.png`, videoYT: 'https://youtu.be/VyGf2b3G_Qo' },
        { titolo: 'Intrappolata in una borsa', locandina: `${_loc2223}/Intrappolata In Una Borsa.png`, videoYT: 'https://youtu.be/jkXsvrAqAmM' },
      ],
    },
    {
      label: 'Edizione estiva',
      corti: [
        { titolo: 'Scambio di cuffie', locandina: `${_loc2223}/Scambio di cuffie.png`, videoYT: 'https://youtu.be/cpRnNei-MBc' },
        { titolo: 'La cornice', locandina: `${_loc2223}/La cornice.jpg`, videoYT: 'https://youtu.be/UR4fulcIkPo', premi: ['miglior cortometraggio', 'miglior locandina', 'premio giuria'] },
        { titolo: 'Leggere tra le righe', locandina: `${_loc2223}/Leggere tra le righe.jpg`, videoYT: 'https://youtu.be/bs4xJJiiC_8' },
        { titolo: 'Trouble making/smoking', locandina: `${_loc2223}/Trouble making_smoking .png`, videoYT: 'https://youtu.be/ZsqmnE2NkD8' },
        { titolo: 'La musica unisce', locandina: `${_loc2223}/La musica unisce.jpg`, videoYT: 'https://youtu.be/nWhMYIA5-oI' },
        { titolo: 'Uno scatto nel caffè', locandina: `${_loc2223}/Uno scatto nel caffè.png`, videoYT: 'https://youtu.be/K0IaCGi30Fc' },
      ],
    },
  ],
  '2023-2024': [
    {
      label: 'Edizione invernale',
      corti: [
        { titolo: 'Shop runner', locandina: `${_loc2324}/Shop runner.png`, videoYT: 'https://youtu.be/7VuFjJOR8Fw' },
        { titolo: 'Lo stand di Amelie', locandina: `${_loc2324}/Lo stand di Amelie.jpg`, videoYT: 'https://youtu.be/4szoirbSHgY' },
        { titolo: 'Like a boss', locandina: `${_loc2324}/Like a boss.jpg`, videoYT: 'https://youtu.be/ELDsoEqh-78', premi: ['miglior cortometraggio'] },
        { titolo: 'Amore a prima vetrina', locandina: `${_loc2324}/Amore a prima vetrina.jpg`, videoYT: 'https://youtu.be/QhYrJxRzyjI' },
        { titolo: 'La via della diversità', locandina: `${_loc2324}/La via della diversità.jpg`, videoYT: 'https://youtu.be/N-8KB8ENnwM', premi: ['premio giuria', 'miglior locandina'] },
        { titolo: 'Le faremo sapere', locandina: `${_loc2324}/Le faremo sapere.png`, videoYT: 'https://youtu.be/flf5mJy5gGc' },
      ],
    },
    {
      label: 'Edizione estiva',
      corti: [
        { titolo: 'La gavetta', locandina: `${_loc2324}/La gavetta.png`, videoYT: 'https://youtu.be/CeTrMja-BkA' },
        { titolo: '...quella giusta', locandina: '', videoYT: 'https://youtu.be/0eDSev_U4-c' },
        { titolo: 'CVuole coscienza', locandina: `${_loc2324}/CVuole coscienza.jpg`, videoYT: 'https://youtu.be/JxjLLSWxvFA', premi: ['premio giuria'] },
        { titolo: 'Il giusto compromesso', locandina: `${_loc2324}/Il giusto compromesso.jpg`, videoYT: 'https://youtu.be/4buprTNcjuU' },
        { titolo: 'Gli uomini sono tutti buoni', locandina: `${_loc2324}/Gli uomini sono tutti buoni.jpg`, videoYT: 'https://youtu.be/KTKDAHK5A5M', premi: ['miglior cortometraggio'] },
        { titolo: 'Next Gen', locandina: `${_loc2324}/Next Gen.jpg`, videoYT: 'https://youtu.be/mKKyO6T_ZVc', premi: ['miglior locandina'] },
      ],
    },
  ],
  '2024-2025': [
    {
      label: 'Edizione invernale',
      corti: [
        { titolo: 'Infopoint Intelligenza Artificiale', locandina: `${_loc2425}/Infopoint Intelligenza Artificiale.png`, videoYT: 'https://youtu.be/vjNGVNyG5oA' },
        { titolo: 'Generazioni connesse', locandina: `${_loc2425}/Generazioni Connesse.png`, videoYT: 'https://youtu.be/oBHzf_-v5Yc' },
        { titolo: 'dIAlogo umano?', locandina: `${_loc2425}/d-IA-logo umano_.jpg`, videoYT: 'https://youtu.be/mCAAeCuLZy4', premi: ['miglior locandina', 'miglior cortometraggio'] },
        { titolo: 'Il manichino', locandina: `${_loc2425}/Il manichino.png`, videoYT: 'https://youtu.be/xC0Dq84ukTQ' },
        { titolo: 'S.O.F.IA', locandina: `${_loc2425}/S.O.F.IA.png`, videoYT: 'https://youtu.be/3H69mHvg-kM', premi: ['premio giuria'] },
      ],
    },
    {
      label: 'Edizione estiva',
      corti: [
        { titolo: 'AIChef', locandina: `${_loc2425}/AIChef.jpg`, videoYT: 'https://youtu.be/uMZmK5fJdPw', premi: ['miglior cortometraggio'] },
        { titolo: 'Cupid-IA', locandina: `${_loc2425}/CupidIA.jpg`, videoYT: 'https://youtu.be/SIyrSg3RZeM', premi: ['miglior locandina', 'premio giuria'] },
        { titolo: 'FreestAIle battle', locandina: `${_loc2425}/FreestAlle Battle.png`, videoYT: 'https://youtu.be/Zl1EDyVhFQQ' },
        { titolo: 'Io LibrAIo', locandina: `${_loc2425}/Io, LibrAIo.jpg`, videoYT: 'https://youtu.be/GaoPCuNgMDI' },
        { titolo: 'Buddy, le CopAIn parfAIt', locandina: `${_loc2425}/Buddy, Le CopAIn parfAlt.jpg`, videoYT: 'https://youtu.be/vgnQ4bvJfHU' },
      ],
    },
  ],
  '2025-2026': [
    {
      label: 'Edizione invernale',
      corti: [
        { titolo: 'AbbraccIAmi', locandina: `${_loc2526}/Locandina finale ABBRACCIAMI (MB).png`, videoYT: 'https://youtu.be/CIbibleww5w', premi: ['premio giuria'] },
        { titolo: 'AI need you', locandina: `${_loc2526}/Locandina finale AI NEED YOU(BG).jpg`, videoYT: 'https://youtu.be/o35bqFcoz7w', premi: ['miglior cortometraggio'] },
        { titolo: 'Come posso AIutarti', locandina: `${_loc2526}/Locandina finale COME POSSO AIUTARTI_ (CO).jpg`, videoYT: 'https://youtu.be/EHShFCS80c0', premi: ['miglior locandina'] },
        { titolo: 'Liberi di sbagliare', locandina: `${_loc2526}/Locandina finale LIBERI DI SBAGLIARE (BS).png`, videoYT: 'https://youtu.be/teWtrtWkD7M' },
        { titolo: 'Quando si ferma il tempo', locandina: `${_loc2526}/Locandina finale QUANDO IL TEMPO SI FERMA (LC).png`, videoYT: 'https://youtu.be/U4u3ySZJcSM' },
      ],
    },
  ],
}

// ─── FESTIVAL ────────────────────────────────────────────────────────────────

export const heroFestivalImage: HeroSlide = {
  type: 'image',
  src: '/images/Festival/Hero/selfie-evento-ragazzi-felici.jpg',
  alt: "Selfie di gruppo ragazzi felici all'evento Festival",
}

const _festBkg = '/images/Festival/Gallery Le serate del Festival'

export const galleryFestival: GalleryItem[] = [
  { type: 'image', src: `${_festBkg}/abbraccio-premio-oscar.jpg`, alt: 'Abbraccio alla premiazione degli Oscar del festival' },
  { type: 'image', src: `${_festBkg}/accoglienza-genitori-evento-scuole.jpg`, alt: "Accoglienza genitori all'evento scolastico" },
  { type: 'image', src: `${_festBkg}/accoglienza-studenti-evento-scuole.jpg`, alt: "Accoglienza studenti all'evento scolastico" },
  { type: 'image', src: `${_festBkg}/classe-oscar-premio.jpg`, alt: 'Classe ritira il premio Oscar del festival' },
  { type: 'image', src: `${_festBkg}/DSC08788.jpg`, alt: "Momento dell'evento Festival SettimaArte" },
  { type: 'image', src: `${_festBkg}/foto-gruppo-classe-oscar.jpg`, alt: 'Foto di gruppo della classe con premio Oscar' },
  { type: 'image', src: `${_festBkg}/oscar-riconoscimento-evento.jpg`, alt: "Riconoscimento Oscar all'evento festival" },
  { type: 'image', src: `${_festBkg}/oscar-riconoscimento-premio-corto.jpg`, alt: 'Oscar come riconoscimento per il miglior cortometraggio' },
  { type: 'image', src: `${_festBkg}/ospiti-cinema-evento.jpg`, alt: "Ospiti al cinema durante l'evento festival" },
  { type: 'image', src: `${_festBkg}/persone-cinema-guardano-schermo.jpg`, alt: 'Persone in cinema guardano lo schermo' },
  { type: 'image', src: `${_festBkg}/platea-ragazzi-cinema.jpg`, alt: 'Platea di ragazzi in cinema' },
  { type: 'image', src: `${_festBkg}/premio-oscar-nomina-vincitore.jpg`, alt: 'Nomina del vincitore al premio Oscar festival' },
  { type: 'image', src: `${_festBkg}/presentatore-comici-risate.jpg`, alt: 'Presentatore comico che fa ridere il pubblico' },
  { type: 'image', src: `${_festBkg}/presentatrice-intervento-microfono.JPG`, alt: 'Presentatrice interviene al microfono' },
  { type: 'image', src: `${_festBkg}/ragazza-microfono-espone-progetto.jpg`, alt: 'Ragazza espone il progetto al microfono' },
  { type: 'image', src: `${_festBkg}/ragazza-sorridente-microfono.jpg`, alt: 'Ragazza sorridente al microfono' },
  { type: 'image', src: `${_festBkg}/ragazze-indicano-schermo-cinema.jpg`, alt: 'Ragazze indicano lo schermo del cinema' },
  { type: 'image', src: `${_festBkg}/ragazzi-applaudono-platea-cinema.jpg`, alt: 'Ragazzi applaudono dalla platea del cinema' },
  { type: 'image', src: `${_festBkg}/ragazzi-consegna-premio-oscar.jpg`, alt: 'Consegna del premio Oscar ai ragazzi' },
  { type: 'image', src: `${_festBkg}/ragazzi-gioco-collaborazione.jpg`, alt: 'Ragazzi in gioco di collaborazione' },
  { type: 'image', src: `${_festBkg}/ragazzi-guardano-schermo-cinema.jpg`, alt: 'Ragazzi guardano lo schermo del cinema' },
  { type: 'image', src: `${_festBkg}/ragazzi-sorridenti-gioco-cinema.jpg`, alt: 'Ragazzi sorridenti durante gioco in cinema' },
  { type: 'image', src: `${_festBkg}/ragazzo-microfono-guarda-schermo.jpg`, alt: 'Ragazzo al microfono guarda lo schermo' },
  { type: 'image', src: `${_festBkg}/ragazzo-parla-platea.jpg`, alt: 'Ragazzo parla alla platea' },
  { type: 'image', src: `${_festBkg}/ragazzo-parla-pubblico.jpg`, alt: 'Ragazzo parla al pubblico' },
  { type: 'image', src: `${_festBkg}/ragazzo-riconoscimento-premio-oscar.jpg`, alt: 'Ragazzo riceve riconoscimento premio Oscar' },
  { type: 'image', src: `${_festBkg}/selfie-gruppo-sala-cinema.jpg`, alt: 'Selfie di gruppo nella sala cinema' },
]

// ─── CORTOMETRAGGIO ──────────────────────────────────────────────────────────

const _cortoStudenti = '/images/Cortometraggio/Gallery backstage foto studenti'

export const galleryCortoBackstage: GalleryItem[] = [
  { type: 'image', src: `${_cortoStudenti}/camera-ragazzo-educatrici-interviste.jpg`, alt: 'Camera, ragazzo e educatrici durante le interviste' },
  { type: 'image', src: `${_cortoStudenti}/ragazza-vestiti-cortometraggio-costumista.jpg`, alt: 'Ragazza con costumista per il cortometraggio' },
  { type: 'image', src: `${_cortoStudenti}/ragazzi-confronto-set-scena.jpg`, alt: 'Ragazzi a confronto sul set tra una scena e l\'altra' },
  { type: 'image', src: `${_cortoStudenti}/ragazzi-guardano-scena-set.jpg`, alt: 'Ragazzi guardano la scena sul set' },
  { type: 'image', src: `${_cortoStudenti}/ragazzi-monitor-scena-cortometraggio.jpg`, alt: 'Ragazzi al monitor durante la scena del cortometraggio' },
  { type: 'image', src: `${_cortoStudenti}/ragazzo-attore-scena.jpg`, alt: 'Ragazzo in scena come attore' },
  { type: 'image', src: `${_cortoStudenti}/ragazzo-cortometraggio-set.jpg`, alt: 'Ragazzo sul set del cortometraggio' },
  { type: 'image', src: `${_cortoStudenti}/ragazzo-stabilizzatore-ripresa-set.jpg`, alt: 'Ragazzo con stabilizzatore durante ripresa sul set' },
  { type: 'image', src: `${_cortoStudenti}/studenti-lavoro-corto.JPG`, alt: 'Studenti al lavoro sul cortometraggio' },
]

const _cortoLoc = '/images/Cortometraggio/Gallery locandine, foto premi ecc'

export const galleryCortoLocandine: GalleryItem[] = [
  { type: 'image', src: `${_cortoLoc}/attore-regista-sorrisi-set.jpg`, alt: 'Attore e regista sorridenti sul set' },
  { type: 'image', src: `${_cortoLoc}/attore-scena-colloquio-fogli.jpg`, alt: 'Attore in scena durante il colloquio con i fogli' },
  { type: 'image', src: `${_cortoLoc}/attrice-sorriso-set.jpg`, alt: 'Attrice sorridente sul set' },
  { type: 'image', src: `${_cortoLoc}/attrice-truccatrice-pennello-scena.jpg`, alt: 'Attrice con truccatrice e pennello prima della scena' },
  { type: 'image', src: `${_cortoLoc}/camera-ripresa-troupe-set.jpg`, alt: 'Camera da ripresa con la troupe sul set' },
  { type: 'image', src: `${_cortoLoc}/intervista-attore-ragazzo.jpg`, alt: 'Intervista all\'attore con uno studente' },
  { type: 'image', src: `${_cortoLoc}/Locandina-Le-Faremo-Sapere.jpg`, alt: 'Locandina ufficiale del cortometraggio Le Faremo Sapere' },
  { type: 'image', src: `${_cortoLoc}/monitor-scena-tavolo-ufficio.jpg`, alt: 'Monitor che mostra la scena del tavolo da ufficio' },
  { type: 'image', src: `${_cortoLoc}/premio-Anpit-Cortinametraggio-palco-ragazzi.jpg`, alt: 'Ragazzi sul palco con premio ANPIT al Cortinametraggio' },
  { type: 'image', src: `${_cortoLoc}/premio-Groenlandia-Cortinametraggio.jpg`, alt: 'Premio Groenlandia al Cortinametraggio' },
  { type: 'image', src: `${_cortoLoc}/premio-miglior-attore-actrice-movievalleyfest.JPG`, alt: 'Premio miglior attore e attrice al Movievalley Festival' },
  { type: 'image', src: `${_cortoLoc}/premio-miglior-attore-e-fu-cinema.jpg`, alt: 'Premio miglior attore al E Fu Cinema Festival' },
  { type: 'image', src: `${_cortoLoc}/premio-miglior-sceneggiatura-e-fu-cinema.jpg`, alt: 'Premio miglior sceneggiatura al E Fu Cinema Festival' },
  { type: 'image', src: `${_cortoLoc}/premio-nasti-argento-regista.jpg`, alt: "Premio Nastri d'Argento con il regista" },
  { type: 'image', src: `${_cortoLoc}/ragazza-premio-Anpit-Cortinametraggio.jpg`, alt: 'Ragazza con premio ANPIT al Cortinametraggio' },
  { type: 'image', src: `${_cortoLoc}/regista-attore-indicazioni-scena.jpg`, alt: 'Regista dà indicazioni all\'attore in scena' },
  { type: 'image', src: `${_cortoLoc}/scena-colloquio-attori-cortometraggio.jpg`, alt: 'Scena del colloquio tra gli attori nel cortometraggio' },
  { type: 'image', src: `${_cortoLoc}/selfie-attore-ragazzi-cortina.jpg`, alt: 'Selfie dell\'attore con i ragazzi a Cortina' },
  { type: 'image', src: `${_cortoLoc}/troupe-cinematografica-set-cortometraggio.jpg`, alt: 'Troupe cinematografica sul set del cortometraggio' },
]
