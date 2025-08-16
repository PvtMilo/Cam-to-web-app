import { API } from './config';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const bust  = (url) => url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();

export function preloadOk(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = bust(url);
  });
}

// Tunggu /preview.jpg siap setelah jepret
export async function waitForSelectedReady(maxTry = 40, delay = 300) {
  const url = API.base + API.selectedPreviewPath;
  for (let i = 0; i < maxTry; i++) {
    const ok = await preloadOk(url);
    if (ok) return true;
    await sleep(delay);
  }
  return false;
}

// GET sederhana (ping endpoint)
export async function ping(url) {
  try {
    const r = await fetch(url, { method: 'GET' });
    return { ok: r.ok, status: r.status, statusText: r.statusText };
  } catch (e) {
    return { ok: false, status: 0, statusText: String(e) };
  }
}

// Trigger jepret — pakai kandidat sampai ada yang 200
export async function triggerCapture() {
  const method = (API.captureMethod || 'GET').toUpperCase();
  for (const path of API.captureCandidates) {
    try {
      const res = await fetch(API.base + path, { method });
      if (res.ok) return true;
    } catch {
      // coba kandidat berikutnya
    }
  }
  return false;
}