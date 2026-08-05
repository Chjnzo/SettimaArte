import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import ScrollToTop from '@/components/ScrollToTop'

const Home          = lazy(() => import('@/pages/Home'))
const FSL           = lazy(() => import('@/pages/FSL'))
const Festival      = lazy(() => import('@/pages/Festival'))
const Cortometraggio = lazy(() => import('@/pages/Cortometraggio'))
const Admin         = lazy(() => import('@/pages/Admin'))
const NotFound      = lazy(() => import('@/pages/NotFound'))

function PageTracker() {
  const location = useLocation()
  useEffect(() => {
    window.gtag?.('config', 'G-JHMSJ30X01', { page_path: location.pathname + location.search })
  }, [location])
  return null
}

function ScrollDepthTracker() {
  const location = useLocation()
  useEffect(() => {
    const thresholds = [25, 50, 75, 90]
    const reached = new Set<number>()
    const onScroll = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      thresholds.forEach((t) => {
        if (pct >= t && !reached.has(t)) {
          reached.add(t)
          window.gtag?.('event', 'scroll_depth', { depth_percentage: t, page_path: location.pathname })
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])
  return null
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <ScrollToTop />
      <PageTracker />
      <ScrollDepthTracker />
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
