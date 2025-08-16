import { createContext, useContext, useState } from 'react';

const CaptureCtx = createContext(null);

export function CaptureProvider({ children }) {
  const [canProceedFromLive, setCanProceedFromLive] = useState(false);
  return (
    <CaptureCtx.Provider value={{ canProceedFromLive, setCanProceedFromLive }}>
      {children}
    </CaptureCtx.Provider>
  );
}

export function useCaptureGate() {
  const ctx = useContext(CaptureCtx);
  if (!ctx) throw new Error('useCaptureGate must be used within CaptureProvider');
  return ctx; // { canProceedFromLive, setCanProceedFromLive }
}