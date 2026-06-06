import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StartPage } from './pages/StartPage';
import { FindenPage } from './pages/FindenPage';
import { DetailPage } from './pages/DetailPage';
import { PlattformenPage } from './pages/PlattformenPage';
import { WissenPage } from './pages/WissenPage';
import { UeberPage } from './pages/UeberPage';
import { NichtGefunden } from './pages/NichtGefunden';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<StartPage />} />
          <Route path="/finden" element={<FindenPage />} />
          <Route path="/stelle/:id" element={<DetailPage />} />
          <Route path="/wissen" element={<WissenPage />} />
          <Route path="/plattformen" element={<PlattformenPage />} />
          <Route path="/ueber" element={<UeberPage />} />
          <Route path="*" element={<NichtGefunden />} />
        </Route>
      </Routes>
    </>
  );
}
