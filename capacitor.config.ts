
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.zzc102544007498a83eeea0683bd810b',
  appName: 'PromptVault',
  webDir: 'dist',
  server: {
    url: 'https://32c10254-4007-498a-83ee-ea0683bd810b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorCookies: {
      enabled: true
    }
  }
};

export default config;
