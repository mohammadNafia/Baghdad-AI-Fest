import React, { useState, useEffect, useRef, Suspense } from 'react';
import ContactPage from '@/pages/ContactPage';

import { openGoogleCalendar } from '@/utils/calendarExport.js';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Mic, 
  Store, 
  ChevronRight, 
  ArrowRight,
  Brain,
  Rocket,
  Handshake,
  Megaphone,
  Award,
  X,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle2,
  Languages,
  Upload,
  Building2,
  Cpu,
  Radio,
  UserPlus,
  MessageCircle,
  Sun,
  Moon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  LogIn,
  UserPlus as UserPlusIcon,
  ArrowUp
} from 'lucide-react';

// --- TRANSLATIONS ---

const CONTENT = {
  en: {
    nav: { home: 'Home', about: 'About', agenda: 'Agenda', contact: 'Contact' },
    hero: {
      date: "January 27, 2026 • The Station",
      title_prefix: "Bridging",
      title_highlight: "Intelligence",
      subtitle: "The premier artificial intelligence Festival in the Middle East. Join our community of Ai innovators in the mission of shaping the future of Mesopotamia.",
      cta_agenda: "View Agenda",
      cta_watch: "Event Page",
      countdown_label: "Time Until Summit"
    },
    stats: { attendees: "Attendees", speakers: "Speakers", exhibitors: "Exhibitors" },
    speakers: { title: "World Class Minds", subtitle: "Learn from the pioneers defining the boundaries of artificial intelligence." },
    ecosystem: { 
      title: "The Ecosystem", 
      subtitle: "Partner with us to build the future.", 
      apply: "Apply Now"
    },
    forms: {
      submit: "Submit",
      success: "Registration Received!"
    },
    chatbot: {
      title: "AI Assistant",
      welcome: "How can I help you today?",
      faq_event_date: "Event date & time",
      faq_location: "Location",
      faq_register: "How to register",
      faq_speaker: "Speaker application",
      faq_partnership: "Partnership opportunities",
      placeholder: "Type your question...",
      cannedAnswers: {
        event_date: "The Baghdad AI Summit 2026 will take place on April 4, 2026 at The Station. Registration opens at 9:00 AM.",
        location: "The summit will be held at The Station. Detailed directions and parking information will be sent to registered attendees.",
        register: "You can register by clicking the 'Contact' link in the navigation bar to get in touch with our team.",
        speaker: "To apply as a speaker, please use the contact form or apply via the Google Form on our Contact page.",
        partnership: "For partnership opportunities, please reach out to us via the Contact page.",
        default: "Thanks! A member of the Baghdad AI Summit team will contact you soon."
      }
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Have questions or want to join the festival? We'd love to hear from you.",
      email_us: "Email Us",
      apply_title: "Apply to the Festival",
      apply_desc: "Think you have what it takes? Apply now to be part of the most exciting AI event in the region.",
      apply_button: "Apply via Google Form",
      contact_title: "Contact Information",
      contact_desc: "For general inquiries, please email us directly.",
      success: "Message sent! We will get back to you soon.",
      form: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        submit: "Send Message"
      }
    }
  },
  ar: {
    nav: { home: 'الرئيسية', about: 'عن المهرجان', agenda: 'الجدول', contact: 'اتصل بنا' },
    hero: {
      date: "يناير 27 2026 • المحطة",
      title_prefix: "جسر",
      title_highlight: "الذكاء الاصطناعي",
      subtitle: "المهرجان الرائد للذكاء الاصطناعي في الشرق الأوسط. انضم إلى مجتمع مبتكري الذكاء الأصطناعي في تشكيل مستقبل بلاد الرافدين.",
      cta_agenda: "عرض الجدول",
      cta_watch: "حساب الحدث",
      countdown_label: "الوقت المتبقي للمهرجان"
    },
    stats: { attendees: "حضور", speakers: "متحدثين", exhibitors: "عارضين" },
    speakers: { title: "عقول عالمية", subtitle: "تعلم من الرواد الذين يرسمون حدود الذكاء الاصطناعي." },
    ecosystem: { 
      title: "البيئة التقنية", 
      subtitle: "كن شريكاً في بناء المستقبل.", 
      apply: "قدم الآن"
    },
    forms: {
      submit: "إرسال",
      success: "تم استلام الطلب!"
    },
    chatbot: {
      title: "مساعد الذكاء الاصطناعي",
      welcome: "كيف يمكنني مساعدتك اليوم؟",
      faq_event_date: "تاريخ ووقت الحدث",
      faq_location: "الموقع",
      faq_register: "كيفية التسجيل",
      faq_speaker: "طلب المتحدثين",
      faq_partnership: "فرص الشراكة",
      placeholder: "اكتب سؤالك...",
      cannedAnswers: {
        event_date: "ستقام قمة بغداد للذكاء الاصطناعي 2026 في الرابع من ابريل 2026 في المحطة. يفتح التسجيل الساعة 9:00 صباحاً.",
        location: "ستقام القمة في المحطة. سيتم إرسال الاتجاهات التفصيلية ومعلومات المواقف للمسجلين.",
        register: "يمكنك التسجيل من خلال صفحة 'اتصل بنا' للتواصل مع فريقنا.",
        speaker: "للتقديم كمتحدث، يرجى استخدام نموذج الاتصال أو التقديم عبر نموذج جوجل في صفحة اتصل بنا.",
        partnership: "لفرص الشراكة، يرجى التواصل معنا عبر صفحة اتصل بنا.",
        default: "شكراً! سيتصل بك أحد أعضاء فريق قمة بغداد للذكاء الاصطناعي قريباً."
      }
    },
    contact: {
      title: "تواصل معنا",
      subtitle: "هل لديك أسئلة أو ترغب في الانضمام إلى المهرجان؟ نود أن نسمع منك.",
      email_us: "راسلنا عبر البريد",
      apply_title: "التقديم للمهرجان",
      apply_desc: "هل تعتقد أن لديك ما يلزم؟ قدم الآن لتكون جزءاً من أكثر أحداث الذكاء الاصطناعي إثارة في المنطقة.",
      apply_button: "التقديم عبر نماذج جوجل",
      contact_title: "معلومات الاتصال",
      contact_desc: "للاستفسارات العامة، يرجى مراسلتنا بالبريد الإلكتروني مباشرة.",
      success: "تم إرسال الرسالة! سنقوم بالرد عليك قريباً.",
      form: {
        name: "الاسم",
        email: "البريد الإلكتروني",
        subject: "الموضوع",
        message: "الرسالة",
        submit: "إرسال الرسالة"
      }
    }
  }
};

// --- HOOKS & UTILS ---

const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, countRef };
};

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SummitLogo = ({ className = "w-12 h-12" }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`${className} flex items-center justify-center`}>
      {!imgError ? (
        <img 
          src="/Summit-Logo.png" 
          alt="Baghdad AI Summit Logo" 
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-white/10 rounded flex items-center justify-center border border-white/20">
           <span className="text-white font-bold text-xs">AI</span>
        </div>
      )}
    </div>
  );
};

const CountdownTimer = ({ theme = 'dark' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = new Date("April 4, 2026 09:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${theme === 'light' ? 'bg-blue-100' : 'bg-white/5 border border-white/10'}`}>
            <span className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-white'}`}>
              {value < 10 ? `0${value}` : value}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">{unit}</p>
        </div>
      ))}
    </div>
  );
};

const Chatbot = ({ t, lang, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (isOpen && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue('');
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'assistant', text: t.chatbot.cannedAnswers.default }]);
    }, 500);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50 w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110`}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      {isOpen && (
        <div className={`fixed ${lang === 'ar' ? 'left-6' : 'right-6'} bottom-24 z-50 w-80 md:w-96 ${theme === 'light' ? 'bg-white shadow-2xl' : 'bg-[#0a0a1a] border border-white/10'} rounded-2xl flex flex-col max-h-[500px] overflow-hidden`}>
          <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <h3 className="font-bold">{t.chatbot.title}</h3>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.length === 0 && <p className="text-center text-sm opacity-50">{t.chatbot.welcome}</p>}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white border border-white/10'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10 flex gap-2">
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={t.chatbot.placeholder} className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <button onClick={handleSendMessage} className="p-2 bg-blue-600 text-white rounded-lg"><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
};

// --- SHARED DATA ---

const SPEAKERS = [
  { id: 1, name: "Dr. Amira Al-Baghdadi", role: "Chief AI Scientist", company: "Future Iraq Tech", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Prof. John Neural", role: "Director of Robotics", company: "Global AI Systems", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Layla Hassan", role: "Founder", company: "Tigris Valley Ventures", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Tariq Jameel", role: "Ethical AI Lead", company: "OpenMinds", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Sarah Chen", role: "VP Engineering", company: "DataFlow", image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Omar Farooq", role: "CEO", company: "Baghdad CyberSec", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" }
];

const AGENDA_ITEMS = [
  { time: "09:00 AM", title: "Registration & Networking", desc: "Welcome breakfast at the Grand Hall", type: "Logistics" },
  { time: "10:00 AM", title: "Opening Keynote: The New Era", desc: "How Baghdad is reclaiming its title as a center of wisdom.", type: "Keynote" },
  { time: "11:30 AM", title: "Panel: AI Infrastructure", desc: "Building the backbone of the digital Middle East.", type: "Panel" },
  { time: "02:00 PM", title: "Workshop: Generative AI", desc: "Practical applications for local businesses.", type: "Workshop" },
  { time: "04:00 PM", title: "Startup Pitch Battle", desc: "10 Startups, 1 Winner, $50k Prize.", type: "Competition" },
];

const SectionHeading = ({ title, subtitle, align = "center", theme = 'dark' }) => (
  <div className={`mb-16 ${align === "left" ? "text-left" : "text-center"}`}>
    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{title}</h2>
    <div className={`h-1.5 w-24 bg-blue-600 rounded-full mb-6 ${align === "left" ? "" : "mx-auto"}`}></div>
    {subtitle && <p className={`text-lg max-w-2xl leading-relaxed opacity-60 ${align === "left" ? "" : "mx-auto"}`}>{subtitle}</p>}
  </div>
);

const Navbar = ({ setPage, currentPage, lang, setLang, t, theme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      theme === 'light' ? (scrolled ? 'bg-white shadow-sm border-gray-200 py-3' : 'bg-transparent border-transparent py-5') : (scrolled ? 'bg-[#00040F]/80 backdrop-blur-xl border-white/10 py-3' : 'bg-transparent border-transparent py-5')
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('Home')}>
          <SummitLogo />
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-none ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>BAGHDAD</span>
            <span className="text-[10px] tracking-widest font-black uppercase text-blue-500">AI Summit 2026</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {Object.entries(t.nav).map(([key, label]) => (
            <button key={key} onClick={() => setPage(key.charAt(0).toUpperCase() + key.slice(1))} className={`text-sm font-bold transition-all hover:text-blue-500 ${currentPage.toLowerCase() === key.toLowerCase() ? 'text-blue-500' : (theme === 'light' ? 'text-gray-600' : 'text-gray-400')}`}>{label}</button>
          ))}
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full bg-white/5 border border-white/10"> {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} </button>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="text-xs font-bold border border-white/10 px-3 py-1 rounded-full">{lang === 'en' ? 'العربية' : 'English'}</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ setPage, t, lang, theme }) => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 text-xs font-black uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          {t.hero.date}
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"> {t.hero.title_prefix} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 italic">{t.hero.title_highlight}</span> </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl leading-relaxed">{t.hero.subtitle}</p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setPage('Agenda')} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center gap-2"> {t.hero.cta_agenda} <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} /> </button>
          <button onClick={() => setPage('About')} className="border-2 border-white/10 hover:bg-white/5 px-10 py-5 rounded-2xl font-black text-lg transition-all"> {t.hero.cta_watch} </button>
        </div>
      </div>
      <div className="hidden lg:block relative group">
        <div className="absolute inset-0 bg-blue-600/20 rounded-[3rem] blur-3xl group-hover:bg-blue-600/30 transition-all duration-700"></div>
        <div className="relative p-12 rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-blue-500">{t.hero.countdown_label}</h3>
          <CountdownTimer theme={theme} />
          <div className="mt-16 pt-16 border-t border-white/5 grid grid-cols-3 gap-8">
            <div><h4 className="text-4xl font-black mb-1 text-white">1K+</h4><p className="text-[10px] uppercase tracking-widest text-gray-500">{t.stats.attendees}</p></div>
            <div><h4 className="text-4xl font-black mb-1 text-white">30+</h4><p className="text-[10px] uppercase tracking-widest text-gray-500">{t.stats.speakers}</p></div>
            <div><h4 className="text-4xl font-black mb-1 text-white">50+</h4><p className="text-[10px] uppercase tracking-widest text-gray-500">{t.stats.exhibitors}</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Marquee = () => (
    <div className="py-8 bg-white/5 border-y border-white/5 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-scroll">
        {[...Array(20)].map((_, i) => (
          <React.Fragment key={i}>
            <span className="text-2xl font-black uppercase tracking-tighter mx-8 text-white/20">Baghdad AI Summit</span>
            <span className="text-blue-600 font-black mx-8">•</span>
          </React.Fragment>
        ))}
      </div>
      <style>{` @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } } .animate-scroll { display: inline-block; animation: scroll 60s linear infinite; } `}</style>
    </div>
);

const SpeakerCard = ({ speaker, theme }) => (
  <div className="group relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
    <div className="aspect-[4/5] grayscale group-hover:grayscale-0 transition-all duration-700">
      <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-1">{speaker.name}</h3>
      <p className="text-blue-500 font-black text-xs uppercase tracking-widest mb-4">{speaker.company}</p>
      <div className="pt-4 border-t border-white/5"> <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{speaker.role}</p> </div>
    </div>
  </div>
);

const AttendingNowCounter = ({ lang }) => {
    const [count, setCount] = useState(142);
    useEffect(() => {
      const timer = setInterval(() => setCount(p => p + (Math.random() > 0.5 ? 1 : -1)), 3000);
      return () => clearInterval(timer);
    }, []);
    return (
      <div className={`fixed top-28 ${lang === 'ar' ? 'left-8' : 'right-8'} z-40 hidden lg:flex items-center gap-3 bg-white/5 backdrop-blur-3xl border border-white/10 p-4 rounded-2xl shadow-2xl`}>
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <div> <p className="text-[10px] uppercase tracking-widest text-gray-500">{lang === 'ar' ? 'المشاهدون الآن' : 'Attending Now'}</p> <p className="text-xl font-black text-white">{count}</p> </div>
      </div>
    );
};

const HomePage = ({ setPage, t, lang, theme }) => (
  <>
    <AttendingNowCounter lang={lang} />
    <Hero setPage={setPage} t={t} lang={lang} theme={theme} />
    <Marquee />
    <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[ { end: 5000, label: t.stats.attendees, icon: Users }, { end: 120, label: t.stats.speakers, icon: Mic }, { end: 100, label: t.stats.exhibitors, icon: Store } ].map((stat, i) => {
        const { count, countRef } = useCounter(stat.end);
        return (
          <div key={i} ref={countRef} className="text-center p-12 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center mx-auto mb-6"> <stat.icon size={32} /> </div>
            <h4 className="text-5xl font-black mb-2">{count.toLocaleString()}+</h4>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
          </div>
        );
      })}
    </section>
    <section className="py-24 bg-gray-50 dark:bg-[#00030a] px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title={t.speakers.title} subtitle={t.speakers.subtitle} theme={theme} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {SPEAKERS.map((s, i) => (
            <RevealOnScroll key={s.id} delay={i * 100}> <SpeakerCard speaker={s} theme={theme} /> </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
    <section className="py-40 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 to-transparent opacity-20"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">Join the Future.</h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 font-light max-w-2xl mx-auto">The most influential AI gathering in Mesopotamia awaits you. Be part of the legacy.</p>
        <button onClick={() => setPage('Contact')} className="bg-white text-blue-600 px-16 py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95"> SECURE YOUR SPOT </button>
      </div>
    </section>
  </>
);

const AboutPage = ({ t, theme }) => (
  <div className="pt-40 pb-20 max-w-7xl mx-auto px-6">
    <SectionHeading title="Legacy of Wisdom" subtitle="Reclaiming Baghdad's place at the center of innovation." align="left" theme={theme} />
    <div className="grid lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-10 text-xl text-gray-400 font-light leading-relaxed">
        <p><span className="text-white font-bold">Baghdad.</span> A name synonymous with knowledge. The House of Wisdom was once the world's premier center for translation and innovation. The Baghdad AI Summit 2026 is the spiritual successor to that era.</p>
        <div className="grid md:grid-cols-2 gap-8 pt-10">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10"> <h4 className="text-white font-black text-3xl mb-4 italic">Vision</h4> <p className="text-sm">To be the primary catalyst for the digital and intellectual renaissance of Mesopotamia.</p> </div>
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10"> <h4 className="text-white font-black text-3xl mb-4 italic">Impact</h4> <p className="text-sm">Empowering the next generation of 10,000+ local innovators with cutting-edge AI skills.</p> </div>
        </div>
      </div>
      <div className="aspect-square relative rounded-[4rem] overflow-hidden border border-white/10">
        <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
      </div>
    </div>
  </div>
);

const AgendaPage = ({ theme }) => (
  <div className="pt-40 pb-20 max-w-7xl mx-auto px-6">
    <SectionHeading title="The Agenda" subtitle="Three days of deep dives into the artificial future." theme={theme} />
    <div className="max-w-4xl mx-auto space-y-12 relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block"></div>
      {AGENDA_ITEMS.map((item, i) => (
        <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
          <div className="md:w-1/2 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all">
            <span className="text-blue-500 font-mono text-xs font-black mb-2 block tracking-widest">{item.time}</span>
            <h3 className="text-2xl font-black mb-2 group-hover:text-blue-400">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed font-light italic">{item.desc}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-blue-600 hidden md:block relative z-10 shadow-[0_0_20px_rgba(37,99,235,1)]"></div>
          <div className="md:w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

const Footer = ({ theme }) => (
  <footer className="pt-32 pb-12 border-t border-white/5 bg-[#000208]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-8"> <SummitLogo /> <span className="font-black text-4xl text-white tracking-tighter uppercase">BAGHDAD AI</span> </div>
          <p className="text-gray-500 text-lg font-light leading-relaxed max-w-sm">The largest assembly of AI intelligence in Iraq. Shaping the destiny of Mesopotamia, one byte at a time.</p>
        </div>
        <div> <h4 className="text-white font-black text-xl mb-8 uppercase tracking-widest">Connect</h4> <ul className="space-y-4 text-gray-500 text-lg"> <li className="hover:text-blue-500 transition-colors cursor-pointer">Twitter</li> <li className="hover:text-blue-500 transition-colors cursor-pointer">LinkedIn</li> <li className="hover:text-blue-500 transition-colors cursor-pointer">Discord</li> </ul> </div>
        <div> <h4 className="text-white font-black text-xl mb-8 uppercase tracking-widest">Legacy</h4> <ul className="space-y-4 text-gray-500 text-lg"> <li className="hover:text-blue-500 transition-colors cursor-pointer">Our Mission</li> <li className="hover:text-blue-500 transition-colors cursor-pointer">Past Events</li> <li className="hover:text-blue-500 transition-colors cursor-pointer">Legal</li> </ul> </div>
      </div>
      <div className="pt-10 border-t border-white/5 text-center text-gray-700 text-xs font-bold uppercase tracking-widest"> &copy; 2026 Ai Dev Fest. All rights reserved. </div>
    </div>
  </footer>
);

const App = ({ route }) => {
  const [currentPage, setCurrentPage] = useState(route || 'Home');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [currentPage, lang]);
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  const t = CONTENT[lang];
  return (
    <div className={`min-h-screen font-sans selection:bg-blue-600 selection:text-white transition-colors duration-500 ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-[#00040F] text-white'} ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <Navbar setPage={setCurrentPage} currentPage={currentPage} lang={lang} setLang={setLang} t={t} theme={theme} setTheme={setTheme} />
      <main className="animate-fade-in pt-0">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          {currentPage === 'Home' && <HomePage setPage={setCurrentPage} t={t} lang={lang} theme={theme} />}
          {currentPage === 'About' && <AboutPage t={t} theme={theme} />}
          {currentPage === 'Agenda' && <AgendaPage theme={theme} />}
          {currentPage === 'Contact' && <ContactPage t={t} lang={lang} theme={theme} />}
        </Suspense>
      </main>
      <Footer theme={theme} />
      <Chatbot t={t} lang={lang} theme={theme} />
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed ${lang === 'ar' ? 'left-8' : 'right-8'} bottom-24 z-40 w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-2xl overflow-hidden`}><ArrowUp size={20} /></button>
    </div>
  );
};

export default App;
