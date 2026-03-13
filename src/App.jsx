import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  Code2,
  Eye,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

// === МАППИНГ ИКОНОК ===
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

// === ДЕФОЛТНАЯ СТРУКТУРА ДЛЯ РЕДАКТОРА ===
const fallbackData = {
  name: "Павел Дуров",
  bio: "Разрабатываю будущее коммуникаций. Свобода и приватность прежде всего.",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
  verified: true,
  config: {
    fontFamily: "sans",
    avatarShape: "rounded-full",
    cardWidth: "max-w-[420px]",
    spacing: "gap-4",
    "disable-highlight-text": true, 
    "disable-context-menu": true,
    buttonAnimation: "glow",
    cardEffect: "3d-tilt"
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
    { title: "Связаться", url: "mailto:contact@telegram.org", icon: "mail" }
  ]
};

// === КОМПОНЕНТ САМОЙ КАРТОЧКИ (Для переиспользования в Preview и View Mode) ===
const BioCard = ({ data }) => {
  const cardRef = useRef(null);
  const { theme, config, links, name, bio, avatar, verified } = data;
  
  const isTextSelectDisabled = config?.["disable-highlight-text"];
  const isContextMenuDisabled = config?.["disable-context-menu"];

  const handleCardMouseMove = (e) => {
    if (config?.cardEffect !== '3d-tilt') return;
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleCardMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  const handleCardMouseEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.1s ease-out';
  };

  const getButtonAnimation = (type) => {
    switch (type) {
      case 'scale': return 'hover:scale-105 active:scale-95 transition-transform duration-300';
      case 'lift': return 'hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] active:translate-y-0 transition-all duration-300';
      case 'glow': return 'hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-white/10 transition-all duration-300';
      case 'neon': return 'hover:border-blue-400 hover:shadow-[0_0_15px_rgba(96,165,250,0.8),inset_0_0_15px_rgba(96,165,250,0.4)] transition-all duration-300';
      case 'bounce': return 'hover:animate-bounce';
      default: return 'hover:-translate-y-1 active:scale-95 transition-all duration-300';
    }
  };

  return (
    <div 
      className={`w-full flex items-center justify-center font-${config?.fontFamily || 'sans'} ${isTextSelectDisabled ? 'select-none' : ''}`}
      onContextMenu={(e) => { if (isContextMenuDisabled) e.preventDefault(); }}
    >
      <main 
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        onMouseEnter={handleCardMouseEnter}
        className={`w-full ${config?.cardWidth || 'max-w-md'} ${theme?.card} rounded-[2.5rem] p-10 flex flex-col items-center z-10`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative mb-6 group" style={{ transform: 'translateZ(30px)' }}>
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 ${config?.avatarShape || 'rounded-full'} blur opacity-25 group-hover:opacity-60 transition duration-500 group-hover:duration-200`}></div>
          <img 
            src={avatar} 
            alt={name}
            draggable={!isTextSelectDisabled} 
            className={`relative w-32 h-32 object-cover border-4 border-white/10 ${config?.avatarShape || 'rounded-full'} shadow-2xl transition-transform duration-500 group-hover:scale-105`}
          />
        </div>

        <div className="text-center w-full mb-10" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className={`text-3xl font-black tracking-tight ${theme?.text}`}>{name}</h1>
            {verified && (
              <svg className="w-6 h-6 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
              </svg>
            )}
          </div>
          <p className={`text-base font-medium leading-relaxed opacity-90 ${theme?.bioText || theme?.text}`}>{bio}</p>
        </div>

        <div className={`w-full flex flex-col ${config?.spacing || 'gap-3'}`} style={{ transform: 'translateZ(10px)' }}>
          {links?.map((link, index) => {
            const IconComponent = iconMap[link.icon?.toLowerCase()] || iconMap.default;
            const animClasses = getButtonAnimation(config?.buttonAnimation);

            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                draggable={!isTextSelectDisabled}
                className={`
                  relative overflow-hidden flex items-center p-5 rounded-2xl group
                  ${link.highlight ? 'bg-blue-600/20 border border-blue-500/30' : (theme?.button || 'bg-white/5 border border-white/5')}
                  ${theme?.buttonText || 'text-white'}
                  ${animClasses}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out"></div>
                <div className={`flex-shrink-0 transition-colors ${theme?.iconColor || 'opacity-70 group-hover:opacity-100'}`}>
                  {IconComponent}
                </div>
                <span className="flex-1 text-center font-bold text-sm uppercase tracking-widest relative z-10">
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
};


// === ОСНОВНОЙ КОМПОНЕНТ ===
export default function App() {
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [profileData, setProfileData] = useState(fallbackData);
  const [editorText, setEditorText] = useState(JSON.stringify(fallbackData, null, 2));
  const [jsonError, setJsonError] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Глобальное отслеживание мыши для динамического фона
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Логика роутинга (Редактор или Просмотр профиля)
  useEffect(() => {
    let pathName = window.location.pathname.replace('/', '');
    
    // Если на главной - открываем редактор
    if (!pathName || pathName.includes('index.html') || pathName.includes('run')) {
      setIsEditorMode(true);
      setLoading(false);
    } else {
      // Иначе пытаемся загрузить профиль
      setIsEditorMode(false);
      if (!pathName.endsWith('.bio')) pathName = `${pathName}.bio`;
      fetchBio(pathName);
    }
  }, []);

  const fetchBio = async (fileToFetch) => {
    setLoading(true);
    try {
      const response = await fetch(`https://files.catbox.moe/${fileToFetch}`);
      if (!response.ok) throw new Error('Файл не найден');
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setFetchError(`Профиль не найден. Показан демонстрационный профиль.`);
      setProfileData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (e) => {
    const val = e.target.value;
    setEditorText(val);
    try {
      const parsed = JSON.parse(val);
      setProfileData(parsed);
      setJsonError('');
    } catch (err) {
      setJsonError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // === РЕНДЕР РЕЖИМА РЕДАКТОРА (ГЛАВНАЯ СТРАНИЦА) ===
  if (isEditorMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
        
        {/* Шапка редактора */}
        <header className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bio.js Editor</h1>
              <p className="text-sm text-slate-400">Создай свой идеальный профиль через JSON</p>
            </div>
          </div>
          <a href="#docs" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
            <BookOpen className="w-4 h-4" /> Документация
          </a>
        </header>

        {/* Сетка: Редактор и Предпросмотр */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Левая панель: JSON Редактор */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" /> Код конфигурации
              </h2>
              {jsonError ? (
                <span className="text-xs font-medium text-red-400 bg-red-400/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Ошибка синтаксиса
                </span>
              ) : (
                <span className="text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> JSON Валиден
                </span>
              )}
            </div>
            <textarea
              value={editorText}
              onChange={handleEditorChange}
              spellCheck={false}
              className={`w-full h-[600px] bg-[#0f111a] text-emerald-400 font-mono text-sm p-6 rounded-2xl border ${jsonError ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-blue-500/50'} outline-none resize-none shadow-inner custom-scrollbar transition-colors`}
            />
          </div>

          {/* Правая панель: Live Preview */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" /> Live Предпросмотр
            </h2>
            <div 
              className={`relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center transition-colors duration-700 ${profileData.theme?.background}`}
              style={{
                backgroundSize: '150% 150%',
                backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                transition: 'background-position 0.2s ease-out'
              }}
            >
              <div className="w-full h-full overflow-y-auto custom-scrollbar p-4 flex items-center">
                <BioCard data={profileData} />
              </div>
            </div>
          </div>
        </div>

        {/* ДОКУМЕНТАЦИЯ */}
        <div id="docs" className="max-w-7xl mx-auto mt-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl mb-20">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-white">Документация</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-300">
            {/* Базовые поля */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">1. Базовая информация</h3>
              <ul className="space-y-4">
                <li><code className="bg-slate-800 px-2 py-1 rounded text-blue-300">name</code>: Ваше имя / Никнейм.</li>
                <li><code className="bg-slate-800 px-2 py-1 rounded text-blue-300">bio</code>: Краткое описание под именем.</li>
                <li><code className="bg-slate-800 px-2 py-1 rounded text-blue-300">avatar</code>: Прямая ссылка на фото (URL).</li>
                <li><code className="bg-slate-800 px-2 py-1 rounded text-blue-300">verified</code>: <code className="text-emerald-400">true/false</code> (показывает галочку).</li>
              </ul>
            </div>

            {/* Config */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">2. Настройки (config)</h3>
              <ul className="space-y-3">
                <li><code className="text-blue-300">fontFamily</code>: <span className="text-sm">"sans", "serif", "mono"</span></li>
                <li><code className="text-blue-300">avatarShape</code>: <span className="text-sm">"rounded-full" (круг), "rounded-2xl", "rounded-none"</span></li>
                <li><code className="text-blue-300">buttonAnimation</code>: <span className="text-sm text-yellow-300">"scale", "lift", "glow", "neon", "bounce", "default"</span></li>
                <li><code className="text-blue-300">cardEffect</code>: <span className="text-sm">"none", "3d-tilt" (наклон от мыши)</span></li>
                <li><code className="text-blue-300">disable-highlight-text</code>: Запрещает выделять текст мышью.</li>
                <li><code className="text-blue-300">disable-context-menu</code>: Отключает правую кнопку мыши.</li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">3. Ссылки (links)</h3>
              <p className="text-sm mb-3">Массив объектов ссылок. Поддерживаемые иконки (поле <code>icon</code>):</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(iconMap).map(icon => (
                  <span key={icon} className="px-2 py-1 bg-slate-800 rounded text-xs">{icon}</span>
                ))}
              </div>
              <p className="text-sm">Если добавить <code>"highlight": true</code>, кнопка будет подсвечена акцентным цветом.</p>
            </div>

            {/* Theme */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">4. Темизация (theme)</h3>
              <p className="text-sm mb-3">Используются классы <a href="https://tailwindcss.com/docs" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Tailwind CSS</a>.</p>
              <ul className="space-y-2 text-sm">
                <li><code className="text-blue-300">background</code>: Фон страницы (цвета, градиенты).</li>
                <li><code className="text-blue-300">card</code>: Цвет и размытие самой карточки профиля.</li>
                <li><code className="text-blue-300">button</code>: Цвет обычных кнопок.</li>
                <li><code className="text-blue-300">text / bioText</code>: Цвета шрифтов.</li>
              </ul>
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        `}} />
      </div>
    );
  }

  // === РЕНДЕР РЕЖИМА ПРОСМОТРА ПРОФИЛЯ ===
  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center py-12 px-6 transition-colors duration-700 ${profileData.theme?.background}`}
      style={{
        backgroundSize: '150% 150%',
        backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
        transition: 'background-position 0.2s ease-out'
      }}
    >
      {fetchError && (
        <div className="fixed top-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-xs backdrop-blur-md flex items-center gap-2 z-50">
          <AlertCircle className="w-4 h-4" /> {fetchError}
        </div>
      )}
      <BioCard data={profileData} />
    </div>
  );
}
