'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdFooter from './extra/AdFooter';
import BrownBtn from './buttons/BrownBtn';
import { useAuth } from '@/contexts/AuthContext';
import { featureFlags } from '@/config/featureFlags';

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setShowMap?: (show: boolean) => void;
  historias?: Array<{ id: string; rua_id: string; [key: string]: any }>;
}

const Menu: React.FC<MenuProps> = ({ 
  menuOpen, 
  setMenuOpen, 
  setShowMap,
  historias = [] 
}) => {
  const router = useRouter();
  const { user, signInWithGoogle, signOut } = useAuth();

  const handleSurpriseMe = () => {
    if (historias && historias.length > 0) {
      const randomHistoria = historias[Math.floor(Math.random() * historias.length)];
      router.push(`/rua/${String(randomHistoria.rua_id)}/historia/${String(randomHistoria.id)}`);
      setMenuOpen(false);
    } else {
      alert('Nenhuma história disponível.');
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (setShowMap) {
      setShowMap(true);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[9998] ${
          menuOpen ? 'opacity-40 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <nav
        className={`fixed top-0 right-0 h-full w-80 bg-[#FEFCF8] shadow-lg z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-[#F5F1EB] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundImage: 'linear-gradient(to bottom, #FEFCF8, #FAF7F2)'
        }}
      >
        <div className="flex flex-col h-full overflow-y-auto">
        <div className="text-center mt-8 px-6 border-b border-[#F5F1EB] pb-4">
          <h2 className="text-3xl font-serif font-bold text-[#4A3F35]">Menu</h2>
          <div className="w-16 h-1 bg-[#8B4513] mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="flex flex-col flex-grow px-6 space-y-2 mt-8">
          {featureFlags.googleAuth && (
            <>
              {user ? (
                <div className="mt-4 mb-2">
                  <Link
                    href="/perfil"
                    className="block px-4 py-4 bg-[#8B4513] hover:bg-[#A0522D] rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    onClick={handleMenuItemClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E6D3B4] flex items-center justify-center">
                        <i className="fas fa-user text-[#6B5B4F]"></i>
                      </div>
                      <div className="flex-1">
                        <span className="block text-base font-bold text-white">MEU PERFIL</span>
                        <span className="block text-xs text-[#E6D3B4]">{user.email}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-4 bg-[#8B4513] hover:bg-[#A0522D] rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-sm mb-3"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-base font-bold text-white">ENTRAR COM GOOGLE</span>
                    </div>
                  </button>
                  
                  <Link
                    href="/perfil"
                    className="block px-4 py-3 bg-[#F5F1EB] rounded-md transition-all duration-300 border border-[#A0958A]/20 opacity-60"
                    onClick={handleMenuItemClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E6D3B4] flex items-center justify-center">
                        <i className="fas fa-user text-[#6B5B4F]"></i>
                      </div>
                      <div className="flex-1">
                        <span className="block text-base font-semibold text-[#6B5B4F]">MEU PERFIL</span>
                        <span className="block text-xs text-[#A0958A]">Faça login para acessar</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </>
          )}
          
          <Link
            href="/"
            className="px-4 py-3 hover:bg-[#F5F1EB] rounded-md transition-all duration-300 border-b border-[#F5F1EB] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleHomeClick}
          >
            <span className="block text-lg font-semibold text-[#6B5B4F]">INÍCIO</span>
            <span className="block text-sm font-medium text-[#A0958A]">e MAPA</span>
          </Link>

          <Link
            href="/ruasehistorias"
            className="px-4 py-3 hover:bg-[#F5F1EB] rounded-md transition-all duration-300 border-b border-[#F5F1EB] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleMenuItemClick}
          >
            <span className="block text-lg font-semibold text-[#6B5B4F]">TODAS</span>
            <span className="block text-sm font-medium text-[#A0958A]">Ruas e Histórias</span>
          </Link>
          
          <Link
            href="/legado-africano"
            className="px-4 py-3 hover:bg-[#F5F1EB] rounded-md text-lg font-semibold text-[#6B5B4F] transition-all duration-300 border-b border-[#F5F1EB] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleMenuItemClick}
          >
            <span className="block text-lg font-semibold text-[#6B5B4F]">LEGADO AFRICANO NO RS</span>
            <span className="block text-sm font-medium text-[#A0958A]">A Importância da Inclusão Histórica</span>
          </Link>

          <Link
            href="/sobre"
            className="px-4 py-3 hover:bg-[#F5F1EB] rounded-md text-lg font-semibold text-[#6B5B4F] transition-all duration-300 border-b border-[#F5F1EB] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleMenuItemClick}
          >
            <span className="block text-lg font-semibold text-[#6B5B4F]">SOBRE</span>
            <span className="block text-sm font-medium text-[#A0958A]">e equipe</span>
          </Link>

          <Link
            href="/referencias"
            className="px-4 py-3 hover:bg-[#F5F1EB] rounded-md transition-all duration-300 border-b border-[#F5F1EB] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleMenuItemClick}
          >
            <span className="block text-lg font-semibold text-[#6B5B4F]">REFERÊNCIAS</span>
            <span className="block text-sm font-medium text-[#A0958A]">e conteúdo</span>
          </Link>
          
          <Link
            href="/adicionar-historia"
            className="px-4 py-3 hover:bg-[#F5F1EB] rounded-md transition-all duration-300 border-b border-[#F5F1EB] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleMenuItemClick}
          >
            <span className="block text-sm font-medium text-[#A0958A]">Conte a sua</span>
            <span className="block text-lg font-semibold text-[#6B5B4F]">HISTÓRIA</span>
          </Link>

          {historias.length > 0 && (
            <BrownBtn
              onClick={handleSurpriseMe}
            >
              SURPREENDA-ME
            </BrownBtn>
          )}
        </div>
        <AdFooter />
        </div>
      </nav>
    </>
  );
};

export default Menu;
