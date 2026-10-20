'use client';

import { useEffect } from 'react';
import { analytics } from '@hefni101/siraaj';

export function AnalyticsProvider() {
  useEffect(() => {
    analytics.init({
      apiUrl: 'https://analytics.hefni101.dev',
      projectId: 'kuebepath-tutorial',
      autoTrack: true,
      debug: false,
    });
  }, []);

  return null;
}
