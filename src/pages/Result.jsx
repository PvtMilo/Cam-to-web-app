import { useEffect } from 'react';
import useLastCaptureRef from '../hooks/useLastCaptureRef';
import { API } from '../config';
import { bust, ping } from '../utils';
import { useNavigate } from 'react-router-dom';

export default function Result() {
  const [lastRef] = useLastCaptureRef();
  const nav = useNavigate();

  // Auto-stop live saat masuk
  useEffect(() => { (async () => { await ping(API.base + API.stopLivePath); })(); }, []);

  // Wajib sudah capture—jika belum, kembalikan ke /live
  useEffect(() => {
    if (!lastRef?.value) nav('/live', { replace: true });
  }, [lastRef, nav]);

  const src = bust(lastRef?.value || (API.base + API.selectedPreviewPath));

  return (
    <section className="card">
      <h2>Hasil Terakhir</h2>

      <div className="frame-box">
        <div className="frame-label">Captured</div>
        <img className="frame-img show" src={src} alt="Hasil terbaru" />
      </div>

      <div className="actions" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => nav('/')}>Home</button>
        <a className="btn warn" href={src} target="_blank" rel="noreferrer">Buka /preview.jpg</a>
      </div>
    </section>
  );
}