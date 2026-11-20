// ════════════════════════════════════════════════════════════════
//  КОНТЕНТ САЙТА — редактируйте этот файл, чтобы заменить тексты,
//  контакты, фото и видео. Все места для замены помечены «ЗАМЕНИТЕ».
// ════════════════════════════════════════════════════════════════

export const site = {
  brand: "VEDUSHIY",
  // ЗАМЕНИТЕ: имя ведущего, как оно должно отображаться на сайте
  hostName: "Ваше Имя",
  role: "Ведущий мероприятий",
  city: "Душанбе",
  seo: {
    title: "VEDUSHIY — ведущий свадеб, юбилеев и корпоративов в Душанбе",
    description:
      "Профессиональное ведение мероприятий на таджикском, русском и английском языках. Свадьбы, юбилеи, корпоративы, выпускные и концерты. Соберите заявку за 2 минуты.",
    keywords: ["ведущий", "ведущий на свадьбу", "тамада Душанбе", "ведущий корпоратива", "ведущий юбилея", "ведущий Таджикистан"],
  },

  contacts: {
    // ЗАМЕНИТЕ: реальные контакты
    phone: "+992 00 000 00 00",
    whatsapp: "+992000000000", // только цифры, с кодом страны
    telegram: "vedushiy", // username без @
    instagram: "vedushiy", // username без @
    email: "",
  },

  hero: {
    titleLines: ["Создаю атмосферу.", "Объединяю людей.", "Делаю события незабываемыми."],
    subtitle:
      "Ваш праздник — это история, которая заслуживает идеального сценария. Профессиональное ведение мероприятий с эмоциями, стилем и индивидуальным подходом.",
    image: "/media/hero.jpg",
    // ЗАМЕНИТЕ: положите видео в public/media/hero.mp4 и укажите "/media/hero.mp4"
    video: "",
  },

  about: {
    image: "/media/about.jpg",
    eyebrow: "Обо мне",
    title: "Я не читаю сценарий. Я чувствую зал.",
    // ЗАМЕНИТЕ: ваша биография
    paragraphs: [
      "Хороший вечер не держится на конкурсах и громком микрофоне. Он держится на внимании: к паре, которая волнуется перед первым танцем, к бабушке, которая приехала издалека, к гостю, который весь вечер стесняется подойти к столу с подарком.",
      "Я веду мероприятия на таджикском и русском языках и выстраиваю программу вокруг людей, а не шаблона. До праздника — встречи, вопросы, ваша история. Во время — точный тайминг, связь с артистами, звуком и площадкой. После — ощущение, что всё прошло легко.",
      "Моя задача — чтобы вы не думали об организации ни минуты и прожили свой день полностью.",
    ],
    // ЗАМЕНИТЕ: реальные цифры
    stats: [
      { value: "10+", label: "лет на сцене" },
      { value: "500+", label: "проведённых событий" },
      { value: "3", label: "языка ведения" },
    ],
    qualities: ["Живая импровизация", "Безупречный тайминг", "Тактичный юмор", "Уважение к традициям"],
    philosophy: "Праздник удался, когда гости уходят с ощущением, что были частью чего-то настоящего.",
  },

  whyMe: [
    { icon: "ScrollText", title: "Индивидуальный сценарий", text: "Программа пишется под вашу историю, гостей и формат — без готовых шаблонов." },
    { icon: "ShieldCheck", title: "Профессиональный подход", text: "Договор, предварительные встречи, репетиция ключевых моментов и план Б на любой случай." },
    { icon: "Users", title: "Любая аудитория", text: "От камерного семейного ужина до зала на тысячу человек и официальной церемонии." },
    { icon: "Languages", title: "Несколько языков", text: "Таджикский, русский и английский — свободный переход между языками без потери темпа." },
    { icon: "Clock", title: "Контроль программы", text: "Тайминг вечера под контролем: ни затянутых пауз, ни скомканного финала." },
    { icon: "Handshake", title: "Команда вечера", text: "Слаженная работа с артистами, диджеем, фотографами, площадкой и организаторами." },
  ],

  portfolio: {
    // ЗАМЕНИТЕ: ваши фото в public/media/portfolio/
    photos: [
      { src: "/media/portfolio/01.jpg", alt: "Свадебный банкет", span: "tall" },
      { src: "/media/portfolio/02.jpg", alt: "Первый танец молодожёнов", span: "normal" },
      { src: "/media/portfolio/03.jpg", alt: "Корпоративный вечер", span: "wide" },
      { src: "/media/portfolio/04.jpg", alt: "Ведущий на сцене", span: "normal" },
      { src: "/media/portfolio/05.jpg", alt: "Юбилейный вечер", span: "tall" },
      { src: "/media/portfolio/06.jpg", alt: "Праздничный зал", span: "normal" },
      { src: "/media/portfolio/07.jpg", alt: "Выпускной", span: "normal" },
      { src: "/media/portfolio/08.jpg", alt: "Концертная площадка", span: "wide" },
      { src: "/media/portfolio/09.jpg", alt: "Гости праздника", span: "normal" },
      { src: "/media/portfolio/10.jpg", alt: "Детали декора", span: "tall" },
      { src: "/media/portfolio/11.jpg", alt: "Торжественный момент", span: "normal" },
      { src: "/media/portfolio/12.jpg", alt: "Финал вечера", span: "normal" },
    ] as { src: string; alt: string; span: "normal" | "tall" | "wide" }[],
    // ЗАМЕНИТЕ: youtubeId — часть ссылки после v= ; или src — путь к mp4 в public/media/videos/
    videos: [
      { title: "Свадьба: лучшие моменты", poster: "/media/videos/01.jpg", youtubeId: "", src: "" },
      { title: "Корпоратив: новогодняя ночь", poster: "/media/videos/02.jpg", youtubeId: "", src: "" },
      { title: "Юбилей: вечер в кругу семьи", poster: "/media/videos/03.jpg", youtubeId: "", src: "" },
      { title: "Шоурил ведущего", poster: "/media/videos/04.jpg", youtubeId: "", src: "" },
    ],
  },
};

export type SiteVideo = (typeof site.portfolio.videos)[number];

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.contacts.whatsapp.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
export const telegramLink = () => `https://t.me/${site.contacts.telegram}`;
export const instagramLink = () => `https://instagram.com/${site.contacts.instagram}`;
export const phoneLink = () => `tel:${site.contacts.phone.replace(/[^\d+]/g, "")}`;
