'use client';

import { useEffect } from 'react';
import { analytics } from '@hefni101/siraaj';

export function AnalyticsProvider() {
  useEffect(() => {
    analytics.init({
      apiUrl: 'https://siraaj.live',
      projectId: 'kuebepath-tutorial',
      autoTrack: true,
      debug: false,
    });
  }, []);

  return null;
}
