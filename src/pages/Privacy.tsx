import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SettimaArte</title>
        <link rel="canonical" href="https://www.settimaartefestival.it/privacy" />
      </Helmet>
      <Header />
      <main className="container mx-auto py-16 px-4 max-w-3xl">
        <h1 className="text-4xl font-bold font-funnel mb-8">Privacy Policy</h1>
        {/* TODO: privacy policy content */}
      </main>
      <Footer />
    </>
  )
}
