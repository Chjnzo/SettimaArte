import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from '@/components/ScrollToTop'
import Home from '@/pages/Home'
import FSL from '@/pages/FSL'
import Festival from '@/pages/Festival'
import Cortometraggio from '@/pages/Cortometraggio'
import Contattaci from '@/pages/Contattaci'
import Admin from '@/pages/Admin'
import Privacy from '@/pages/Privacy'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/fsl"            element={<FSL />} />
        <Route path="/festival"       element={<Festival />} />
        <Route path="/cortometraggio" element={<Cortometraggio />} />
        <Route path="/contattaci"     element={<Contattaci />} />
        <Route path="/admin"          element={<Admin />} />
        <Route path="/privacy"        element={<Privacy />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
