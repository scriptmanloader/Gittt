import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Globe, 
  Send, 
  Youtube,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

// === РАСШИРЕННЫЙ МАППИНГ ИКОНОК ===
const iconMap = {
  github: <Github className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
  telegram: <Send className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  default: <ExternalLink className="w-5 h-5" />
};

// === ПРИМЕР НОВОЙ КАСТОМНОЙ СТРУКТУРЫ ===
const fallbackData = {
  name: "Павел Дуров",
  bio: "Разрабатываю будущее коммуникаций. Свобода и приватность прежде всего.",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
  verified: true, // Новое поле для галочки
  config: {
    fontFamily: "sans-serif", // 'sans', 'serif', 'mono'
    avatarShape: "rounded-full", // 'rounded-full', 'rounded-2xl', 'rounded-none'
    cardWidth: "max-w-[420px]",
    spacing: "gap-4"
  },
  theme: {
    background: "bg-gradient-to-tr from-[#0f172a] via-[#1e1b4b] to-[#020617]",
    card: "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]",
    text: "text-white",
    bioText: "text-slate-400",
    button: "bg-white/5 hover:bg-white/10 border border-white/5 shadow-sm",
    buttonText: "text-slate-100",
    iconColor: "text-blue-400"
  },
  links: [
    { title: "Официальный канал", url: "https://t.me", icon: "telegram", highlight: true },
    { title: "Личный блог", url: "https://example.com", icon: "website" },
    { title: "GitHub Projects", url: "https://github.com", icon: "github" },
    { title: "Связаться напрямую", url: "mailto:contact@telegram.org", icon: "mail" }
  ]
};

export default function App() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBio = async (fileToFetch) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://files.catbox.moe/${fileToFetch}`);
      if (!response.ok) throw new Error('Файл не найден');
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error(err);
      setError(`Файл ${fileToFetch} не загружен. Используем кастомный шаблон.`);
      setProfileData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let pathName = window.location.pathname.replace('/', '');
    if (!pathName || pathName.includes('index.html') || pathName.includes('run')) {
      pathName = 'pavel.bio';
    } else if (!pathName.endsWith('.bio')) {
      pathName = `${pathName}.bio`;
    }
    fetchBio(pathName);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const { theme, config, links, name, bio, avatar, verified } = profileData || fallbackData;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center py-12 px-6 transition-all duration-700 ${theme?.background} font-${config?.fontFamily || 'sans'}`}>
      
      {error && (
        <div className="fixed top-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-xs backdrop-blur-md flex items-center gap-2 z-50">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <main className={`w-full ${config?.cardWidth || 'max-w-md'} ${theme?.card} rounded-[2.5rem] p-10 flex flex-col items-center transition-transform duration-500`}>
        
        {/* Аватар с динамической формой */}
        <div className="relative mb-6 group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 ${config?.avatarShape || 'rounded-full'} blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
          <div className="relative">
            <img 
              src={avatar} 
              alt={name}
              className={`w-32 h-32 object-cover border-4 border-white/10 ${config?.avatarShape || 'rounded-full'} shadow-2xl`}
            />
          </div>
        </div>

        {/* Заголовок и Био */}
        <div className="text-center w-full mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className={`text-3xl font-black tracking-tight ${theme?.text}`}>
              {name}
            </h1>
            {verified && (
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
              </svg>
            )}
          </div>
          <p className={`text-base font-medium leading-relaxed opacity-90 ${theme?.bioText || theme?.text}`}>
            {bio}
          </p>
        </div>

        {/* Ссылки с расширенной кастомизацией */}
        <div className={`w-full flex flex-col ${config?.spacing || 'gap-3'}`}>
          {links?.map((link, index) => {
            const IconComponent = iconMap[link.icon?.toLowerCase()] || iconMap.default;
            const isHighlighted = link.highlight;

            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  relative overflow-hidden flex items-center p-5 rounded-2xl transition-all duration-300
                  transform hover:-translate-y-1 active:scale-95 group
                  ${isHighlighted ? 'bg-blue-600/20 border border-blue-500/30' : (theme?.button || 'bg-white/5')}
                  ${theme?.buttonText || 'text-white'}
                `}
              >
                {/* Эффект свечения при ховере */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className={`flex-shrink-0 transition-colors ${theme?.iconColor || 'opacity-70 group-hover:opacity-100'}`}>
                  {IconComponent}
                </div>
                
                <span className="flex-1 text-center font-bold text-sm uppercase tracking-widest">
                  {link.title}
                </span>

                <div className="w-5 h-5 flex-shrink-0 opacity-20 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}