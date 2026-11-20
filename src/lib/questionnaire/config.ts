// Конфигурация вопросов конструктора заявки.
// Каждая ветка мероприятия = свои шаги + общие шаги (язык, место, артисты, дата, стиль, контакты).
// Поля, скрытые условием showIf, не показываются и не сохраняются.

import type { EventTypeId, Field, FieldOption, Step } from "./types";

export const EVENT_TYPES: (FieldOption & { value: EventTypeId })[] = [
  { value: "wedding", label: "Свадьба", description: "Туй, никох, банкет", icon: "Heart" },
  { value: "birthday", label: "День рождения", description: "Взрослый или детский праздник", icon: "Cake" },
  { value: "anniversary", label: "Юбилей", description: "Личный или юбилей компании", icon: "Crown" },
  { value: "corporate", label: "Корпоратив", description: "Новый год, тимбилдинг, форум", icon: "Building2" },
  { value: "graduation", label: "Выпускной", description: "Школа, колледж, университет", icon: "GraduationCap" },
  { value: "concert", label: "Концерт", description: "Сцена, фестиваль, городской праздник", icon: "Mic" },
  { value: "other", label: "Другое мероприятие", description: "Расскажите, что задумали", icon: "Sparkles" },
];

export const EVENT_TYPE_IDS = EVENT_TYPES.map((e) => e.value);

export function isEventTypeId(v: unknown): v is EventTypeId {
  return typeof v === "string" && (EVENT_TYPE_IDS as string[]).includes(v);
}

const YES_NO_UNSURE: FieldOption[] = [
  { value: "yes", label: "Да" },
  { value: "no", label: "Нет" },
  { value: "unsure", label: "Пока не знаю" },
];

// ─────────────────────────── Шаг 1 ───────────────────────────
const eventTypeStep: Step = {
  id: "eventType",
  title: "Для какого мероприятия вам нужен ведущий?",
  subtitle: "Выберите формат — следующие вопросы подстроятся под него.",
  autoAdvance: true,
  fields: [{ id: "eventType", type: "choice", label: "Тип мероприятия", required: true, options: EVENT_TYPES, columns: 4 }],
};

// ─────────────────────────── Свадьба ───────────────────────────
const weddingSteps: Step[] = [
  {
    id: "weddingFormat",
    title: "Какой формат ведения вы рассматриваете?",
    subtitle: "Можно выбрать «Пока не определились» — подскажем на консультации.",
    fields: [
      {
        id: "hostFormat",
        type: "choice",
        label: "Формат ведения",
        required: true,
        columns: 2,
        options: [
          { value: "single", label: "Один ведущий", icon: "User" },
          { value: "two", label: "Два ведущих", icon: "Users" },
          { value: "duo", label: "Ведущий и ведущая", icon: "HeartHandshake" },
          { value: "undecided", label: "Пока не определились", description: "Нужна консультация", icon: "CircleHelp" },
        ],
      },
      {
        id: "wantsConsultation",
        type: "checkbox",
        label: "Да, хочу бесплатную консультацию по формату ведения",
        showIf: { field: "hostFormat", in: ["undecided"] },
      },
    ],
  },
  {
    id: "weddingCoHost",
    title: "Есть ли у вас уже второй ведущий?",
    subtitle: "Если хотите, чтобы вечер вёл один человек, — просто отметьте это.",
    showIf: { field: "hostFormat", in: ["two", "duo", "undecided"] },
    fields: [
      {
        id: "coHost",
        type: "choice",
        label: "Второй ведущий",
        required: true,
        columns: 2,
        options: [
          { value: "have", label: "Да, уже есть", icon: "UserCheck" },
          { value: "find", label: "Нет, хочу найти", description: "Подберём пару под ваш вечер", icon: "UserPlus" },
          { value: "unsure", label: "Пока не знаю", icon: "CircleHelp" },
          { value: "single_only", label: "Рассматриваю только одного ведущего", icon: "User" },
        ],
      },
      { id: "coHostName", type: "text", label: "Имя второго ведущего", placeholder: "Необязательно", half: true, maxLength: 120, showIf: { field: "coHost", in: ["have"] } },
      { id: "coHostContact", type: "text", label: "Контакт второго ведущего", placeholder: "Телефон или @telegram (необязательно)", half: true, maxLength: 120, showIf: { field: "coHost", in: ["have"] } },
      {
        id: "coHostGender",
        type: "choice",
        label: "Кого ищем в пару?",
        columns: 3,
        showIf: { field: "coHost", in: ["find"] },
        options: [
          { value: "female", label: "Ведущую" },
          { value: "male", label: "Ведущего" },
          { value: "any", label: "Не важно" },
        ],
      },
      { id: "coHostLanguage", type: "text", label: "На каком языке должен вести второй ведущий?", placeholder: "Например: таджикский", maxLength: 120, showIf: { field: "coHost", in: ["find"] } },
      { id: "coHostWishes", type: "textarea", label: "Пожелания ко второму ведущему", placeholder: "Возраст, стиль, опыт, чувство юмора…", maxLength: 1000, showIf: { field: "coHost", in: ["find"] } },
      { id: "coHostConsult", type: "checkbox", label: "Хочу консультацию — помогите определиться", showIf: { field: "coHost", in: ["unsure"] } },
    ],
  },
  {
    id: "weddingProgram",
    title: "Что войдёт в свадебную программу?",
    subtitle: "Отметьте всё, что планируете. Детали обсудим лично.",
    fields: [
      { id: "coupleNames", type: "text", label: "Имена жениха и невесты", placeholder: "Например: Фарход и Мадина", maxLength: 160 },
      {
        id: "weddingParts",
        type: "multichoice",
        label: "Части программы",
        columns: 2,
        options: [
          { value: "meeting", label: "Торжественная встреча молодожёнов" },
          { value: "ceremony", label: "Выездная церемония / регистрация" },
          { value: "banquet", label: "Банкетная программа" },
          { value: "firstDance", label: "Первый танец" },
          { value: "traditions", label: "Национальные традиции и обряды" },
          { value: "interactive", label: "Интерактив и конкурсы" },
        ],
      },
    ],
  },
];

// ─────────────────────────── День рождения ───────────────────────────
const birthdaySteps: Step[] = [
  {
    id: "birthdayDetails",
    title: "Расскажите об имениннике",
    subtitle: "Это поможет подобрать тон, юмор и интерактив.",
    fields: [
      { id: "celebrantName", type: "text", label: "Имя именинника", placeholder: "Необязательно", half: true, maxLength: 120 },
      { id: "celebrantAge", type: "number", label: "Сколько исполняется лет?", required: true, min: 1, max: 120, half: true, inputMode: "numeric" },
      {
        id: "partyFormat",
        type: "choice",
        label: "Формат праздника",
        required: true,
        columns: 3,
        options: [
          { value: "banquet", label: "Банкет в ресторане", icon: "Wine" },
          { value: "home", label: "Домашний праздник", icon: "House" },
          { value: "outdoor", label: "На природе / за городом", icon: "TreePine" },
          { value: "themed", label: "Тематическая вечеринка", icon: "PartyPopper" },
          { value: "kids", label: "Детский праздник", icon: "Baby" },
          { value: "surprise", label: "Праздник-сюрприз", icon: "Gift" },
        ],
      },
    ],
  },
];

// ─────────────────────────── Юбилей ───────────────────────────
const anniversarySteps: Step[] = [
  {
    id: "anniversaryDetails",
    title: "Какой юбилей празднуем?",
    fields: [
      {
        id: "jubileeKind",
        type: "choice",
        label: "Тип юбилея",
        required: true,
        columns: 3,
        options: [
          { value: "personal", label: "Личный юбилей", icon: "Crown" },
          { value: "family", label: "Годовщина свадьбы", icon: "Heart" },
          { value: "company", label: "Юбилей компании", icon: "Building2" },
        ],
      },
      { id: "celebrantName", type: "text", label: "Имя юбиляра / название компании", placeholder: "Необязательно", half: true, maxLength: 160 },
      { id: "jubileeAge", type: "number", label: "Какая дата отмечается? (лет)", required: true, min: 1, max: 150, half: true, inputMode: "numeric" },
      {
        id: "anniversaryFormat",
        type: "choice",
        label: "Формат вечера",
        columns: 3,
        options: [
          { value: "banquet", label: "Банкет" },
          { value: "gala", label: "Торжественный вечер" },
          { value: "family", label: "Камерный семейный ужин" },
        ],
      },
    ],
  },
];

// ─────────────────────────── Корпоратив ───────────────────────────
const corporateSteps: Step[] = [
  {
    id: "corporateCompany",
    title: "Расскажите о компании",
    fields: [
      { id: "companyName", type: "text", label: "Название компании", required: true, maxLength: 160, autoComplete: "organization" },
      { id: "contactPosition", type: "text", label: "Ваша должность", placeholder: "Необязательно", half: true, maxLength: 120 },
      { id: "employees", type: "number", label: "Количество сотрудников на мероприятии", required: true, min: 1, max: 100000, half: true, inputMode: "numeric" },
    ],
  },
  {
    id: "corporateFormat",
    title: "Какой формат корпоратива?",
    fields: [
      {
        id: "corporateFormat",
        type: "choice",
        label: "Формат",
        required: true,
        columns: 3,
        options: [
          { value: "newyear", label: "Новогодний корпоратив", icon: "Sparkles" },
          { value: "anniversary", label: "Юбилей компании", icon: "Award" },
          { value: "teambuilding", label: "Тимбилдинг", icon: "Users" },
          { value: "conference", label: "Конференция / форум", icon: "Presentation" },
          { value: "awards", label: "Церемония награждения", icon: "Trophy" },
          { value: "party", label: "Корпоративная вечеринка", icon: "PartyPopper" },
          { value: "other", label: "Другой формат", icon: "CircleHelp" },
        ],
      },
      { id: "corporateFormatOther", type: "text", label: "Опишите формат", required: true, maxLength: 200, showIf: { field: "corporateFormat", in: ["other"] } },
      { id: "officialPart", type: "choice", label: "Будет ли официальная часть?", required: true, columns: 3, options: YES_NO_UNSURE },
      {
        id: "officialPartDetails",
        type: "textarea",
        label: "Что входит в официальную часть?",
        placeholder: "Выступления руководства, награждения, презентации…",
        maxLength: 1000,
        showIf: { field: "officialPart", in: ["yes"] },
      },
    ],
  },
];

// ─────────────────────────── Выпускной ───────────────────────────
const graduationSteps: Step[] = [
  {
    id: "graduationDetails",
    title: "Расскажите о выпускном",
    fields: [
      {
        id: "institutionType",
        type: "choice",
        label: "Учебное заведение",
        required: true,
        columns: 3,
        options: [
          { value: "kindergarten", label: "Детский сад" },
          { value: "school", label: "Школа" },
          { value: "college", label: "Колледж / лицей" },
          { value: "university", label: "Университет" },
          { value: "courses", label: "Курсы / академия" },
        ],
      },
      { id: "institutionName", type: "text", label: "Название учебного заведения", placeholder: "Необязательно", half: true, maxLength: 160 },
      { id: "graduatesCount", type: "number", label: "Количество выпускников", required: true, min: 1, max: 10000, half: true, inputMode: "numeric" },
      { id: "parentsAttend", type: "choice", label: "Будут ли родители и педагоги?", columns: 3, options: YES_NO_UNSURE },
      {
        id: "graduationParts",
        type: "multichoice",
        label: "Что планируется?",
        columns: 2,
        options: [
          { value: "ceremony", label: "Торжественное вручение дипломов" },
          { value: "banquet", label: "Банкет" },
          { value: "show", label: "Шоу-программа и интерактив" },
          { value: "dawn", label: "Встреча рассвета" },
        ],
      },
    ],
  },
];

// ─────────────────────────── Концерт ───────────────────────────
const concertSteps: Step[] = [
  {
    id: "concertDetails",
    title: "Что за концерт или сценическое событие?",
    fields: [
      {
        id: "concertType",
        type: "choice",
        label: "Тип события",
        required: true,
        columns: 3,
        options: [
          { value: "solo", label: "Сольный концерт артиста", icon: "Mic" },
          { value: "festival", label: "Фестиваль", icon: "Music" },
          { value: "city", label: "Городской праздник", icon: "Landmark" },
          { value: "charity", label: "Благотворительный вечер", icon: "HeartHandshake" },
          { value: "awards", label: "Премия / церемония", icon: "Trophy" },
          { value: "other", label: "Другое", icon: "CircleHelp" },
        ],
      },
      { id: "organizerName", type: "text", label: "Организатор / компания", maxLength: 160, half: true },
      {
        id: "audienceSize",
        type: "choice",
        label: "Ожидаемое количество зрителей",
        required: true,
        columns: 4,
        options: [
          { value: "lt200", label: "До 200" },
          { value: "200_500", label: "200–500" },
          { value: "500_1000", label: "500–1000" },
          { value: "gt1000", label: "Более 1000" },
        ],
      },
      {
        id: "hostRole",
        type: "multichoice",
        label: "Задачи ведущего",
        columns: 2,
        options: [
          { value: "announce", label: "Объявление номеров" },
          { value: "crowd", label: "Работа с залом" },
          { value: "official", label: "Официальная часть" },
          { value: "interviews", label: "Интервью и бэкстейдж" },
        ],
      },
      { id: "rehearsal", type: "choice", label: "Нужна ли репетиция с ведущим?", columns: 3, options: YES_NO_UNSURE },
    ],
  },
];

// ─────────────────────────── Другое ───────────────────────────
const otherSteps: Step[] = [
  {
    id: "otherDetails",
    title: "Расскажите о вашем событии",
    subtitle: "Презентация, открытие, помолвка, вечер выпускников — любой формат.",
    fields: [
      { id: "eventName", type: "text", label: "Как называется событие?", required: true, placeholder: "Например: открытие ресторана", maxLength: 160 },
      { id: "eventDescription", type: "textarea", label: "Коротко опишите идею", required: true, placeholder: "Что за событие, кто гости, какая задача у ведущего…", maxLength: 2000 },
    ],
  },
];

const BRANCHES: Record<EventTypeId, Step[]> = {
  wedding: weddingSteps,
  birthday: birthdaySteps,
  anniversary: anniversarySteps,
  corporate: corporateSteps,
  graduation: graduationSteps,
  concert: concertSteps,
  other: otherSteps,
};

// ─────────────────────────── Общие шаги ───────────────────────────
const languageStep: Step = {
  id: "language",
  title: "На каком языке будет проходить мероприятие?",
  fields: [
    {
      id: "language",
      type: "choice",
      label: "Язык",
      required: true,
      columns: 3,
      options: [
        { value: "tj", label: "Таджикский" },
        { value: "ru", label: "Русский" },
        { value: "tj_ru", label: "Таджикский и русский" },
        { value: "en", label: "Английский" },
        { value: "other", label: "Другой" },
      ],
    },
    { id: "languageOther", type: "text", label: "Укажите язык", required: true, maxLength: 80, showIf: { field: "language", in: ["other"] } },
  ],
};

function venueStep(type: EventTypeId | undefined): Step {
  const notUndecided = { not: { field: "venueUndecided", equals: true } } as const;
  return {
    id: "venue",
    title: "Где планируется мероприятие?",
    fields: [
      {
        id: "venueName",
        type: "text",
        label: type === "concert" ? "Название площадки" : "Название ресторана или площадки",
        required: true,
        maxLength: 160,
        showIf: notUndecided,
      },
      { id: "city", type: "text", label: "Город", placeholder: "Душанбе", half: true, maxLength: 80, autoComplete: "address-level2" },
      { id: "address", type: "text", label: "Адрес", placeholder: "Необязательно", half: true, maxLength: 200, showIf: notUndecided },
      { id: "venueUndecided", type: "checkbox", label: "Место пока не определено" },
    ],
  };
}

const ARTISTS_SHOWN = { field: "artistsCount", in: ["one", "two", "three_plus"] };

const artistsStep: Step = {
  id: "artists",
  title: "Планируется ли участие артистов?",
  subtitle: "Ведущий выстроит программу так, чтобы выступления органично вписались в вечер.",
  fields: [
    {
      id: "artistsCount",
      type: "choice",
      label: "Артисты",
      required: true,
      columns: 3,
      options: [
        { value: "none", label: "Нет" },
        { value: "one", label: "Один артист" },
        { value: "two", label: "Два артиста" },
        { value: "three_plus", label: "Три и более" },
        { value: "unknown", label: "Пока неизвестно" },
      ],
    },
    { id: "artistNames", type: "text", label: "Имена артистов", placeholder: "Если уже известны", maxLength: 300, showIf: ARTISTS_SHOWN },
    { id: "performancesCount", type: "number", label: "Количество выходов", min: 1, max: 50, half: true, inputMode: "numeric", showIf: ARTISTS_SHOWN },
    { id: "artistWishes", type: "textarea", label: "Пожелания по развлекательной программе", maxLength: 1000, showIf: ARTISTS_SHOWN },
  ],
};

function guestsLabel(type: EventTypeId | undefined): string {
  switch (type) {
    case "corporate":
      return "Общее количество участников";
    case "concert":
      return "Количество гостей в VIP-зоне / на банкете (если есть)";
    case "graduation":
      return "Общее количество гостей";
    default:
      return "Количество гостей";
  }
}

function dateTimeStep(type: EventTypeId | undefined): Step {
  return {
    id: "dateTime",
    title: "Когда состоится мероприятие?",
    subtitle: "Проверим, свободна ли дата.",
    fields: [
      { id: "eventDate", type: "date", label: "Дата мероприятия", required: true, half: true, showIf: { not: { field: "dateFlexible", equals: true } } },
      { id: "approxPeriod", type: "text", label: "Примерный период", placeholder: "Например: июнь 2027", required: true, half: true, maxLength: 80, showIf: { field: "dateFlexible", equals: true } },
      { id: "startTime", type: "time", label: "Время начала", half: true },
      { id: "dateFlexible", type: "checkbox", label: "Точная дата пока не известна" },
      {
        id: "duration",
        type: "choice",
        label: "Предполагаемая продолжительность",
        columns: 3,
        options: [
          { value: "lt2", label: "До 2 часов" },
          { value: "3_4", label: "3–4 часа" },
          { value: "5_6", label: "5–6 часов" },
          { value: "gt6", label: "Более 6 часов" },
          { value: "unknown", label: "Пока неизвестно" },
        ],
      },
      { id: "guests", type: "number", label: guestsLabel(type), required: type !== "concert", min: 1, max: 100000, half: true, inputMode: "numeric" },
    ],
  };
}

const styleStep: Step = {
  id: "style",
  title: "Каким вы представляете своё мероприятие?",
  subtitle: "Выберите настроение — и поделитесь мечтами в свободной форме.",
  fields: [
    {
      id: "style",
      type: "choice",
      label: "Стиль проведения",
      columns: 3,
      options: [
        { value: "classic", label: "Элегантное и классическое", icon: "Gem" },
        { value: "modern", label: "Современное и динамичное", icon: "Zap" },
        { value: "fun", label: "Весёлое и интерактивное", icon: "Smile" },
        { value: "premium", label: "Премиальное и торжественное", icon: "Crown" },
        { value: "national", label: "Национальное и традиционное", icon: "Landmark" },
        { value: "undecided", label: "Пока нет представления", icon: "CircleHelp" },
      ],
    },
    { id: "wishes", type: "textarea", label: "Особые пожелания", placeholder: "Атмосфера, важные моменты, что точно не нужно…", maxLength: 2000 },
    { id: "hostRequirements", type: "textarea", label: "Особые требования к ведущему", placeholder: "Дресс-код, языки, тайминг, согласование сценария…", maxLength: 1000 },
  ],
};

const contactsStep: Step = {
  id: "contacts",
  title: "Остался последний шаг",
  subtitle: "Оставьте контакты — ведущий свяжется с вами, чтобы обсудить детали.",
  fields: [
    { id: "clientName", type: "text", label: "Ваше имя", required: true, maxLength: 120, autoComplete: "name", half: true },
    { id: "phone", type: "tel", label: "Номер телефона", required: true, placeholder: "+992 ___ __ __ __", autoComplete: "tel", inputMode: "tel", half: true },
    { id: "whatsappSame", type: "checkbox", label: "WhatsApp на этом же номере" },
    { id: "whatsapp", type: "tel", label: "WhatsApp", placeholder: "Необязательно", inputMode: "tel", half: true, showIf: { not: { field: "whatsappSame", equals: true } } },
    { id: "telegram", type: "text", label: "Telegram", placeholder: "@username (необязательно)", maxLength: 64, half: true },
    {
      id: "preferredContact",
      type: "choice",
      label: "Как удобнее связаться?",
      columns: 3,
      options: [
        { value: "call", label: "Звонок", icon: "Phone" },
        { value: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
        { value: "telegram", label: "Telegram", icon: "Send" },
      ],
    },
  ],
};

/** Полный список шагов для выбранного типа мероприятия (до применения условий). */
export function getSteps(type: EventTypeId | undefined): Step[] {
  const branch = type ? BRANCHES[type] : [];
  return [eventTypeStep, ...branch, languageStep, venueStep(type), artistsStep, dateTimeStep(type), styleStep, contactsStep];
}

/** Поля, данные которых сохраняются в отдельные колонки заявки. */
export const CORE_FIELDS = [
  "eventType",
  "clientName",
  "phone",
  "whatsapp",
  "whatsappSame",
  "telegram",
  "preferredContact",
  "eventDate",
  "approxPeriod",
  "startTime",
  "duration",
  "guests",
  "language",
  "languageOther",
  "city",
  "venueName",
  "address",
] as const;

export function findField(type: EventTypeId | undefined, id: string): Field | undefined {
  for (const s of getSteps(type)) for (const f of s.fields) if (f.id === id) return f;
  return undefined;
}
