import { Helmet } from 'react-helmet-async'

export default function Admin() {
  return (
    <>
      <Helmet>
        <title>Area Admin | SettimaArte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center">
        {/* TODO: ProtectedRoute + AdminLogin + AdminDashboard */}
        <p>Area Admin — In costruzione</p>
      </main>
    </>
  )
}
