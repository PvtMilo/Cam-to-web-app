export const API = {
  // JANGAN pakai http://localhost:5513 langsung, pakai proxy:
  base: '/api',

  startLivePath: '/?CMD=LiveViewWnd_Show',
  stopLivePath:  '/?CMD=LiveViewWnd_Hide',

  // kandidat untuk live stream (deteksi otomatis)
  previewCandidates: [
    '/liveview.jpg',
    '/live.jpg',
    '/preview.jpg',
    '/thumb.jpg',
    '/jpeg/liveview.jpg',
  ],

  // trigger capture
  captureCandidates: [
    '/?CMD=CaptureNoAf',
    '/?CMD=Capture',
  ],
  captureMethod: 'GET',

  // hasil selalu dari sini (persist walau refresh)
  selectedPreviewPath: '/preview.jpg',

  // polling live view
  liveIntervalMs: 200,          // <= ini interval polling; boleh kamu ubah (300–1000 ms)
  imageReadyRetryMs: 300,
  imageReadyMaxTry: 40,
};