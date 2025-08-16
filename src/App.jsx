import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Live from './pages/Live.jsx';
import Result from './pages/Result.jsx';
import { useCaptureGate } from './state/CaptureContext.jsx';

function StepNav() {
  const loc = useLocation();
  const nav = useNavigate();
  const { canProceedFromLive } = useCaptureGate();

  const order = ['/', '/live', '/result'];
  const idx = Math.max(0, order.indexOf(loc.pathname));

  // Sembunyikan stepper di page 3
  if (loc.pathname === '/result') return null;

  const disableNext =
    (loc.pathname === '/live' && !canProceedFromLive) ? true : false;

  return (
    <div className="actions right">
      <button className="btn" onClick={() => nav(order[Math.max(0, idx - 1)])} disabled={idx === 0}>Back</button>
      <button className="btn primary" onClick={() => nav(order[Math.min(order.length - 1, idx + 1)])} disabled={disableNext}>
        Next
      </button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
          <Route path="/result" element={<Result />} />
        </Routes>
        <StepNav />
      </main>
      <footer className="footer">
        <small>© Milo - React SPA tester Cam</small>
      </footer>
    </>
  );
}