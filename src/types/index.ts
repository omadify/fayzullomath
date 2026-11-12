export type Role = 'guest' | 'student' | 'owner';

export type VIPTier = 'none' | 'free' | 'start' | 'gold' | 'platinum' | 'individual';

export interface User {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email?: string; // Majburiy emas (ixtiyoriy)
  additionalPhone?: string; // Qo'shimcha raqam - Majburiy emas (ixtiyoriy)
  telegramUsername?: string; // Telegram foydalanuvchi nomi (@username)
  balance?: number; // Hisob balansi (so'mda)
  role: Role;
  vipTier: VIPTier;
  vipExpiresAt?: string; // ISO date
  password?: string;
  avatar?: string;
  region?: string;
  isBlocked?: boolean;
  registeredAt: string;
  completedLessons: string[]; // lesson IDs
}

export type CourseLevel = 'maktab' | 'sertifikat' | 'otm' | 'olimpiada';

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  durationMinutes: number;
  pdfUrl?: string;
  notesMarkdown?: string;
  mathFormula?: string;
  orderIndex: number;
  testId?: string;
  isDemo?: boolean; // 1 ta maxsus bepul demo dars
  lessonType?: 'thematic' | 'regular'; // Mavzulashtirilgan vs Oddiy dars
  requiredPassingPercent?: number; // Keyingi dars ochilishi uchun talab qilinadigan foiz (default: 70%)
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  price: number;
  coverColor: string;
  coverIcon: string;
  published: boolean;
  requiredVIP: VIPTier;
  modules: CourseModule[];
  lessonsCount: number;
  totalDurationMinutes: number;
  createdAt: string;
}

export type TestType = 'mock' | 'quiz' | 'diagnostic';

export interface Question {
  id: string;
  testId: string;
  prompt: string;
  mathFormula?: string;
  options: string[]; // 4 options [A, B, C, D]
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Test {
  id: string;
  title: string;
  description: string;
  type: TestType;
  durationMinutes: number;
  maxScore: number;
  requiredVIP: VIPTier;
  published: boolean;
  questionsCount: number;
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  userId: string;
  userName: string;
  testId: string;
  testTitle: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  answers: Record<string, number>;
  timeSpentSeconds: number;
  createdAt: string;
}

// O'quvchilar Natijalari (Owner tomonidan kiritiladi: Ism-familiya, rasm, Matematika Milliy Sertifikati rasmi, ball va tavsif)
export interface StudentResult {
  id: string;
  studentName: string;
  photoUrl?: string; // O'quvchi fotosurati
  certificateImageUrl?: string; // Matematika Milliy Sertifikati rasmi (skan yoki fotosurat)
  region: string;
  certificateType: string; // e.g. "Milliy Sertifikat A+"
  score: string; // e.g. "98.4 ball (100% Grant)"
  examDate: string;
  university?: string;
  certificateBadgeColor: string; // visual badge color
  story?: string; // O'quvchi natijasi va iqtibosi
  description?: string; // Tagidagi batafsil tavsif
  isPublished: boolean;
}

export interface SiteSection {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  isVisible: boolean;
  orderIndex: number;
  customData?: Record<string, any>;
}

export interface SupportTicket {
  id: string;
  userName: string;
  userPhone: string;
  message: string;
  category: 'kurs' | 'tolov' | 'texnik' | 'boshqa';
  status: 'new' | 'answered' | 'closed';
  replyText?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetRole?: 'all' | 'vip' | 'student';
  createdAt: string;
  isRead?: boolean;
}

export interface VIPPlan {
  id: VIPTier;
  name: string;
  priceMonthly: number;
  durationDays: number;
  description: string;
  badge?: string;
  features: string[];
  hasAI: boolean;
  aiDailyLimit: number;
  isPopular?: boolean;
}

export interface TeacherProfile {
  name: string;
  title: string;
  bio: string;
  photoUrl?: string; // Ustoz fotosurati
  experienceYears: number;
  studentsCount: number;
  nationalCertCount: number;
  grantCount: number;
  phone: string;
  telegram: string;
  methodology: string;
}

export interface StudentLeaderboardEntry {
  id: string;
  studentName: string;
  avatar?: string;
  region: string;
  points: number; // e.g. 2840
  solvedTestsCount: number;
  streakDays: number;
  completedLessonsCount: number;
  nationalCertScore?: string; // e.g. "98.4 (A+)"
  badge: string; // e.g. "Grandmaster", "Matematik Daho", "Olimpiada Chempioni"
  rank: number;
  tier: 'gold' | 'silver' | 'bronze' | 'top10';
}

export interface SiteCreator {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  technologies: string[];
  telegramUsername: string;
  phoneNumber: string;
  bio: string;
}

export interface OlympiadWinner {
  rank: 1 | 2 | 3;
  name: string;
  score: string;
  region: string;
  award: string;
  avatarUrl?: string;
}

export interface ThematicOlympiad {
  id: string;
  title: string;
  season: string; // e.g. "Kuzgi Milliy Sertifikat Saralash Testi"
  description: string;
  winners: OlympiadWinner[];
  nextTest: {
    title: string;
    targetDate: string; // ISO date for live countdown
    rules: string;
    questionsCount: number;
    durationMinutes: number;
    prizePool: string;
    isRegistrationOpen: boolean;
  };
}

export type BackgroundThemeId = 'minimal' | 'cosmic' | 'emerald' | 'gold' | 'formula_live';

export interface SiteThemeConfig {
  activeBackground: BackgroundThemeId;
  allowUserThemeOverride?: boolean;
}

export interface InstructorRanking {
  id: string;
  name: string;
  avatarUrl?: string;
  roleTitle: string;
  experienceYears: number;
  nationalCertPassRate: number; // % Pass rate for Milliy Sertifikat A+ / A
  grantRate: number; // % State grant admission rate
  avgStudentScore: number; // Average student test score (out of 100)
  studentRating: number; // Out of 5.0
  totalStudents: number;
  totalLessons: number;
  specialties: string[];
  bioSnippet: string;
  badge?: string;
}

export interface DepositTransaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  user_email?: string;
  telegramUsername?: string;
  amount: number;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  method: 'telegram_bot' | 'card' | 'manual';
  paymentCode: string;
  receiptUrl?: string; // To'lov kvitansiyasi / skrinshoti
  cardNumber?: string;
  note?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface TelegramBotSettings {
  botUsername: string; // masalan, "fayzullo_matematika_bot"
  botName: string;
  isActive: boolean;
  minDepositAmount: number;
  cardOrMerchantInfo: string;
  supportTelegram: string;
  autoApprovalDemo: boolean;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export interface AISettings {
  customApiKey?: string;
  provider?: 'gemini' | 'groq' | 'openai' | 'openrouter' | 'anthropic' | 'deepseek';
  activeModel?: string;
  providerLabel?: string;
  speedDesc?: string;
  updatedAt?: string;
}

export interface AppDatabase {
  users: User[];
  courses: Course[];
  lessons: Lesson[];
  tests: Test[];
  questions: Question[];
  testAttempts: TestAttempt[];
  studentResults: StudentResult[]; // Natijalar
  studentLeaderboard: StudentLeaderboardEntry[]; // O'quvchilar Reytingi
  siteCreators: SiteCreator[]; // Sayt Yaratuvchilari (3 ta)
  thematicOlympiad: ThematicOlympiad; // Mavzumiy Testlar & Olimpiadalar
  siteTheme: SiteThemeConfig; // Creator boshqaradigan 5 ta fon
  depositTransactions: DepositTransaction[]; // Telegram bot depozitlari
  telegramBotSettings: TelegramBotSettings; // Telegram bot sozlamalari
  aiSettings?: AISettings; // Universal AI sozlamalari
  siteSections: SiteSection[];
  supportTickets: SupportTicket[];
  notifications: NotificationItem[];
  vipPlans: VIPPlan[];
  teacherProfile: TeacherProfile;
  auditLogs: AuditLog[];
  ownerPasswordHash: string;
  isOwnerFirstLogin: boolean;
}

export type Language = 'uz' | 'ru' | 'en';
export type AppSiteMode = 'site1_open' | 'site2_lms' | 'site3_owner' | 'auth';

