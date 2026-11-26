import { useEffect, useState } from 'react';

const DEFAULT_SETTINGS = Object.freeze({
  label: 'WhatsApp',
  href: import.meta.env.VITE_WHATSAPP_HREF,
});

const API_BASE = (import.meta.env.VITE_GRAPHQL_URI)
  .replace(/\/graphql\/?$/, '');

export default function useWhatsappSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/api/settings/whatsapp`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`WhatsApp settings request failed (${response.status})`);
        return response.json();
      })
      .then((value) => {
        if (typeof value?.href === 'string' && /^https:\/\/wa\.me\/\d{8,15}$/.test(value.href)) {
          setSettings({ label: value.label || DEFAULT_SETTINGS.label, href: value.href });
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error(error.message);
      });
    return () => controller.abort();
  }, []);

  return settings;
}
