import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useInView } from 'framer-motion'
import { toast } from 'sonner'
import { submitHubSpotForm } from '@/lib/hubspotClient'

const schema = z.object({
  nome: z.string().min(1, 'Il nome è obbligatorio'),
  cognome: z.string().min(1, 'Il cognome è obbligatorio'),
  sono_uno: z.enum(['studente', 'genitore', 'docente', 'altro'], {
    required_error: 'Seleziona un\'opzione',
  }),
  email: z.string().email('Inserisci un\'email valida'),
  cellulare: z.string().optional(),
  provincia: z.string().min(1, 'La provincia è obbligatoria'),
  messaggio: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-400 text-xs mt-1" role="alert">{message}</p>
}

const inputCls = 'w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-azzurro focus:border-azzurro transition text-base md:text-sm'

export default function ContactForm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    try {
      await submitHubSpotForm(data)
      toast.success('Messaggio inviato! Ti ricontatteremo presto.')
      reset()
    } catch {
      toast.error('Errore durante l\'invio. Riprova o scrivici via email.')
    }
  }

  return (
    <section
      id="contattaci"
      data-header-dark
      ref={ref}
      style={{ backgroundColor: 'var(--color-blu)' }}
      className="w-full py-16 md:py-24"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-funnel font-bold text-4xl md:text-5xl text-white mb-4">
            Contattaci
          </h2>
          <p className="text-white/85 mb-10 leading-relaxed text-lg">
            Vuoi parlare con noi o hai altre curiosità? Scrivici a{' '}
            <a
              href="mailto:info@skillherz.com"
              className="text-azzurro hover:underline underline-offset-4"
            >
              info@skillherz.com
            </a>{' '}
            oppure compila il form sottostante per essere ricontattato.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Nome */}
              <div>
                <label htmlFor="nome" className="sr-only">Nome</label>
                <input
                  id="nome"
                  {...register('nome')}
                  placeholder="Nome *"
                  autoComplete="given-name"
                  className={inputCls}
                />
                <FieldError message={errors.nome?.message} />
              </div>

              {/* Cognome */}
              <div>
                <label htmlFor="cognome" className="sr-only">Cognome</label>
                <input
                  id="cognome"
                  {...register('cognome')}
                  placeholder="Cognome *"
                  autoComplete="family-name"
                  className={inputCls}
                />
                <FieldError message={errors.cognome?.message} />
              </div>

              {/* Sono uno */}
              <div>
                <label htmlFor="sono_uno" className="sr-only">Sono uno</label>
                <select
                  id="sono_uno"
                  {...register('sono_uno')}
                  defaultValue=""
                  className={`${inputCls} appearance-none`}
                >
                  <option value="" disabled>Sono uno... *</option>
                  <option value="studente">Studente</option>
                  <option value="genitore">Genitore</option>
                  <option value="docente">Docente</option>
                  <option value="altro">Altro</option>
                </select>
                <FieldError message={errors.sono_uno?.message} />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="Email *"
                  autoComplete="email"
                  className={inputCls}
                />
                <FieldError message={errors.email?.message} />
              </div>

              {/* Cellulare */}
              <div>
                <label htmlFor="cellulare" className="sr-only">Cellulare</label>
                <input
                  id="cellulare"
                  {...register('cellulare')}
                  type="tel"
                  placeholder="Cellulare"
                  autoComplete="tel"
                  className={inputCls}
                />
              </div>

              {/* Provincia */}
              <div>
                <label htmlFor="provincia" className="sr-only">Provincia</label>
                <input
                  id="provincia"
                  {...register('provincia')}
                  placeholder="Provincia *"
                  className={inputCls}
                />
                <FieldError message={errors.provincia?.message} />
              </div>

              {/* Messaggio full width */}
              <div className="md:col-span-2">
                <label htmlFor="messaggio" className="sr-only">Messaggio</label>
                <textarea
                  id="messaggio"
                  {...register('messaggio')}
                  placeholder="Messaggio"
                  rows={5}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Submit full width */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-azzurro hover:bg-azzurro/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-funnel font-semibold px-8 py-4 rounded-squircle transition-colors duration-200"
                >
                  {isSubmitting ? 'Invio in corso...' : 'Invia messaggio'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
