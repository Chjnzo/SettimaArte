import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SettimaArte</title>
        <link rel="canonical" href="https://settimaartefestival.it/privacy" />
        <meta
          name="description"
          content="Informativa sulla privacy del sito SettimaArte — progetto educational di Oriocenter dedicato alla Formazione Scuola-Lavoro attraverso il linguaggio cinematografico."
        />
      </Helmet>
      <Header />
      <main className="container mx-auto py-16 px-4 max-w-3xl prose prose-lg">
        <h1 className="text-4xl font-bold font-funnel mb-8">Privacy Policy</h1>

        <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: giugno 2025</p>

        <h2>1. Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento dei dati personali raccolti tramite questo sito è <strong>Oriocenter S.r.l.</strong>,
          con sede in Via Portico 61, 24050 Orio al Serio (BG). Per qualsiasi richiesta relativa al trattamento dei dati
          personali è possibile contattare il titolare all'indirizzo email{' '}
          <a href="mailto:info@skillherz.com">info@skillherz.com</a>.
        </p>

        <h2>2. Tipologie di dati raccolti</h2>
        <p>
          Il sito raccoglie le seguenti categorie di dati personali:
        </p>
        <ul>
          <li>
            <strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate e orari
            di accesso, raccolti automaticamente dai sistemi informatici che gestiscono il sito.
          </li>
          <li>
            <strong>Dati forniti volontariamente dall'utente:</strong> nome, cognome, indirizzo email, numero di telefono,
            provincia e messaggio, inseriti nel modulo di contatto.
          </li>
        </ul>

        <h2>3. Finalità e base giuridica del trattamento</h2>
        <p>I dati personali sono trattati per le seguenti finalità:</p>
        <ul>
          <li>
            <strong>Gestione delle richieste di contatto</strong> (art. 6, par. 1, lett. b GDPR): i dati inseriti nel form
            sono trattati per rispondere alle richieste degli utenti e fornire le informazioni richieste sul progetto
            SettimaArte.
          </li>
          <li>
            <strong>Obblighi di legge</strong> (art. 6, par. 1, lett. c GDPR): il titolare può trattare i dati per
            adempiere a obblighi previsti dalla normativa applicabile.
          </li>
          <li>
            <strong>Legittimo interesse</strong> (art. 6, par. 1, lett. f GDPR): i dati di navigazione sono trattati per
            garantire il corretto funzionamento del sito e per finalità di sicurezza informatica.
          </li>
        </ul>

        <h2>4. Modalità del trattamento e conservazione</h2>
        <p>
          I dati sono trattati con strumenti informatici nel rispetto delle misure di sicurezza previste dal Regolamento
          UE 2016/679 (GDPR). I dati raccolti tramite il modulo di contatto sono trasmessi e conservati sulla piattaforma
          HubSpot (HubSpot, Inc., USA) nel rispetto delle garanzie previste dal GDPR per i trasferimenti internazionali
          di dati. I dati sono conservati per il tempo strettamente necessario a soddisfare le finalità per cui sono stati
          raccolti, e comunque non oltre 24 mesi dall'ultima interazione.
        </p>

        <h2>5. Terze parti e servizi esterni</h2>
        <p>Il sito utilizza i seguenti servizi di terze parti:</p>
        <ul>
          <li>
            <strong>HubSpot</strong> — gestione del modulo di contatto e CRM. Privacy policy:{' '}
            <a href="https://legal.hubspot.com/privacy-policy" target="_blank" rel="noopener noreferrer">
              legal.hubspot.com/privacy-policy
            </a>
          </li>
          <li>
            <strong>YouTube (Google LLC)</strong> — incorporamento di video. La riproduzione dei video è soggetta alla
            privacy policy di Google:{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>
          </li>
          <li>
            <strong>Cloudflare</strong> — erogazione del sito e sicurezza della rete. Privacy policy:{' '}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
              cloudflare.com/privacypolicy
            </a>
          </li>

        </ul>

        <h2>6. Cookie</h2>
        <p>
          Il sito utilizza esclusivamente cookie tecnici necessari al suo funzionamento. Non vengono utilizzati cookie di
          profilazione o di tracciamento per finalità pubblicitarie. I cookie tecnici non richiedono il consenso
          dell'utente ai sensi della normativa vigente.
        </p>
        <p>
          I video YouTube incorporati nel sito possono impostare cookie di terze parti al momento della riproduzione.
          L'utente può gestire le preferenze sui cookie direttamente dal proprio browser.
        </p>

        <h2>7. Diritti dell'interessato</h2>
        <p>
          Ai sensi degli articoli 15–22 del GDPR, l'utente ha il diritto di:
        </p>
        <ul>
          <li>accedere ai propri dati personali;</li>
          <li>richiedere la rettifica o la cancellazione dei dati;</li>
          <li>richiedere la limitazione del trattamento;</li>
          <li>opporsi al trattamento;</li>
          <li>richiedere la portabilità dei dati;</li>
          <li>revocare il consenso in qualsiasi momento, senza pregiudizio per la liceità del trattamento basato sul consenso precedentemente prestato.</li>
        </ul>
        <p>
          Per esercitare i propri diritti è possibile inviare una richiesta all'indirizzo email{' '}
          <a href="mailto:info@skillherz.com">info@skillherz.com</a>. L'utente ha inoltre il diritto di proporre
          reclamo all'Autorità Garante per la protezione dei dati personali (
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            www.garanteprivacy.it
          </a>
          ).
        </p>

        <h2>8. Modifiche alla presente informativa</h2>
        <p>
          Il titolare si riserva il diritto di modificare la presente informativa in qualsiasi momento, dandone
          comunicazione agli utenti tramite pubblicazione sul sito. Si invita a consultare periodicamente questa pagina.
        </p>
      </main>
      <Footer />
    </>
  )
}
