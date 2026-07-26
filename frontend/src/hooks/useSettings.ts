import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface SiteSettings {
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  whatsapp_number?: string;
  site_name?: string;
  site_tagline?: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/users/settings/public');
        const settings: SiteSettings = {};
        if (data.settings) {
          Object.values(data.settings).forEach((group: any) => {
            if (typeof group === 'object' && group !== null) {
              Object.entries(group).forEach(([k, v]) => {
                (settings as any)[k] = String(v);
              });
            }
          });
        }
        return settings;
      } catch (err) {
        return {} as SiteSettings;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
