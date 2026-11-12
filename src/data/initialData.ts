import { AppDatabase } from '../types';

export const initialData: AppDatabase = {
  teacherProfile: {
    name: 'Fayzullo Omanullayev',
    title: 'Matematika fani bo‘yicha Milliy sertifikat eksperti & Pedagog',
    bio: '8 yildan ortiq tajribaga ega matematika ustozi. 450 dan ortiq o‘quvchilari OTM talabasi va 215 dan ziyod o‘quvchilari Milliy sertifikat A+ hamda A darajasiga erishgan.',
    photoUrl: 'https://i.postimg.cc/GtPm4K25/photo-2026-11-09-19-50-01.jpg',
    experienceYears: 8,
    studentsCount: 1450,
    nationalCertCount: 215,
    grantCount: 380,
    phone: '+998 (90) 123-45-67',
    telegram: 'https://t.me/fayzullo_math',
    methodology: 'Formulalarni yodlash emas, ularning geometrik va mantiqiy mohiyatini anglash. Har bir mavzu Milliy sertifikat standartidagi nostandart amaliy misollar bilan o‘rgatiladi.'
  },

  ownerPasswordHash: 'norintumanim',
  isOwnerFirstLogin: false,

  users: [
    {
      id: 'student-demo-1',
      name: 'Jasurbek',
      surname: 'Oripov',
      phone: '+998 90 777 11 22',
      additionalPhone: '+998 99 888 33 44',
      email: 'jasur@math.uz',
      telegramUsername: 'jasur_oripov_math',
      balance: 0,
      role: 'student',
      vipTier: 'none',
      region: 'Farg‘ona',
      isBlocked: false,
      registeredAt: '2026-01-10T10:00:00.000Z',
      completedLessons: ['demo-lesson-1']
    },
    {
      id: 'student-demo-2',
      name: 'Shahzoda',
      surname: 'Karimova',
      phone: '+998 93 555 44 33',
      additionalPhone: '',
      email: 'shahzoda@math.uz',
      telegramUsername: 'shahzoda_karimova',
      balance: 0,
      role: 'student',
      vipTier: 'none',
      region: 'Toshkent',
      isBlocked: false,
      registeredAt: '2026-02-01T12:30:00.000Z',
      completedLessons: []
    }
  ],

  courses: [
    {
      id: 'course-1',
      title: 'Milliy Sertifikat: Matematika A+ Maxsus Kursi',
      description: 'Milliy sertifikat imtihonining barcha 45 ta savolidan maksimal ball to‘plash uchun chuqurlashtirilgan nazariya, nostandart usullar va test yechish strategiyalari.',
      level: 'sertifikat',
      price: 490000,
      coverColor: 'from-amber-600 to-rose-600',
      coverIcon: 'Award',
      published: true,
      requiredVIP: 'start',
      modules: [
        { id: 'mod-1', courseId: 'course-1', title: '1-Modul: Algebra va Funksiyalar', orderIndex: 1 },
        { id: 'mod-2', courseId: 'course-1', title: '2-Modul: Geometriya va Stereometriya', orderIndex: 2 }
      ],
      lessonsCount: 1,
      totalDurationMinutes: 42,
      createdAt: '2026-01-15'
    }
  ],

  // DARSLAR (Mavzulashtirilgan va Oddiy darslar zanjir tizimi bilan)
  lessons: [
    {
      id: 'demo-lesson-1',
      courseId: 'course-1',
      moduleId: 'mod-1',
      title: '1. Kvadrat tenglamalar va Viyet teoremasining nostandart qo‘llanilishi — DEMO DARS',
      description: 'Milliy sertifikatda eng ko‘p tushadigan simmetrik ifodalarni hisoblash, ildizlar nisbati va parametrli kvadrat tenglamalarni tezkor grafik yechish uslubi.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      durationMinutes: 42,
      pdfUrl: '/materials/demo_vieta_theorems.pdf',
      notesMarkdown: `### Viyet Teoremasi va Simmetrik Ifodalar (Namunaviy Dars)

Keltirilgan kvadrat tenglama: $x^2 + px + q = 0$ uchun:
- $x_1 + x_2 = -p$
- $x_1 \\cdot x_2 = q$

Nostandart usul — Simmetrik darajali yig‘indilar:
$$x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2 = p^2 - 2q$$
$$x_1^3 + x_2^3 = (x_1 + x_2)(x_1^2 - x_1x_2 + x_2^2) = -p(p^2 - 3q)$$
$$\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1 + x_2}{x_1 x_2} = -\\frac{p}{q}$$`,
      mathFormula: 'x^2 + px + q = 0 \\implies x_1 + x_2 = -p, \\quad x_1 x_2 = q',
      orderIndex: 1,
      testId: 'test-quiz-1',
      isDemo: true,
      lessonType: 'thematic',
      requiredPassingPercent: 70
    },
    {
      id: 'lesson-thematic-2',
      courseId: 'course-1',
      moduleId: 'mod-1',
      title: '2. Ko‘rsatkichli va Logarifmik Tenglamalar (Mavzulashtirilgan Chuqur Dars)',
      description: 'Asoslar almashinuvi, logarifmik almashtirish usuli va Milliy sertifikat BMB formatidagi murakkab logarifmik ifodalarni soddalashtirish.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      durationMinutes: 38,
      pdfUrl: '/materials/logarithms_mastery.pdf',
      notesMarkdown: `### Logarifmlar Xossalari va Tenglamalar
$$\\log_a(x \\cdot y) = \\log_a x + \\log_a y, \\quad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y$$
$$\\log_{a^k} x^m = \\frac{m}{k}\\log_a x, \\quad a^{\\log_a b} = b$$`,
      mathFormula: '\\log_a b = \\frac{\\log_c b}{\\log_c a}',
      orderIndex: 2,
      testId: 'test-quiz-2',
      isDemo: false,
      lessonType: 'thematic',
      requiredPassingPercent: 75
    },
    {
      id: 'lesson-regular-1',
      courseId: 'course-1',
      moduleId: 'mod-1',
      title: '3. Arifmetik va Geometrik Progressiya Asoslari (Oddiy Dars)',
      description: 'Ketma-ketliklar, umumiy had formulasi, cheksiz kamayuvchi geometrik progressiya yig‘indisi va amaliy masalalar tahlili.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      durationMinutes: 30,
      pdfUrl: '/materials/progressions_basics.pdf',
      notesMarkdown: `### Progressiyalar Asosiy Formulalari
Arifmetik: $a_n = a_1 + (n-1)d, \\quad S_n = \\frac{a_1 + a_n}{2} \\cdot n$
Geometrik: $b_n = b_1 \\cdot q^{n-1}, \\quad S = \\frac{b_1}{1-q} \\ (|q| < 1)$`,
      mathFormula: 'S = \\frac{b_1}{1 - q}',
      orderIndex: 3,
      testId: 'test-quiz-3',
      isDemo: false,
      lessonType: 'regular',
      requiredPassingPercent: 60
    },
    {
      id: 'lesson-thematic-3',
      courseId: 'course-1',
      moduleId: 'mod-2',
      title: '4. Stereometriya: Prizma va Piramidaning Kesimlari (Mavzulashtirilgan Dars)',
      description: 'Fazoviy shakllar, ikki yoqli burchaklar, tekisliklar parallelligi va kesim yuzlarini vektor-koordinata usulida topish.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      durationMinutes: 45,
      pdfUrl: '/materials/stereometry_advanced.pdf',
      notesMarkdown: `### Fazoviy Geometriya Formulalari
Piramida hajmi: $V = \\frac{1}{3} S_{asos} \\cdot H$
To‘g‘ri prizma: $V = S_{asos} \\cdot H, \\quad S_{yon} = P_{asos} \\cdot H$`,
      mathFormula: 'V = \\frac{1}{3} S_{asos} \\cdot H',
      orderIndex: 4,
      testId: 'test-quiz-4',
      isDemo: false,
      lessonType: 'thematic',
      requiredPassingPercent: 80
    }
  ],

  // TESTLAR (Mock va Dars Quizlari)
  tests: [
    {
      id: 'test-milliy-1',
      title: 'Milliy Sertifikat: Rasmiy Standart Mock Imtihoni',
      description: 'Haqiqiy Bilim va malakalarni baholash agentligi (BMB) Milliy sertifikat sinovi formati. 150 daqiqa vaqt cheklovi, A+, A, B, C reyting baholash tizimi.',
      type: 'mock',
      durationMinutes: 150,
      maxScore: 100,
      requiredVIP: 'start',
      published: true,
      questionsCount: 10,
      createdAt: '2026-02-01'
    },
    {
      id: 'test-quiz-1',
      title: '1-Dars Testi: Kvadrat tenglamalar va Viyet teoremasi',
      description: '1-dars bo‘yicha o‘zlashtirishni tekshirish uchun 4 ta nostandart test savollari.',
      type: 'quiz',
      durationMinutes: 15,
      maxScore: 100,
      requiredVIP: 'none',
      published: true,
      questionsCount: 4,
      createdAt: '2026-02-01'
    },
    {
      id: 'test-quiz-2',
      title: '2-Dars Testi: Ko‘rsatkichli va Logarifmik Tenglamalar',
      description: '2-dars bo‘yicha logarifmik ayniyatlar va almashtirishlar testi.',
      type: 'quiz',
      durationMinutes: 15,
      maxScore: 100,
      requiredVIP: 'start',
      published: true,
      questionsCount: 4,
      createdAt: '2026-02-01'
    },
    {
      id: 'test-quiz-3',
      title: '3-Dars Testi: Arifmetik va Geometrik Progressiyalar',
      description: '3-dars bo‘yicha umumiy had va yig‘indilar mini-testi.',
      type: 'quiz',
      durationMinutes: 15,
      maxScore: 100,
      requiredVIP: 'start',
      published: true,
      questionsCount: 4,
      createdAt: '2026-02-01'
    },
    {
      id: 'test-quiz-4',
      title: '4-Dars Testi: Stereometriya va Fazoviy Shakllar',
      description: '4-dars bo‘yicha prizma, piramida va kesimlar bo‘yicha hisoblash testi.',
      type: 'quiz',
      durationMinutes: 15,
      maxScore: 100,
      requiredVIP: 'start',
      published: true,
      questionsCount: 4,
      createdAt: '2026-02-01'
    }
  ],

  questions: [
    {
      id: 'mq-1',
      testId: 'test-milliy-1',
      prompt: 'Agar $x^2 - 8x + 12 = 0$ tenglamaning ildizlari $x_1$ va $x_2$ bo‘lsa, $x_1^2 + x_2^2$ ning qiymatini toping.',
      mathFormula: 'x_1^2 + x_2^2 = ?',
      options: ['40', '52', '64', '28'],
      correctAnswerIndex: 0,
      explanation: 'Viyet teoremasiga ko‘ra: $x_1 + x_2 = 8$, $x_1 \\cdot x_2 = 12$. U holda $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2 = 8^2 - 2(12) = 64 - 24 = 40$.',
      difficulty: 'easy'
    },
    {
      id: 'mq-2',
      testId: 'test-milliy-1',
      prompt: 'Ushbu limitni hisoblang: $\\lim_{x \\to 0} \\frac{\\sin(6x)}{2x}$.',
      mathFormula: '\\lim_{x \\to 0} \\frac{\\sin(6x)}{2x}',
      options: ['3', '6', '1', '1/3'],
      correctAnswerIndex: 0,
      explanation: 'Birinchi ajoyib limitga ko‘ra: $\\lim_{x \\to 0} \\frac{\\sin(6x)}{6x} \\cdot \\frac{6x}{2x} = 1 \\cdot 3 = 3$.',
      difficulty: 'medium'
    },
    {
      id: 'mq-3',
      testId: 'test-milliy-1',
      prompt: 'Tengsizlikni yeching: $\\log_3(2x - 5) \\le 2$.',
      mathFormula: '\\log_3(2x - 5) \\le 2',
      options: ['(2.5; 7]', '[2.5; 7]', '(-∞; 7]', '(0; 7]'],
      correctAnswerIndex: 0,
      explanation: 'Aniqlanish sohasi: $2x - 5 > 0 \\implies x > 2.5$. Tengsizlik: $2x - 5 \\le 3^2 = 9 \\implies 2x \\le 14 \\implies x \\le 7$. Birlashma: $x \\in (2.5; 7]$.',
      difficulty: 'medium'
    },
    {
      id: 'mq-4',
      testId: 'test-milliy-1',
      prompt: 'To‘g‘ri burchakli uchburchakning katetlari 9 cm va 12 cm bo‘lsa, unga tashqi chizilgan aylananing radiusini ($R$) toping.',
      mathFormula: 'a = 9, b = 12 \\implies R = ?',
      options: ['7.5 cm', '15 cm', '6 cm', '8 cm'],
      correctAnswerIndex: 0,
      explanation: 'Gipotenuza $c = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = 15$ cm. To‘g‘ri burchakli uchburchakda tashqi aylana radiusi gipotenuzaning yarmiga teng: $R = 15/2 = 7.5$ cm.',
      difficulty: 'easy'
    },
    {
      id: 'mq-5',
      testId: 'test-milliy-1',
      prompt: 'Integrallash natijasini toping: $\\int (3x^2 - 4x + 1) dx$.',
      mathFormula: '\\int (3x^2 - 4x + 1) dx',
      options: ['x^3 - 2x^2 + x + C', '3x^3 - 4x^2 + x + C', 'x^3 - 4x^2 + C', '6x - 4 + C'],
      correctAnswerIndex: 0,
      explanation: 'Boshlang‘ich funksiya qoidasiga ko‘ra: $\\int 3x^2 dx = x^3$, $\\int -4x dx = -2x^2$, $\\int 1 dx = x$. Demak javob: $x^3 - 2x^2 + x + C$.',
      difficulty: 'medium'
    },
    {
      id: 'mq-6',
      testId: 'test-milliy-1',
      prompt: 'Geometrik progressiyada $b_1 = 3$ va maxraj $q = 2$ bo‘lsa, dastlabki 6 ta hadi yig‘indisi $S_6$ ni hisoblang.',
      mathFormula: 'S_n = \\frac{b_1(q^n - 1)}{q - 1}',
      options: ['189', '192', '96', '381'],
      correctAnswerIndex: 0,
      explanation: 'Formula bo‘yicha: $S_6 = \\frac{3(2^6 - 1)}{2 - 1} = 3(64 - 1) = 3 \\cdot 63 = 189$.',
      difficulty: 'easy'
    },
    {
      id: 'mq-7',
      testId: 'test-milliy-1',
      prompt: 'Funksiya hosilasini toping: $f(x) = x^3 \\cdot e^{2x}$.',
      mathFormula: 'f\'(x) = (x^3 e^{2x})\'',
      options: ['x^2 e^{2x}(3 + 2x)', '3x^2 e^{2x}', '2x^3 e^{2x}', 'x^2 e^{2x}(3x + 2)'],
      correctAnswerIndex: 0,
      explanation: 'Ko‘paytma hosilasi: $(uv)\' = u\'v + uv\'$. Demak: $f\'(x) = 3x^2 e^{2x} + x^3 \\cdot 2e^{2x} = x^2 e^{2x}(3 + 2x)$.',
      difficulty: 'hard'
    },
    {
      id: 'mq-8',
      testId: 'test-milliy-1',
      prompt: 'Trigonometrik tenglamaning $[0; 2\\pi]$ oraliqdagi ildizlari sonini toping: $2\\sin^2 x - 3\\sin x + 1 = 0$.',
      mathFormula: '2\\sin^2 x - 3\\sin x + 1 = 0',
      options: ['3 ta', '2 ta', '4 ta', '1 ta'],
      correctAnswerIndex: 0,
      explanation: '$(2\\sin x - 1)(\\sin x - 1) = 0$. Bundan: $\\sin x = 1 \\implies x = \\pi/2$; $\\sin x = 1/2 \\implies x = \\pi/6$ va $x = 5\\pi/6$. Jami 3 ta ildiz.',
      difficulty: 'medium'
    },
    {
      id: 'mq-9',
      testId: 'test-milliy-1',
      prompt: 'Kombinatorika: 7 nafar o‘quvchidan 3 kishilik delegatsiya necha xil usul bilan tanlanishi mumkin?',
      mathFormula: 'C_n^k = \\frac{n!}{k!(n-k)!}',
      options: ['35', '21', '210', '42'],
      correctAnswerIndex: 0,
      explanation: 'Guruhlashlar soni: $C_7^3 = \\frac{7 \\cdot 6 \\cdot 5}{3 \\cdot 2 \\cdot 1} = 35$.',
      difficulty: 'easy'
    },
    {
      id: 'mq-10',
      testId: 'test-milliy-1',
      prompt: 'Vektorlar orasidagi burchakni toping: $\\vec{a} = (1; \\sqrt{3})$ va $\\vec{b} = (0; 2)$.',
      mathFormula: '\\cos \\alpha = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}| |\\vec{b}|}',
      options: ['30°', '60°', '45°', '90°'],
      correctAnswerIndex: 0,
      explanation: 'Skalyar ko‘paytma: $1(0) + \\sqrt{3}(2) = 2\\sqrt{3}$. Modullar: $|\\vec{a}| = 2$, $|\\vec{b}| = 2$. Demak: $\\cos \\alpha = \\frac{2\\sqrt{3}}{4} = \\frac{\\sqrt{3}}{2} \\implies \\alpha = 30^\\circ$.',
      difficulty: 'medium'
    },

    // 1-DARS QUIZ (Kvadrat tenglamalar va Viyet)
    {
      id: 'tq1-1',
      testId: 'test-quiz-1',
      prompt: 'Agar $x^2 - 7x + 10 = 0$ tenglamaning ildizlari $x_1$ va $x_2$ bo‘lsa, $x_1 + x_2$ va $x_1 \\cdot x_2$ qiymatini toping.',
      mathFormula: 'x^2 - 7x + 10 = 0',
      options: ['Yig‘indisi 7, ko‘paytmasi 10', 'Yig‘indisi -7, ko‘paytmasi 10', 'Yig‘indisi 10, ko‘paytmasi 7', 'Yig‘indisi 5, ko‘paytmasi 2'],
      correctAnswerIndex: 0,
      explanation: 'Viyet teoremasiga binoan keltirilgan kvadrat tenglamada $x_1 + x_2 = -(-7) = 7$, va $x_1 \\cdot x_2 = 10$.',
      difficulty: 'easy'
    },
    {
      id: 'tq1-2',
      testId: 'test-quiz-1',
      prompt: '$x^2 - 5x + 6 = 0$ tenglama ildizlari $x_1, x_2$ uchun $\\frac{1}{x_1} + \\frac{1}{x_2}$ ning qiymatini hisoblang.',
      mathFormula: '\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1 + x_2}{x_1 x_2}',
      options: ['5/6', '6/5', '1', '5'],
      correctAnswerIndex: 0,
      explanation: '$\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1 + x_2}{x_1 x_2} = \\frac{5}{6}$.',
      difficulty: 'medium'
    },
    {
      id: 'tq1-3',
      testId: 'test-quiz-1',
      prompt: '$x^2 + 4x - 5 = 0$ tenglamaning diskriminantini va ildizlarini toping.',
      mathFormula: 'D = b^2 - 4ac',
      options: ['D = 36; x₁ = 1, x₂ = -5', 'D = 16; x₁ = 5, x₂ = -1', 'D = 25; x₁ = 2, x₂ = -3', 'D = 36; x₁ = -1, x₂ = 5'],
      correctAnswerIndex: 0,
      explanation: '$D = 4^2 - 4(1)(-5) = 16 + 20 = 36$. Ildizlar: $x = \\frac{-4 \\pm 6}{2} \\implies x_1 = 1, x_2 = -5$.',
      difficulty: 'easy'
    },
    {
      id: 'tq1-4',
      testId: 'test-quiz-1',
      prompt: 'Ildizlari $x_1 = 3$ va $x_2 = -4$ bo‘lgan keltirilgan kvadrat tenglama tuzing.',
      mathFormula: 'x^2 - (x_1+x_2)x + x_1 x_2 = 0',
      options: ['x² + x - 12 = 0', 'x² - x - 12 = 0', 'x² - 7x + 12 = 0', 'x² + 7x - 12 = 0'],
      correctAnswerIndex: 0,
      explanation: '$x_1 + x_2 = 3 + (-4) = -1$, $x_1 \\cdot x_2 = 3(-4) = -12$. Formula: $x^2 - (-1)x + (-12) = x^2 + x - 12 = 0$.',
      difficulty: 'medium'
    },

    // 2-DARS QUIZ (Ko‘rsatkichli va Logarifmik Tenglamalar)
    {
      id: 'tq2-1',
      testId: 'test-quiz-2',
      prompt: '$2^{x+3} = 32$ ko‘rsatkichli tenglamaning ildizini toping.',
      mathFormula: '2^{x+3} = 2^5',
      options: ['x = 2', 'x = 3', 'x = 5', 'x = 1'],
      correctAnswerIndex: 0,
      explanation: '$32 = 2^5 \\implies x + 3 = 5 \\implies x = 2$.',
      difficulty: 'easy'
    },
    {
      id: 'tq2-2',
      testId: 'test-quiz-2',
      prompt: '$\\log_2(x - 3) = 4$ logarifmik tenglamani yeching.',
      mathFormula: '\\log_2(x - 3) = 4 \\implies x - 3 = 2^4',
      options: ['x = 19', 'x = 16', 'x = 11', 'x = 7'],
      correctAnswerIndex: 0,
      explanation: 'Logarifm ta’rifiga ko‘ra: $x - 3 = 2^4 = 16 \\implies x = 19$. Tekshirish: $19 - 3 = 16 > 0$, to‘g‘ri.',
      difficulty: 'easy'
    },
    {
      id: 'tq2-3',
      testId: 'test-quiz-2',
      prompt: 'Hisoblang: $\\log_3 81 + \\log_5 125 - \\log_2 64$.',
      mathFormula: '\\log_3(3^4) + \\log_5(5^3) - \\log_2(2^6)',
      options: ['1', '0', '7', '13'],
      correctAnswerIndex: 0,
      explanation: '$\\log_3 81 = 4$, $\\log_5 125 = 3$, $\\log_2 64 = 6$. Natija: $4 + 3 - 6 = 1$.',
      difficulty: 'medium'
    },
    {
      id: 'tq2-4',
      testId: 'test-quiz-2',
      prompt: '$3^{2x} - 10 \\cdot 3^x + 9 = 0$ tenglamaning barcha ildizlari yig‘indisini toping.',
      mathFormula: 't^2 - 10t + 9 = 0, \\quad t = 3^x',
      options: ['2', '0', '1', '9'],
      correctAnswerIndex: 0,
      explanation: '$3^x = t > 0$ belgilasak: $t^2 - 10t + 9 = 0 \\implies t_1 = 1, t_2 = 9$. $3^x = 1 \\implies x = 0$, $3^x = 9 \\implies x = 2$. Ildizlar yig‘indisi: $0 + 2 = 2$.',
      difficulty: 'hard'
    },

    // 3-DARS QUIZ (Arifmetik va Geometrik Progressiyalar)
    {
      id: 'tq3-1',
      testId: 'test-quiz-3',
      prompt: 'Arifmetik progressiyada $a_1 = 5$ va $d = 3$ bo‘lsa, $a_{10}$ ni toping.',
      mathFormula: 'a_n = a_1 + (n - 1)d',
      options: ['32', '35', '29', '38'],
      correctAnswerIndex: 0,
      explanation: '$a_{10} = a_1 + 9d = 5 + 9(3) = 5 + 27 = 32$.',
      difficulty: 'easy'
    },
    {
      id: 'tq3-2',
      testId: 'test-quiz-3',
      prompt: 'Geometrik progressiyada $b_1 = 2$ va $q = 3$ bo‘lsa, $b_4$ ning qiymatini toping.',
      mathFormula: 'b_n = b_1 \\cdot q^{n-1}',
      options: ['54', '18', '162', '24'],
      correctAnswerIndex: 0,
      explanation: '$b_4 = b_1 \\cdot q^3 = 2 \\cdot 3^3 = 2 \\cdot 27 = 54$.',
      difficulty: 'easy'
    },
    {
      id: 'tq3-3',
      testId: 'test-quiz-3',
      prompt: 'Cheksiz kamayuvchi geometrik progressiyada $b_1 = 12$ va $q = \\frac{1}{3}$ bo‘lsa, uning yig‘indisi $S$ ni hisoblang.',
      mathFormula: 'S = \\frac{b_1}{1 - q}',
      options: ['18', '16', '36', '24'],
      correctAnswerIndex: 0,
      explanation: '$S = \\frac{b_1}{1 - q} = \\frac{12}{1 - 1/3} = \\frac{12}{2/3} = 12 \\cdot \\frac{3}{2} = 18$.',
      difficulty: 'medium'
    },
    {
      id: 'tq3-4',
      testId: 'test-quiz-3',
      prompt: 'Arifmetik progressiyada $a_1 = 2, a_{10} = 20$ bo‘lsa, dastlabki 10 ta had yig‘indisi $S_{10}$ ni toping.',
      mathFormula: 'S_n = \\frac{a_1 + a_n}{2} \\cdot n',
      options: ['110', '100', '220', '120'],
      correctAnswerIndex: 0,
      explanation: '$S_{10} = \\frac{a_1 + a_{10}}{2} \\cdot 10 = \\frac{2 + 20}{2} \\cdot 10 = 11 \\cdot 10 = 110$.',
      difficulty: 'medium'
    },

    // 4-DARS QUIZ (Stereometriya: Prizma va Piramida)
    {
      id: 'tq4-1',
      testId: 'test-quiz-4',
      prompt: 'Asosining tomoni $4$ sm bo‘lgan muntazam to‘rtburchakli prizmaning balandligi $10$ sm. Prizma hajmini toping.',
      mathFormula: 'V = S_{asos} \\cdot H',
      options: ['160 sm³', '80 sm³', '320 sm³', '64 sm³'],
      correctAnswerIndex: 0,
      explanation: 'Asosi kvadrat: $S_{asos} = 4^2 = 16\\text{ sm}^2$. Hajm: $V = 16 \\cdot 10 = 160\\text{ sm}^3$.',
      difficulty: 'easy'
    },
    {
      id: 'tq4-2',
      testId: 'test-quiz-4',
      prompt: 'Piramidaning asosi yuzi $36\\text{ sm}^2$ va balandligi $9\\text{ sm}$ bo‘lsa, uning hajmini hisoblang.',
      mathFormula: 'V = \\frac{1}{3} S_{asos} \\cdot H',
      options: ['108 sm³', '324 sm³', '54 sm³', '96 sm³'],
      correctAnswerIndex: 0,
      explanation: '$V = \\frac{1}{3} S_{asos} \\cdot H = \\frac{1}{3} \\cdot 36 \\cdot 9 = 12 \\cdot 9 = 108\\text{ sm}^3$.',
      difficulty: 'easy'
    },
    {
      id: 'tq4-3',
      testId: 'test-quiz-4',
      prompt: 'Kubning to‘la sirti $150\\text{ sm}^2$ bo‘lsa, uning qirrasi $a$ va hajmi $V$ qanchaga teng?',
      mathFormula: 'S = 6a^2, \\quad V = a^3',
      options: ['a = 5 sm, V = 125 sm³', 'a = 6 sm, V = 216 sm³', 'a = 4 sm, V = 64 sm³', 'a = 5 sm, V = 150 sm³'],
      correctAnswerIndex: 0,
      explanation: '$6a^2 = 150 \\implies a^2 = 25 \\implies a = 5\\text{ sm}$. Hajm: $V = 5^3 = 125\\text{ sm}^3$.',
      difficulty: 'medium'
    },
    {
      id: 'tq4-4',
      testId: 'test-quiz-4',
      prompt: 'To‘g‘ri burchakli parallelepipedning o‘lchamlari $3, 4, 12$ sm. Uning fazoviy diagonali $d$ uzunligini toping.',
      mathFormula: 'd = \\sqrt{a^2 + b^2 + c^2}',
      options: ['13 sm', '15 sm', '17 sm', '12 sm'],
      correctAnswerIndex: 0,
      explanation: '$d = \\sqrt{3^2 + 4^2 + 12^2} = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13\\text{ sm}$.',
      difficulty: 'medium'
    }
  ],

  testAttempts: [
    {
      id: 'attempt-demo-1',
      userId: 'student-demo-1',
      userName: 'Jasurbek Oripov',
      testId: 'test-milliy-1',
      testTitle: 'Milliy Sertifikat: Rasmiy Standart Mock Imtihoni',
      score: 100,
      maxScore: 100,
      correctCount: 5,
      totalQuestions: 5,
      answers: { 'mq-1': 0, 'mq-2': 0, 'mq-3': 0, 'mq-4': 0, 'mq-5': 0 },
      timeSpentSeconds: 3800,
      createdAt: '2026-02-12T16:45:00.000Z'
    }
  ],

  // O‘QUVCHILAR NATIJALARI (19 ta rasmiy Matematika Milliy Sertifikati)
  studentResults: [
    {"id": "res-101", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/zLqk83MT/photo-2026-11-09-18-26-21.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-102", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/DW7cnmDd/photo-2026-11-09-18-26-29.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-103", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/SXmGkj5D/photo-2026-11-09-18-26-33.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-104", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/xk9Pnq75/photo-2026-11-09-18-26-39.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-105", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/DW7cnmDg/photo-2026-11-09-18-26-42.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-106", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/KKm5x4V0/photo-2026-11-09-18-26-47.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-107", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/qtpG4gYY/photo-2026-11-09-18-26-51.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-108", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/94cBCzSK/photo-2026-11-09-18-26-55.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-109", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/R3vT4q82/photo-2026-11-09-18-26-59.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-110", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/7CqNwbcp/photo-2026-11-09-18-27-02.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-111", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/JyRQMtgf/photo-2026-11-09-18-27-07.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-112", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/gwGKmrQ9/photo-2026-11-09-18-27-11.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-113", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/1gMrtshJ/photo-2026-11-09-18-27-15.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-114", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/jWv45t0M/photo-2026-11-09-18-27-19.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-115", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/MctmTq2s/photo-2026-11-09-18-27-22.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-116", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/PLKQxTsV/photo-2026-11-09-18-27-29.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-117", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/mcVyDBfn/photo-2026-11-09-18-27-37.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-118", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/f35fLDnr/photo-2026-11-09-18-27-41.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true},
    {"id": "res-119", "studentName": "Milliy Sertifikat Sohibi", "certificateImageUrl": "https://i.postimg.cc/f35fLDn1/photo-2026-11-09-18-30-07.jpg", "region": "O‘zbekiston", "certificateType": "Milliy Sertifikat", "score": "A+ Daraja", "examDate": "2026", "certificateBadgeColor": "from-amber-500 to-rose-600", "isPublished": true}
  ],

  siteSections: [
    {
      id: 'sec-hero',
      key: 'hero',
      title: 'Matematikani Tushuning, Yodlamang',
      subtitle: 'Milliy Sertifikat A+ va OTM Grantiga erishish uchun zamonaviy va professional ta’lim tizimi. Fayzullo ustoz bilan yuqori natijalar kafolati.',
      ctaText: 'Demo Darsni Ko‘rish',
      ctaLink: '#demo-lesson',
      isVisible: true,
      orderIndex: 1
    },
    {
      id: 'sec-stats',
      key: 'stats',
      title: 'Akademiyamiz Raqamlarda',
      subtitle: 'Haqiqiy mehnat va o‘quvchilarimiz erishgan ishonchli natijalar',
      isVisible: true,
      orderIndex: 2
    },
    {
      id: 'sec-demo',
      key: 'demo',
      title: 'Namunaviy Bepul Demo Dars',
      subtitle: 'Dars sifatini o‘zingiz baholang — Fayzullo ustozning 42 daqiqalik darsi',
      isVisible: true,
      orderIndex: 3
    },
    {
      id: 'sec-results',
      key: 'results',
      title: 'O‘quvchilar Natijalari',
      subtitle: 'Milliy Sertifikat A+, 90+ ballar va nufuzli OTM talabalari ro‘yxati',
      isVisible: true,
      orderIndex: 4
    },
    {
      id: 'sec-mock',
      key: 'mock',
      title: 'Milliy Sertifikat Mock Testi',
      subtitle: 'Rasmiy standartdagi 150 daqiqalik sinov testi orqali o‘z bilimingizni tekshiring',
      isVisible: true,
      orderIndex: 5
    },
    {
      id: 'sec-courses',
      key: 'courses',
      title: 'Akademiya Kurslari',
      subtitle: 'Maktab, OTM va Milliy sertifikat uchun saralangan chuqurlashtirilgan video kurslar',
      isVisible: true,
      orderIndex: 6
    },
    {
      id: 'sec-vip',
      key: 'vip',
      title: 'VIP Tariflar va Narxlar',
      subtitle: 'Ehtiyojingizga mos tarifni tanlang va intellektual LMS tizimidan to‘liq foydalaning',
      isVisible: true,
      orderIndex: 7
    },
    {
      id: 'sec-teacher',
      key: 'teacher',
      title: 'Ustozingiz Bilan Tanishing',
      subtitle: 'Fayzullo Omanullayev — Matematika fani bo‘yicha 8 yillik tajribaga ega yetakchi pedagog',
      isVisible: true,
      orderIndex: 8
    },
    {
      id: 'sec-contact',
      key: 'contact',
      title: 'Savolingiz Bormi? Bizga Yozing',
      subtitle: 'Telegram orqali murojaat qiling yoki pastdagi formani to‘ldiring, sizga tezda javob beramiz',
      isVisible: true,
      orderIndex: 9
    }
  ],

  vipPlans: [
    {
      id: 'start',
      name: 'START',
      priceMonthly: 190000,
      durationDays: 30,
      description: 'Boshlang‘ich bosqich uchun asosiy darslar va bazaviy testlar to‘plami',
      badge: 'Boshlang‘ich',
      features: [
        'Barcha bazaviy video darslar (1080p)',
        'Darslarga biriktirilgan PDF konspektlar',
        'Mavzulashtirilgan tezkor quizlar',
        'Mobil va kompyuterda cheksiz kirish',
        'Chat hamjamiyatiga kirish'
      ],
      hasAI: false,
      aiDailyLimit: 0,
      isPopular: false
    },
    {
      id: 'gold',
      name: 'GOLD',
      priceMonthly: 340000,
      durationDays: 60,
      description: 'Milliy sertifikat va OTMga jiddiy tayyorlanuvchilar uchun eng maqbul tanlov',
      badge: 'Eng Ommabop',
      features: [
        'Barcha START imkoniyatlari',
        'Milliy sertifikat maxsus darslari',
        'AI Matematika Yordamchisi (kuniga 50 ta yechim)',
        'Darslar yakuniy tahlillari'
      ],
      hasAI: true,
      aiDailyLimit: 50,
      isPopular: true
    },
    {
      id: 'platinum',
      name: 'PLATINUM',
      priceMonthly: 590000,
      durationDays: 90,
      description: 'A+ daraja va OTM 100% grantini maqsad qilgan abituriyentlar uchun to‘liq qurollanish',
      badge: 'Maksimal Natija',
      features: [
        'Barcha GOLD imkoniyatlari',
        'Cheksiz Milliy sertifikat mock imtihonlari',
        'Batafsil xatolar tahlili va reyting',
        'AI Matematika Yordamchisi (kuniga 150 ta yechim)',
        'Ustoz bilan haftalik jonli savol-javob vebinari'
      ],
      hasAI: true,
      aiDailyLimit: 150,
      isPopular: false
    },
    {
      id: 'individual',
      name: 'INDIVIDUAL',
      priceMonthly: 1200000,
      durationDays: 120,
      description: 'Fayzullo ustozning shaxsiy nazorati, individual dars jadvali va cheksiz imkoniyatlar',
      badge: 'Eksklyuziv',
      features: [
        'Barcha PLATINUM imkoniyatlari',
        'Fayzullo ustoz bilan 1-ga-1 shaxsiy darslar (haftada 2 marta)',
        'Shaxsiy o‘quv rejasi va kunlik nazorat',
        'Cheksiz AI Matematika Yordamchisi'
      ],
      hasAI: true,
      aiDailyLimit: 9999,
      isPopular: false
    }
  ],

  supportTickets: [],

  notifications: [
    {
      id: 'notif-1',
      title: 'Yangi Milliy Sertifikat Mock Testi yuklandi!',
      message: 'Hurmatli o‘quvchilar, yangi formatdagi 150 daqiqalik Mock Imtihon ochildi. O‘z bilimingizni sinab ko‘ring!',
      targetRole: 'all',
      createdAt: '2026-02-14T08:00:00.000Z',
      isRead: false
    }
  ],

  // O‘QUVCHILAR REYTINGI (Leaderboard - Creator boshqara oladi)
  studentLeaderboard: [
    {
      id: 'lead-1',
      studentName: 'Shohjahon Abdullayev',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      region: 'Toshkent shahri',
      points: 2950,
      solvedTestsCount: 48,
      streakDays: 45,
      completedLessonsCount: 36,
      nationalCertScore: '99.2 (A+)',
      badge: '🏆 Grandmaster',
      rank: 1,
      tier: 'gold'
    },
    {
      id: 'lead-2',
      studentName: 'Madinabonu Karimova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      region: 'Samarqand viloyati',
      points: 2840,
      solvedTestsCount: 44,
      streakDays: 40,
      completedLessonsCount: 34,
      nationalCertScore: '97.8 (A+)',
      badge: '🥈 Matematik Daho',
      rank: 2,
      tier: 'silver'
    },
    {
      id: 'lead-3',
      studentName: 'Diyorbek Rustamov',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      region: 'Farg‘ona viloyati',
      points: 2710,
      solvedTestsCount: 41,
      streakDays: 32,
      completedLessonsCount: 30,
      nationalCertScore: '96.5 (A+)',
      badge: '🥉 Olimpiada Chempioni',
      rank: 3,
      tier: 'bronze'
    },
    {
      id: 'lead-4',
      studentName: 'Jasurbek Oripov',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      region: 'Andijon viloyati',
      points: 2590,
      solvedTestsCount: 39,
      streakDays: 28,
      completedLessonsCount: 29,
      nationalCertScore: '95.0 (A+)',
      badge: '⭐ Faol Tadqiqotchi',
      rank: 4,
      tier: 'top10'
    },
    {
      id: 'lead-5',
      studentName: 'Shahzoda Karimova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      region: 'Namangan viloyati',
      points: 2470,
      solvedTestsCount: 36,
      streakDays: 25,
      completedLessonsCount: 26,
      nationalCertScore: '93.5 (A)',
      badge: '⚡ Tezkor Hisobchi',
      rank: 5,
      tier: 'top10'
    },
    {
      id: 'lead-6',
      studentName: 'Bekzod Mahmudov',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      region: 'Buxoro viloyati',
      points: 2360,
      solvedTestsCount: 33,
      streakDays: 21,
      completedLessonsCount: 24,
      nationalCertScore: '91.8 (A)',
      badge: '🔥 Algebra Ustasi',
      rank: 6,
      tier: 'top10'
    },
    {
      id: 'lead-7',
      studentName: 'Sevara Yusupova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      region: 'Xorazm viloyati',
      points: 2210,
      solvedTestsCount: 30,
      streakDays: 18,
      completedLessonsCount: 22,
      nationalCertScore: '90.4 (A)',
      badge: '💎 Geometriya Eksperti',
      rank: 7,
      tier: 'top10'
    }
  ],

  // SAYT YARATUVCHILARI (Platformani yaratgan 3 nafar dasturchi)
  siteCreators: [
    {
      id: 'creator-1',
      name: 'Azizbek Rahimov',
      role: 'Bosh Full-Stack Arxitektor & Tizim Muhandisi',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      technologies: ['React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Vite', 'Cloud Architecture'],
      telegramUsername: 'azizbek_fullstack',
      phoneNumber: '+998 (99) 789-10-20',
      bio: 'Platformaning asosiy server arxitekturasi, ma’lumotlar bazasi sinxronizatsiyasi, xavfsizlik audit tizimi va yuqori yuklamali API lar loyihachisi.'
    },
    {
      id: 'creator-2',
      name: 'Shaxzod Aliyev',
      role: 'Yetakchi Frontend Muhandisi & UI/UX Dizayner',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'TypeScript', 'Motion', 'Tailwind CSS v4', 'KaTeX Math Engine', 'Canvas FX', 'Design Systems'],
      telegramUsername: 'shaxzod_ui',
      phoneNumber: '+998 (97) 456-32-11',
      bio: 'Interaktiv matematik formulalar vizualizatsiyasi, jonli harakatlanuvchi fonlar, dark/light rejimlar va ultra-premium foydalanuvchi interfeysi muallifi.'
    },
    {
      id: 'creator-3',
      name: 'Jasurbek Karimov',
      role: 'Sun’iy Intellekt & Algoritmik Tizimlar Muhandisi',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      technologies: ['Gemini 2.5 SDK', 'Python', 'Prompt Engineering', 'AI Quiz Engine', 'Algoritmlar', 'Zanjir Tizimi'],
      telegramUsername: 'jasur_ai_tech',
      phoneNumber: '+998 (93) 321-77-88',
      bio: 'Gemini AI orqali avtomatlashtirilgan matematik viktorina generatori, o‘quvchilar reyting tahlili va darslarni zanjirli ochish algoritmlari yaratuvchisi.'
    }
  ],

  // MAVZUMIY TESTLAR & OLIMPIADALAR (G‘oliblar va Jonli Teskari Sanoq Soati)
  thematicOlympiad: {
    id: 'olymp-kuzgi-2025',
    title: 'Kuzgi Respublika Matematika Olimpiadasi & Milliy Sertifikat Saralashi',
    season: 'Kuzgi Saralash Testi',
    description: 'Respublika bo‘yicha 1 800 dan ortiq abituriyent va o‘quvchilar ishtirok etgan nufuzli matematika saralash sinovi natijalari.',
    winners: [
      {
        rank: 1,
        name: 'Shohjahon Abdullayev',
        score: '99.2 ball',
        region: 'Toshkent shahri',
        award: '🥇 1-darajali Oltin Diplom + 100% OTM Granti',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'
      },
      {
        rank: 2,
        name: 'Madinabonu Karimova',
        score: '97.8 ball',
        region: 'Samarqand viloyati',
        award: '🥈 2-darajali Kumush Diplom + Noutbuk Mukofoti',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
      },
      {
        rank: 3,
        name: 'Diyorbek Rustamov',
        score: '96.5 ball',
        region: 'Farg‘ona viloyati',
        award: '🥉 3-darajali Bronza Diplom + Planshet Sovg‘asi',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      }
    ],
    nextTest: {
      title: 'Bahorgi Katta Matematika Saralash Testi (BMB Rasmiy Standarti)',
      targetDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
      rules: '35 ta mualliflik savoli (Algebra, Geometriya, Kombinatorika va Parametrli masalalar). Davomiyligi 120 daqiqa. 90+ ball to‘plagan 5 nafar o‘quvchiga to‘liq bepul kurs va noutbuk!',
      questionsCount: 35,
      durationMinutes: 120,
      prizePool: '15 000 000 so‘m & OTM Grantlari',
      isRegistrationOpen: true
    }
  },

  siteTheme: {
    activeBackground: 'formula_live',
    allowUserThemeOverride: true
  },

  // TELEGRAM BOT SOZLAMALARI (Creator to‘liq boshqaradi)
  telegramBotSettings: {
    botUsername: 'fayzullo_matematika_bot',
    botName: 'Fayzullo Matematika To‘lov & Depozit Boti',
    isActive: true,
    minDepositAmount: 10000,
    cardOrMerchantInfo: 'Humo/Uzcard orqali to‘g‘ridan-to‘g‘ri botda avtomatik tasdiqlash',
    supportTelegram: '@fayzullo_math_admin',
    autoApprovalDemo: true
  },

  // DEPOZITLAR VA TRANZAKSIYALAR TARIXI
  depositTransactions: [
    {
      id: 'dep-tx-101',
      userId: 'student-demo-1',
      userName: 'Jasurbek Oripov',
      userPhone: '+998 90 777 11 22',
      telegramUsername: 'jasur_oripov_math',
      amount: 250000,
      status: 'completed',
      method: 'telegram_bot',
      paymentCode: 'DEP-88421',
      note: 'Telegram Bot orqali to‘ldirildi (Payme / Click bot)',
      createdAt: '2026-02-12T14:20:00.000Z',
      approvedAt: '2026-02-12T14:21:05.000Z'
    },
    {
      id: 'dep-tx-102',
      userId: 'student-demo-2',
      userName: 'Shahzoda Karimova',
      userPhone: '+998 93 555 44 33',
      telegramUsername: 'shahzoda_karimova',
      amount: 120000,
      status: 'completed',
      method: 'telegram_bot',
      paymentCode: 'DEP-91045',
      note: 'START tarifi uchun hisob to‘ldirish',
      createdAt: '2026-02-13T09:15:00.000Z',
      approvedAt: '2026-02-13T09:16:30.000Z'
    },
    {
      id: 'dep-tx-103',
      userId: 'student-demo-1',
      userName: 'Jasurbek Oripov',
      userPhone: '+998 90 777 11 22',
      telegramUsername: 'jasur_oripov_math',
      amount: 100000,
      status: 'completed',
      method: 'telegram_bot',
      paymentCode: 'DEP-99432',
      note: 'Olimpiada va sertifikat testlari uchun depozit',
      createdAt: '2026-02-14T08:00:00.000Z',
      approvedAt: '2026-02-14T08:02:10.000Z'
    }
  ],

  auditLogs: [
    {
      id: 'log-1',
      actor: 'Owner (fayzullo)',
      action: 'INIT',
      entity: 'Platforma',
      details: 'Fayzullo Matematika Akademiyasi platformasi ishga tushirildi.',
      timestamp: '2026-02-14T06:00:00.000Z'
    }
  ]
};
