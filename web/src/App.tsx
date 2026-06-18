import { useEffect, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { MotionConfig } from 'motion/react';
import { Layout } from './components/Layout';

const StartPage = lazy(() => import('./pages/StartPage').then((m) => ({ default: m.StartPage })));
const FindenPage = lazy(() => import('./pages/FindenPage').then((m) => ({ default: m.FindenPage })));
const KartePage = lazy(() => import('./pages/KartePage').then((m) => ({ default: m.KartePage })));
const DetailPage = lazy(() => import('./pages/DetailPage').then((m) => ({ default: m.DetailPage })));
const PlattformenPage = lazy(() => import('./pages/PlattformenPage').then((m) => ({ default: m.PlattformenPage })));
const WissenPage = lazy(() => import('./pages/WissenPage').then((m) => ({ default: m.WissenPage })));
const UeberPage = lazy(() => import('./pages/UeberPage').then((m) => ({ default: m.UeberPage })));
const NichtGefunden = lazy(() => import('./pages/NichtGefunden').then((m) => ({ default: m.NichtGefunden })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <Suspense
        fallback={
          <Center style={{ height: '50vh' }}>
            <Loader color="wald" size="lg" />
          </Center>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<StartPage />} />
            <Route path="/finden" element={<FindenPage />} />
            <Route path="/karte" element={<KartePage />} />
            <Route path="/stelle/:id" element={<DetailPage />} />
            <Route path="/wissen" element={<WissenPage />} />
            <Route path="/plattformen" element={<PlattformenPage />} />
            <Route path="/ueber" element={<UeberPage />} />
            <Route path="*" element={<NichtGefunden />} />
          </Route>
        </Routes>
      </Suspense>
    </MotionConfig>
  );
}
