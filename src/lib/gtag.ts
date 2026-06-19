export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackUTMParameters = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  if (utmSource || utmMedium || utmCampaign) {
    event({
      action: 'utm_tracking',
      category: 'marketing',
      label: `source:${utmSource || 'none'}_medium:${utmMedium || 'none'}_campaign:${utmCampaign || 'none'}`,
    });
  }
};

export const trackHashRoute = (hashRoute: string) => {
  if (typeof window === 'undefined') return;
  
  const fullPath = `${window.location.pathname}${window.location.search}#${hashRoute}`;
  pageview(fullPath);
  
    event({
    action: 'hash_route_change',
    category: 'navigation',
    label: hashRoute,
  });
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
