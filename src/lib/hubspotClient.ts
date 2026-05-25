const portalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID as string
const formId = import.meta.env.VITE_HUBSPOT_FORM_ID as string

interface ContactFormData {
  nome: string
  cognome: string
  sono_uno: string
  email: string
  cellulare?: string
  provincia: string
  messaggio?: string
}

export async function submitHubSpotForm(data: ContactFormData): Promise<void> {
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

  const body = {
    fields: [
      { name: 'firstname', value: data.nome },
      { name: 'lastname', value: data.cognome },
      { name: 'sono_uno', value: data.sono_uno },
      { name: 'email', value: data.email },
      { name: 'phone', value: data.cellulare ?? '' },
      { name: 'state', value: data.provincia },
      { name: 'message', value: data.messaggio ?? '' },
    ],
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error('Errore invio form HubSpot')
  }
}
