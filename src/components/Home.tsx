'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiTag, FiMapPin, FiAward, FiBook, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Historia, Rua, Cidade, PreviewContent } from '../types';
import { useLegacyData } from '../hooks/useLegacyData';
import { supabaseBrowser } from '@/lib/supabase/client';
import Header from './Header';
import Menu from './Menu';
import MapWithPreview from './MapWithPreview';
import LegadoAfricanoCard from './cards/LegadoAfricanoCard';
import FeedbackPopup from './popups/FeedbackPopup';
import QuizModal from './popups/QuizModal';
import OnboardingPopup from './popups/OnboardingPopup';
import DonationPopup from './popups/DonationPopup';
import PopupCarrossel from './popups/PopupCarrossel';
import SiteInfo from './cards/SiteInfo';
import Footer from './extra/footer';
import RecomendedStreets from './cards/RecomendedStreets';
import RecomendedHistorias from './cards/RecomendedHistorias';
import WelcomeCard from './cards/WelcomeCard';
import DonationCard from './cards/DonationCard';
import BusinessCard from './cards/BusinessCard';
import QrHuntCard from './cards/QrHuntCard';

interface HomeProps {
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onPreviewOpen: (content: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}


interface Negocio {
  id: number;
  nome: string;
  endereco: string;
  telefone?: string;
  categoria: string;
  descricao?: string;
  foto?: string;
  logo_url?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
}

const Home: React.FC<HomeProps> = ({ onPreviewOpen }) => {
  const router = useRouter();
  
  const { data } = useLegacyData();
  const { historias, ruas, cidades } = data;

  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedRuaId, setSelectedRuaId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('1');
  const [showSteps, setShowSteps] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleRuaClick = (rua: Rua) => {
    const safeRuaId = String(rua.id);
    window.location.href = `/rua/${safeRuaId}`;
  };

  const handlePreviewContent = (content: PreviewContent) => {
    onPreviewOpen({
      type: content.type,
      title: content.title,
      content: content.description,
      image: content.images?.[0] || ''
    });
  };

  const slugify = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  useEffect(() => {
    let isMounted = true;

    async function fetchNegocios() {
      try {
        const { data: negociosData, error } = await supabaseBrowser
          .from('businesses')
          .select('id, nome, endereco, telefone, categoria, descricao, foto, logo_url, website, instagram, facebook, email')
          .order('nome', { ascending: true })
          .limit(3);

        if (error) throw error;

        if (isMounted && negociosData) {
          setNegocios(negociosData);
        }
      } catch (err) {
        console.error('Error fetching negocios:', err);
      }
    }

    fetchNegocios();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredNegocios = useMemo(() => {
    return negocios.slice(0, 3);
  }, [negocios]);

  return (
    <div className="min-h-screen bg-[#f4ede0]">
      <Header 
        setMenuOpen={setMenuOpen}
        setShowFeedback={setShowFeedback}
        setShowQuiz={setShowQuiz}
      />

      <Menu 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setShowMap={setShowMap}
        historias={historias}
      />

      {/* Main Content */}
      <div className="relative">
        {showMap && (
          <div className="bg-[#FEFCF8] shadow-sm border-b border-[#E6D3B4]">
            <div className="max-w-6xl mx-auto">
              <div className="h-64 md:h-96">
                <MapWithPreview 
                  setSelectedRuaId={setSelectedRuaId}
                  setPreviewContent={handlePreviewContent}
                  ruas={ruas}
                  historias={historias}
                />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 mt-2 md:mt-0">
          <WelcomeCard />
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-8">
          
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#4A3F35] flex items-center gap-2">
                <FiTag className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                Explore por Categoria
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Igrejas', 'Eventos'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/rua/categoria/${slugify(tag)}`)}
                  className="group w-full rounded-lg bg-white border-2 border-[#F5F1EB] hover:border-[#8B4513] p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                  aria-label={`Ver histórias da categoria ${tag}`}
                >
                  <div className="flex flex-col gap-2">
                    <FiTag className="w-5 h-5 text-[#8B4513] group-hover:scale-110 transition-transform" />
                    <span className="text-sm sm:text-base font-semibold text-[#4A3F35]">{tag}</span>
                    <span className="text-xs text-[#A0958A]">Ver histórias</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#4A3F35] flex items-center gap-2">
                <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                Ruas Recomendadas
              </h2>
              <button
                onClick={() => router.push('/ruasehistorias')}
                className="text-sm font-medium text-[#8B4513] hover:text-[#A0522D] transition-colors"
              >
                Ver todas →
              </button>
            </div>
            <RecomendedStreets ruas={ruas} historias={historias} handleRuaClick={handleRuaClick} />
          </section>

          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#4A3F35] flex items-center gap-2">
                <FiBook className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                Histórias Recomendadas
              </h2>
              <button
                onClick={() => router.push('/ruasehistorias')}
                className="text-sm font-medium text-[#8B4513] hover:text-[#A0522D] transition-colors"
              >
                Ver todas →
              </button>
            </div>
            <RecomendedHistorias historias={historias} />
          </section>

          {featuredNegocios.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#4A3F35] flex items-center gap-2">
                  <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                  Negócios Locais
                </h2>
                <button
                  onClick={() => router.push('/negocios')}
                  className="text-sm font-medium text-[#8B4513] hover:text-[#A0522D] transition-colors"
                >
                  Ver todos →
                </button>
              </div>
              <BusinessCard negocios={featuredNegocios} />
            </section>
          )}

          <section className="mb-10">
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:from-[#A0522D] hover:to-[#8B4513] text-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-left"
              aria-label="Iniciar quiz sobre a história de Gramado e Canela"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2.5 rounded-lg">
                  <FiAward className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold">Teste seus conhecimentos!</h3>
                  <p className="text-sm text-white/80">Quiz sobre a história local</p>
                </div>
                <FiArrowRight className="w-5 h-5" />
              </div>
            </button>
          </section>

          <section className="mb-10">
            <LegadoAfricanoCard />
          </section>

          <section className="mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#F5F1EB]">
              <SiteInfo />
            </div>
          </section>

          <section className="mb-10">
            <DonationCard />
          </section>
        </div>
      </div>

      {showOnboarding && (
        <OnboardingPopup
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {showDonation && (
        <DonationPopup
          onClose={() => setShowDonation(false)}
        />
      )}

      {showFeedback && (
        <FeedbackPopup
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {showQuiz && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {showPopup && (
        <PopupCarrossel
          onClose={() => setShowPopup(false)}
        />
      )}

      <Footer />
    </div>
    
  );
};

export default Home;
