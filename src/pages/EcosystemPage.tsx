import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Award, Mic, Store, Users, UserPlus, ChevronRight, CheckCircle2, Upload, LucideIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import ModalBase from '@/components/forms/ModalBase';
import { PARTNERS } from '@/data/partners';
import SpeakerRegistrationForm from '@/components/forms/SpeakerRegistrationForm';
import type { Theme, Lang } from '@/types';

interface PartnershipWizardProps {
  onClose: () => void;
  t: {
    modal_title: string;
    next: string;
    submit: string;
  };
  theme?: Theme;
  lang?: Lang;
}

interface PartnershipFormData {
  organization: string;
  email: string;
  category: string;
  dateSubmitted: string;
}

// Partnership Wizard Component
const PartnershipWizard: React.FC<PartnershipWizardProps> = ({ onClose, t, theme = 'dark' }) => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const totalSteps = 3;

  const [formData, setFormData] = useState<PartnershipFormData>({
    organization: '',
    email: '',
    category: '',
    dateSubmitted: new Date().toISOString()
  });

  const handleFinalSubmit = () => {
    const existing = JSON.parse(localStorage.getItem('partners') || '[]');
    localStorage.setItem('partners', JSON.stringify([...existing, formData]));
    setSubmitted(true);
    setTimeout(onClose, 4000);
  };

  if (submitted) {
    return (
      <ModalBase title={t.modal_title} onClose={onClose} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Application Received</h3>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Our sales team will be in contact with you shortly.</p>
        </div>
      </ModalBase>
    );
  }

  const inputClass = theme === 'light'
    ? 'w-full bg-gray-50 border border-gray-300 rounded p-3 text-gray-900 focus:border-blue-500 outline-none'
    : 'w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none';

  return (
    <ModalBase title={t.modal_title} onClose={onClose} theme={theme}>
      <div className={`w-full h-1 mb-8 ${
        theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'
      }`}>
        <div 
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                }`}>Organization Name</label>
                <input type="text" className={inputClass} placeholder="e.g. Babel Tech" />
              </div>
              <div className="space-y-2">
                <label className={`text-sm ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                }`}>Website</label>
                <input type="text" className={inputClass} placeholder="https://..." />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                }`}>Phone Number</label>
                <input type="tel" className={inputClass} placeholder="+964..." />
              </div>
              <div className="space-y-2">
                <label className={`text-sm ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                }`}>Contact Email</label>
                <input type="email" className={inputClass} placeholder="contact@company.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-400'
              }`}>Partnership Type</label>
              <select className={inputClass}>
                <option>Sponsorship</option>
                <option>Exhibitor Booth</option>
                <option>Startup Fundraiser</option>
                <option>Media Partner</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in text-center py-8">
            <div className={`border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer group ${
              theme === 'light'
                ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                : 'border-white/20 hover:border-blue-500/50 hover:bg-blue-500/5'
            }`}>
              <Upload className={`w-12 h-12 mx-auto mb-4 group-hover:text-blue-400 transition-colors ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h4 className={`font-medium mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>Request Details (PDF file)</h4>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-500'
              }`}>Requirements & Proposal (Max 10MB)</p>
            </div>
            <div className="text-left space-y-2">
              <label className={`text-sm ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-400'
              }`}>Special Conditions</label>
              <textarea className={`${inputClass} h-24`} placeholder="Any specific booth requirements or conditions?" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in text-center py-4 space-y-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h4 className={`text-2xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>Ready to Submit</h4>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Review your details. Our sales team will be in contact with you.</p>
            </div>
          </div>
        )}
      </div>

      <div className={`pt-6 mt-6 border-t flex justify-between items-center ${
        theme === 'light' ? 'border-gray-200' : 'border-white/10'
      }`}>
        {step > 1 ? (
          <button
            onClick={() => setStep(s => s-1)}
            className={`text-sm transition-colors ${
              theme === 'light'
                ? 'text-gray-600 hover:text-blue-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Back
          </button>
        ) : <div></div>}
        
        <button 
          onClick={() => step < 3 ? setStep(s => s+1) : handleFinalSubmit()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          {step === 3 ? t.submit : t.next} <ChevronRight size={16} />
        </button>
      </div>
    </ModalBase>
  );
};

// Ecosystem Marquee Component
interface EcosystemMarqueeProps {
  theme: Theme;
}

const EcosystemMarquee: React.FC<EcosystemMarqueeProps> = ({ theme }) => (
  <div className={`w-full border-y overflow-hidden py-10 mb-16 relative transition-colors duration-300 ${
    theme === 'light'
      ? 'bg-gray-100/50 border-gray-200'
      : 'bg-white/5 border-white/10'
  }`}>
    <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r z-10 ${
      theme === 'light' ? 'from-gray-100/50 to-transparent' : 'from-[#00040F] to-transparent'
    }`}></div>
    <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l z-10 ${
      theme === 'light' ? 'from-gray-100/50 to-transparent' : 'from-[#00040F] to-transparent'
    }`}></div>
    
    <div className="flex w-full">
      <div className="whitespace-nowrap animate-scroll-slow flex gap-16 items-center min-w-full pl-16">
        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-all cursor-pointer group hover:scale-105">
            <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-lg group-hover:border-blue-500/50 transition-colors ${p.color} ${
              theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-[#0a0a1a] border-white/10'
            }`}>
              {p.icon && <p.icon size={32} />}
            </div>
            <div className="text-center">
              <span className={`block font-bold text-sm tracking-wide ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{p.name}</span>
              <span className={`block text-[10px] uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full ${
                theme === 'light'
                  ? 'text-gray-600 bg-gray-200'
                  : 'text-gray-500 bg-white/5'
              }`}>{p.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      @keyframes scroll-slow {
        0% { transform: translateX(0); }
        100% { transform: translateX(-33.33%); }
      }
      .animate-scroll-slow {
        animation: scroll-slow 40s linear infinite;
      }
      .animate-scroll-slow:hover {
        animation-play-state: paused;
      }
    `}</style>
  </div>
);

interface EcosystemCard {
  icon: LucideIcon;
  title: string;
  desc: string;
  role: string;
  action: () => void;
}

/**
 * EcosystemPage Component
 * 
 * Displays partnership opportunities and ecosystem information.
 * Includes partnership wizard and speaker registration modal.
 * 
 * @returns {JSX.Element} EcosystemPage component
 */
const EcosystemPage: React.FC = () => {
  const { theme } = useTheme();
  const { lang, t } = useLanguage();
  const [showPartnershipWizard, setShowPartnershipWizard] = useState<boolean>(false);
  const [showSpeakerModal, setShowSpeakerModal] = useState<boolean>(false);

  const ecosystemCards: EcosystemCard[] = [
    { icon: Rocket, title: "Startups", desc: "Showcase your MVP to global investors.", role: "fundraiser", action: () => setShowPartnershipWizard(true) },
    { icon: Award, title: "Sponsors", desc: "Align your brand with innovation.", role: "sponsor", action: () => setShowPartnershipWizard(true) },
    { icon: Mic, title: "Media", desc: "Get exclusive access to announcements.", role: "partner", action: () => setShowPartnershipWizard(true) },
    { icon: Store, title: "Exhibitors", desc: "Demo your latest tech.", role: "booth", action: () => setShowPartnershipWizard(true) },
    { icon: Users, title: "Community", desc: "Join our ambassador program.", role: "partner", action: () => window.open("https://discord.com", "_blank") },
    { icon: UserPlus, title: "Speakers", desc: "Share your expertise on stage.", role: "speaker", action: () => setShowSpeakerModal(true) },
  ];

  return (
    <div id="ecosystem" className={`pt-32 pb-20 min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
    }`}>
      {showPartnershipWizard && (
        <PartnershipWizard 
          onClose={() => setShowPartnershipWizard(false)} 
          t={t.ecosystem} 
          lang={lang} 
          theme={theme} 
        />
      )}
      {showSpeakerModal && (
        <SpeakerRegistrationForm 
          onClose={() => setShowSpeakerModal(false)} 
          t={t} 
          theme={theme} 
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title={t.ecosystem.title} subtitle={t.ecosystem.subtitle} theme={theme} />
        
        <div id="partners">
          <EcosystemMarquee theme={theme} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemCards.map((item, i) => (
            <div 
              key={i} 
              onClick={item.action}
              className={`group p-8 rounded-2xl transition-all duration-300 cursor-pointer ${
                theme === 'light'
                  ? 'bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm'
                  : 'bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{item.title}</h3>
              <p className={`mb-6 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>{item.desc}</p>
              <button className={`text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {t.ecosystem.apply} <ChevronRight size={14} className={`text-blue-500 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcosystemPage;

