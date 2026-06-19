'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const HashRouter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isProcessingHash, setIsProcessingHash] = useState(false);

  useEffect(() => {
    const handleHashRoute = () => {
      const hash = window.location.hash;
      
      if (hash) {
        setIsProcessingHash(true);
        
        const route = hash.substring(1);
        const searchParams = window.location.search;
        
        const ruaHistoriaMatch = route.match(/^\/rua\/(\d+)\/historia\/(\d+)$/);
        
        if (ruaHistoriaMatch) {
          const [, ruaId, historiaId] = ruaHistoriaMatch;
          const nextjsRoute = `/rua/${ruaId}/historia/${historiaId}${searchParams}`;
          
          router.replace(nextjsRoute);
          return;
        }
        
        const ruaMatch = route.match(/^\/rua\/(\d+)$/);
        
        if (ruaMatch) {
          const [, ruaId] = ruaMatch;
          const nextjsRoute = `/rua/${ruaId}/historia/1${searchParams}`;
          
          router.replace(nextjsRoute);
          return;
        }
        
        if (route !== '/') {
          router.replace(`/${searchParams}`);
        }
        
        setIsProcessingHash(false);
      }
    };

    const initialHash = window.location.hash;
    if (initialHash && pathname === '/') {
      handleHashRoute();
    }

    window.addEventListener('hashchange', handleHashRoute);

    return () => {
      window.removeEventListener('hashchange', handleHashRoute);
    };
  }, [router, pathname]);

  if (isProcessingHash && pathname === '/') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default HashRouter;
