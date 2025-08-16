import { useEffect, useRef, useState } from 'react';
import { API } from '../config';
import { bust, ping, triggerCapture, waitForSelectedReady } from '../utils';
import useLastCaptureRef from '../hooks/useLastCaptureRef';
import { useCaptureGate } from '../state/CaptureContext.jsx';

export default function Live() {
  // Simpan URL hasil agar persist ke Page 3 (Result)
  const [_, setLastRef] = useLastCaptureRef(); // { mode:'url', value:'/api/preview.jpg' }
  // Gate untuk mengaktifkan tombol Next di stepper luar
  const { setCanProceedFromLive } = useCaptureGate();

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Idle.');
  const [showCaptured, setShowCaptured] = useState(false); // mulai dari live
  const [previewPath, setPreviewPath] = useState(null);
  const [countdown, setCountdown] = useState(''); // "5" → "3" → "2" → "1"

  const liveRef = useRef(null);    // layer live (bawah)
  const captRef = useRef(null);    // layer captured (atas)
  const bufferRef = useRef(null);  // offscreen Image untuk preload anti-flicker
  const timerRef = useRef(null);
  const runningRef = useRef(false);

  // === Reset & AUTO START LIVE saat masuk ===
  useEffect(() => {
    // Photobooth: mulai sesi baru, kosongkan hasil
    setLastRef(null);
    setCanProceedFromLive(false);
    setShowCaptured(false);
    if (captRef.current) captRef.current.src = '';

    (async () => {
      setStatus('Menyalakan live view…');
      const r = await ping(API.base + API.startLivePath);
      setStatus(`Start live: ${r.ok ? 'OK' : 'FAIL'} (${r.status} ${r.statusText})`);
    })();

    // AUTO STOP LIVE saat keluar halaman (unmount)
    return () => { (async () => { await ping(API.base + API.stopLivePath); })(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Deteksi path preview untuk live (pilih kandidat pertama yang 200 OK) ===
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus((s) => `Mendeteksi preview path…\n${s}`);
      for (const p of API.previewCandidates) {
        const r = await ping(API.base + p);
        if (cancelled) return;
        if (r.ok) {
          setPreviewPath(p);
          setStatus((s) => `Preview OK di ${p} (${r.status}).\n${s}`);
          return;
        }
      }
      setStatus((s) => `Tidak ada kandidat preview yang OK.\n${s}`);
    })();
    return () => { cancelled = true; };
  }, []);

  // === Polling live (double-buffered). Saat sudah captured → freeze background ===
  useEffect(() => {
    if (!previewPath) return;
    bufferRef.current = new Image();

    const tick = () => {
      if (runningRef.current || showCaptured) return; // stop refresh saat sudah ada hasil
      runningRef.current = true;

      const next = bust(API.base + previewPath);
      bufferRef.current.onload = () => {
        if (liveRef.current) {
          liveRef.current.src = next;              // swap setelah onload → anti flicker
          liveRef.current.classList.add('show');
        }
        runningRef.current = false;
      };
      bufferRef.current.onerror = () => {
        setStatus((s) => `Live error memuat ${previewPath}\n${s}`);
        runningRef.current = false;
      };
      bufferRef.current.src = next;
    };

    tick();
    timerRef.current = setInterval(tick, API.liveIntervalMs); // << ganti di config.js
    return () => clearInterval(timerRef.current);
  }, [previewPath, showCaptured]);

  // ===== Countdown 5·3·2·1 lalu Trigger Capture =====
  async function onCapture() {
    setBusy(true);
    setStatus('Countdown…');

    // Urutan sesuai permintaan: 5 → 3 → 2 → 1
    const seq = ['5', '3', '2', '1'];
    for (const s of seq) {
      setCountdown(s);
      await new Promise((r) => setTimeout(r, 1000)); // 1 detik per angka
    }
    setCountdown('');

    try {
      setStatus('Capturing…');
      const ok = await triggerCapture();
      if (!ok) {
        setStatus('Capture gagal (HTTP bukan 200).');
        setBusy(false);
        return;
      }

      setStatus('Menunggu /preview.jpg siap…');
      await waitForSelectedReady(API.imageReadyMaxTry, API.imageReadyRetryMs);

      const url = API.base + API.selectedPreviewPath; // persist
      setLastRef({ mode: 'url', value: url });        // simpan untuk Page 3 (Result)

      // tampilkan hasil di overlay (captured menimpa live)
      if (captRef.current) captRef.current.src = bust(url);
      setShowCaptured(true);

      // Aktifkan tombol Next di stepper luar
      setCanProceedFromLive(true);

      setStatus('Captured → tampil dari /preview.jpg.');
    } catch (e) {
      console.error(e);
      setStatus('Error saat capture. Lihat console/backend.');
    } finally {
      setBusy(false);
    }
  }

  function onRetake() {
    // Kembali ke mode live (tanpa hasil)
    setLastRef(null);
    setShowCaptured(false);
    setCanProceedFromLive(false);
    if (captRef.current) captRef.current.src = '';
    setStatus('Retake: kembali ke live.');
  }

  return (
    <section className="card">
      <h2>Live & Capture</h2>

      <div className="frame-box">
        <div className="frame-label">{showCaptured ? 'Captured' : 'Live'}</div>

        {/* layer live (bawah) */}
        <img ref={liveRef} className="frame-img show" alt="Live preview" />

        {/* layer captured (atas) */}
        <img
          ref={captRef}
          className={`frame-img ${showCaptured ? 'show' : ''}`}
          alt="Captured"
          style={{ zIndex: 2 }}
        />

        {/* overlay countdown */}
        <div className={`countdown ${countdown ? 'show' : ''}`} style={{ zIndex: 3 }}>
          {countdown}
        </div>
      </div>

      <div className="actions">
        {!showCaptured ? (
          <button className="btn primary" onClick={onCapture} disabled={busy}>Capture</button>
        ) : (
          <button className="btn primary" onClick={onRetake} disabled={busy}>Retake</button>
        )}
      </div>

      <div className="status">
        {`previewPath (live): ${previewPath ?? '(belum terdeteksi)'}\n`}
        {`selected preview (hasil): ${API.base + API.selectedPreviewPath}\n`}
        {`interval: ${API.liveIntervalMs} ms\n`}
        {status}
      </div>
    </section>
  );
}