import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import ScrollToTop from '@/components/ScrollToTop'

const Home          = lazy(() => import('@/pages/Home'))
const FSL           = lazy(() => import('@/pages/FSL'))
const Festival      = lazy(() => import('@/pages/Festival'))
const Cortometraggio = lazy(() => import('@/pages/Cortometraggio'))
const Admin         = lazy(() => import('@/pages/Admin'))
const NotFound      = lazy(() => import('@/pages/NotFound'))

function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <ScrollToTop />
      <Suspense>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/fsl"            element={<FSL />} />
          <Route path="/festival"       element={<Festival />} />
          <Route path="/cortometraggio" element={<Cortometraggio />} />
          <Route path="/contattaci"     element={<Navigate to="/?scroll=contattaci" replace />} />
          <Route path="/admin"          element={<Admin />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    </MotionConfig>
  )
}

export default App
