import { useEffect, useState } from 'react';

// Simpan referensi hasil: { mode:'url', value:string }
const KEY = 'lastCaptureRef';

export default function useLastCaptureRef() {
  const [ref, setRef] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
    catch { return null; }
  });

  useEffect(() => {
    if (ref) localStorage.setItem(KEY, JSON.stringify(ref));
    else localStorage.removeItem(KEY);
  }, [ref]);

  return [ref, setRef];
}