'use client';

import React from 'react';
import Link from 'next/link';
import PrimaryBtn from './buttons/PrimaryBtn';
import TransparentBtn from './buttons/TransparentBtn';

interface HeaderProps {
  setMenuOpen: (open: boolean) => void;
  setShowFeedback: (show: boolean) => void;
  setShowQuiz: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setMenuOpen, setShowFeedback, setShowQuiz }) => {

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Historin - Histórias de Gramado',
          text: 'Descubra as histórias de Gramado através do Historin!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-[#e6d3b4] border-b border-[#F5F1EB]">
      <div className="flex items-center">
        <Link href="/" className="mr-2 cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300">
          <img
            src="/images/meta/historin-logo.svg"
            alt="Historin"
            className="h-12 w-auto"
          />
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <PrimaryBtn
          onClick={() => setShowQuiz(true)}
        >
          <i className="fas fa-question-circle mr-2" />
          Quiz
        </PrimaryBtn>
        
        <TransparentBtn
          onClick={handleShare}
          aria-label="Compartilhar"
        >
          <i className="fas fa-share-alt" />
        </TransparentBtn>
        
        <TransparentBtn
          onClick={() => setShowFeedback(true)}
          aria-label="Feedback"
        >
          <i className="fas fa-comment-dots" />
        </TransparentBtn>
        
        <TransparentBtn
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu de navegação"
        >
          <i className="fas fa-bars" />
        </TransparentBtn>
      </div>
    </header>
  );
};

export default Header;
