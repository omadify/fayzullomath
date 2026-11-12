import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppDatabase,
  User,
  AppSiteMode,
  Language,
  Course,
  Lesson,
  Test,
  Question,
  SiteSection,
  StudentResult,
  VIPPlan,
  TeacherProfile,
  BackgroundThemeId,
  SiteCreator,
  DepositTransaction,
  TelegramBotSettings
} from '../types';
import { initialData } from '../data/initialData';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';

interface AppContextType {
  db: AppDatabase;
  loading: boolean;
  activeSite: AppSiteMode;
  setActiveSite: (site: AppSiteMode) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isOwnerAuth: boolean;
  setIsOwnerAuth: (auth: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  activeTestId: string | null;
  setActiveTestId: (id: string | null) => void;
  refreshDb: () => Promise<void>;

  // Unified Auth Actions
  unifiedLogin: (loginInput: string, password?: string) => Promise<{ success: boolean; message?: string; role?: 'student' | 'owner' }>;
  registerStudent: (data: { name: string; surname?: string; identifier?: string; phone?: string; email?: string; password?: string; region?: string }) => Promise<{ success: boolean; message?: string }>;
  ownerChangePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  toggleLessonCompletion: (lessonId: string) => Promise<void>;
  submitTestAttempt: (testId: string, answers: Record<string, number>, timeSpent: number) => Promise<any>;

  // Creator / Owner Actions
  createCourse: (course: Partial<Course>) => Promise<any>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<any>;
  deleteCourse: (id: string) => Promise<any>;
  createLesson: (lesson: Partial<Lesson>) => Promise<any>;
  updateLesson: (id: string, lesson: Partial<Lesson>) => Promise<any>;
  deleteLesson: (id: string) => Promise<any>;
  createTest: (test: Partial<Test>) => Promise<any>;
  updateTest: (id: string, test: Partial<Test>) => Promise<any>;
  deleteTest: (id: string) => Promise<any>;
  createQuestion: (question: Partial<Question>) => Promise<any>;
  deleteQuestion: (id: string) => Promise<any>;

  // Natijalar (Owner CRUD)
  createStudentResult: (res: Partial<StudentResult>) => Promise<any>;
  updateStudentResult: (id: string, res: Partial<StudentResult>) => Promise<any>;
  deleteStudentResult: (id: string) => Promise<any>;

  updateSiteSections: (sections: SiteSection[]) => Promise<any>;
  updateVIPPlans: (plans: VIPPlan[]) => Promise<any>;
  updateStudentVIP: (userId: string, vipTier: string, days: number) => Promise<any>;
  purchaseVIPPlan: (planId: string) => Promise<{ success: boolean; message?: string; reason?: string; price?: number; currentBal?: number; missing?: number; user?: User; plan?: VIPPlan }>;
  toggleStudentBlock: (userId: string) => Promise<any>;
  createSupportTicket: (ticket: any) => Promise<any>;
  replySupportTicket: (ticketId: string, reply: string) => Promise<any>;

  // Creator Advanced Actions
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => Promise<any>;
  updateSiteTheme: (themeConfig: { activeBackground: BackgroundThemeId; allowUserThemeOverride?: boolean }) => Promise<any>;
  updateLeaderboard: (leaderboard: any[]) => Promise<any>;
  updateThematicOlympiad: (thematicOlympiad: any) => Promise<any>;
  updateStudentFull: (studentData: any) => Promise<any>;
  deleteStudent: (studentId: string) => Promise<any>;
  updateSiteCreators: (creators: SiteCreator[]) => Promise<any>;
  updateSiteCreator: (creatorId: string, updated: Partial<SiteCreator>) => Promise<any>;
  updateStudentProfile: (profileData: Partial<User>) => Promise<any>;
  requestDeposit: (amount: number, telegramUsername?: string, method?: string, receiptUrl?: string, cardNumber?: string, note?: string) => Promise<any>;
  approveDeposit: (depositId: string) => Promise<any>;
  rejectDeposit: (depositId: string) => Promise<any>;
  updateBotSettings: (settings: Partial<TelegramBotSettings>) => Promise<any>;

  // Universal AI Key & Engine
  saveAiKey: (apiKey: string) => Promise<any>;
  resetAiKey: () => Promise<any>;
  getAiStatus: () => Promise<any>;
  getAiDiagnostic: (force?: boolean) => Promise<any>;

  // Static Demo Mode (Namoyish rejimi)
  isStaticDemoMode: boolean;
  setIsStaticDemoMode: (val: boolean) => void;
  switchDemoRole: (role: 'guest' | 'student' | 'creator') => void;
  resetDemoData: () => void;

  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo Student default
  const demoStudentUser: User = initialData.users.find(u => u.role === 'student') || {
    id: 'user-demo-jasur',
    role: 'student',
    name: 'Jasurbek',
    surname: 'Alimov',
    phone: '+998 90 123 45 67',
    region: 'Toshkent shahri',
    vipTier: 'platinum',
    vipExpiresAt: '2026-12-31T23:59:59.000Z',
    isBlocked: false,
    registeredAt: '2026-01-10T10:00:00.000Z',
    completedLessons: ['demo-lesson-1']
  };

  const [isStaticDemoMode, setIsStaticDemoModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('is_static_demo_mode');
      if (saved !== null) return saved === 'true';
    }
    return false; // Standart To'liq Full Stack Rejimi (Aktiv Server API)
  });

  const [db, setDb] = useState<AppDatabase>(() => {
    let initial = initialData;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_db_demo_state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed) {
            // Serverdagi yangi ma'lumotlar ustuvor bo'lishi uchun faqat mavjud bo'lmagan xususiyatlarni to'ldiramiz,
            // teacherProfile va studentResults har doim toza initialData/serverdan olinadi
            const { teacherProfile: _cachedTeacher, studentResults: _cachedResults, ...restParsed } = parsed;
            initial = {
              ...initial,
              ...restParsed,
              teacherProfile: initialData.teacherProfile,
              studentResults: initialData.studentResults
            };
          }
        } catch (e) {
          console.warn('Failed to parse cached demo db', e);
        }
      }
    }
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [activeSite, setActiveSite] = useState<AppSiteMode>('site1_open');

  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_current_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return null;
  });

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('app_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('app_current_user');
      }
    }
  };

  const [isOwnerAuth, setIsOwnerAuthState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_is_owner_auth') === 'true';
    }
    return false;
  });

  const setIsOwnerAuth = (val: boolean) => {
    setIsOwnerAuthState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_is_owner_auth', val ? 'true' : 'false');
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved === 'dark' || saved === 'light') {
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return saved;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        return 'dark';
      }
    }
    return 'light';
  });
  const [language, setLanguage] = useState<Language>('uz');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  const setIsStaticDemoMode = (val: boolean) => {
    setIsStaticDemoModeState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('is_static_demo_mode', val ? 'true' : 'false');
    }
    if (!val) {
      // Reverting to real Full Stack mode
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('app_current_user') : null;
      setCurrentUserState(savedUser ? JSON.parse(savedUser) : null);
      setIsOwnerAuthState(typeof window !== 'undefined' ? localStorage.getItem('app_is_owner_auth') === 'true' : false);
      setActiveSite('site1_open');
    } else {
      setCurrentUserState(demoStudentUser);
      setIsOwnerAuthState(true);
    }
  };

  const switchDemoRole = (role: 'guest' | 'student' | 'creator') => {
    if (role === 'guest') {
      setCurrentUser(null);
      setIsOwnerAuth(false);
      setActiveSite('site1_open');
    } else if (role === 'student') {
      setCurrentUser(demoStudentUser);
      setIsOwnerAuth(false);
      setActiveSite('site2_lms');
      setActiveCourseId(null);
      setActiveTestId(null);
    } else if (role === 'creator') {
      setIsOwnerAuth(true);
      setActiveSite('site3_owner');
    }
  };

  const resetDemoData = () => {
    setDb(initialData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_db_demo_state');
    }
  };

  // Cache changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_db_demo_state', JSON.stringify(db));
    }
  }, [db]);

  const refreshDb = async () => {
    try {
      const data = await api.fetchAllDb();
      
      // 1. Supabase'dan barcha yangi profillarni tortamiz
      const { data: supabaseProfiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Supabase'dan barcha to'lovlarni tortamiz
      const { data: supabasePayments } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      let updatedUsers = data?.users ? [...data.users] : [];
      if (supabaseProfiles && supabaseProfiles.length > 0) {
        // Supabase'dagi barcha userlarni ro'yxatga xavfsiz qo'shamiz (ID va Email bo'yicha dublikat bo'lmasligi uchun)
        const existingIds = new Set(updatedUsers.map((u: any) => u.id));
        const existingEmails = new Set(
          updatedUsers
            .map((u: any) => (u.email || '').trim().toLowerCase())
            .filter(Boolean)
        );

        supabaseProfiles.forEach((p: any) => {
          const pEmail = (p.email || '').trim().toLowerCase();
          const alreadyExists = existingIds.has(p.id) || (pEmail && existingEmails.has(pEmail));

          if (!alreadyExists) {
            existingIds.add(p.id);
            if (pEmail) existingEmails.add(pEmail);
            updatedUsers.unshift({
              id: p.id,
              name: p.email?.split('@')[0] || 'O‘quvchi',
              surname: '',
              email: p.email,
              phone: /^\d+$/.test(p.email?.split('@')[0] || '') ? p.email.split('@')[0] : '+998 90 000 00 00',
              role: 'student',
              balance: 0,
              vipTier: 'none',
              registeredAt: p.created_at || new Date().toISOString(),
              completedLessons: []
            });
          }
        });
      }

      // Yakuniy dublikatsiz o'quvchilar ro'yxati (har bir ID mutlaqo yagona bo'lishi shart)
      const uniqueUsersMap = new Map<string, any>();
      updatedUsers.forEach((u: any) => {
        if (!uniqueUsersMap.has(u.id)) {
          uniqueUsersMap.set(u.id, u);
        }
      });
      updatedUsers = Array.from(uniqueUsersMap.values());

      let updatedTransactions = data?.depositTransactions ? [...data.depositTransactions] : [];
      if (supabasePayments && supabasePayments.length > 0) {
        const supaMapped = supabasePayments.map((p: any) => {
          const matchedUser = updatedUsers.find((u: any) => u.email && p.user_email && u.email.toLowerCase() === p.user_email.toLowerCase());
          return {
            id: p.id,
            userId: matchedUser ? matchedUser.id : (p.user_email || 'student'),
            userName: matchedUser ? `${matchedUser.name} ${matchedUser.surname || ''}`.trim() : (p.user_email?.split('@')[0] || 'O‘quvchi'),
            user_email: p.user_email,
            userPhone: matchedUser?.phone || '',
            amount: Number(p.amount),
            receiptUrl: p.receipt_url || '',
            status: p.status || 'pending',
            method: p.receipt_url ? 'card' : 'telegram_bot',
            paymentCode: `DEP-${p.id.slice(0, 5).toUpperCase()}`,
            createdAt: p.created_at || new Date().toISOString()
          };
        });

        // Supabase to'lovlarini birlashtirib, har bir ID'ni yagona qilamiz
        const txMap = new Map<string, any>();
        supaMapped.forEach((tx: any) => txMap.set(tx.id, tx));
        updatedTransactions.forEach((tx: any) => {
          if (!txMap.has(tx.id)) {
            txMap.set(tx.id, tx);
          }
        });
        updatedTransactions = Array.from(txMap.values());
      }

      if (data) {
        // Serverdan kelgan ma'lumotlar (teacherProfile, studentResults, courses, lessons) har doim ustun bo'lib localStorage'ni majburiy yangilaydi
        const effectiveTeacherProfile: TeacherProfile = data.teacherProfile || initialData.teacherProfile;
        const effectiveStudentResults: StudentResult[] = (Array.isArray(data.studentResults) && data.studentResults.length > 0)
          ? data.studentResults
          : initialData.studentResults;
        const effectiveCourses: Course[] = (Array.isArray(data.courses) && data.courses.length > 0)
          ? data.courses
          : (data.courses || initialData.courses);
        const effectiveLessons: Lesson[] = (Array.isArray(data.lessons) && data.lessons.length > 0)
          ? data.lessons
          : (data.lessons || initialData.lessons);

        const nextState: AppDatabase = {
          ...data,
          teacherProfile: effectiveTeacherProfile,
          studentResults: effectiveStudentResults,
          courses: effectiveCourses,
          lessons: effectiveLessons,
          users: updatedUsers,
          depositTransactions: updatedTransactions
        };

        setDb(nextState);

        if (typeof window !== 'undefined') {
          localStorage.setItem('app_db_demo_state', JSON.stringify(nextState));
          if (effectiveTeacherProfile.photoUrl) {
            localStorage.setItem('app_teacher_photo_url', effectiveTeacherProfile.photoUrl);
          }
        }
      }

      if (currentUser && currentUser.role === 'student') {
        const fresh = updatedUsers.find((u: any) => u.id === currentUser.id || (u.email && currentUser.email && u.email.toLowerCase() === currentUser.email.toLowerCase()));
        if (fresh) setCurrentUser(fresh);
      }
    } catch (e) {
      console.warn('Sync error in refreshDb', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDb();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme_preference', next);
      return next;
    });
  };

  // Unified login
  const unifiedLogin = async (loginInput: string, password?: string) => {
    try {
      const res = await api.unifiedLogin(loginInput, password);
      if (res.success) {
        if (res.role === 'owner') {
          setIsOwnerAuth(true);
          setActiveSite('site3_owner');
        } else {
          setCurrentUser(res.user);
          setActiveSite('site2_lms');
        }
        return { success: true, role: res.role };
      }
      return { success: false, message: res.message || 'Kirishda xatolik yuz berdi' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Server xatosi' };
    }
  };

  const registerStudent = async (data: { name: string; surname?: string; identifier?: string; phone?: string; email?: string; password?: string; region?: string }) => {
    try {
      const rawInput = (data.identifier || data.phone || data.email || '').toString().trim();
      if (!rawInput) {
        return { success: false, message: 'Iltimos, telefon raqam yoki e-mail kiriting' };
      }

      if (!data.password || data.password.length < 8) {
        return { success: false, message: 'Parol kamida 8 ta belgidan iborat bo‘lishi shart' };
      }

      const cleanInput = rawInput.toLowerCase();
      const cleanDigits = cleanInput.replace(/\D/g, '');
      const authEmail = cleanInput.includes('@')
        ? cleanInput
        : `${cleanDigits || cleanInput}@fayzullo-math.uz`;

      // Direct browser-side sync to Supabase Auth
      (async () => {
        try {
          const { data: authData, error } = await supabase.auth.signUp({
            email: authEmail,
            password: data.password!,
            options: {
              data: {
                name: data.name,
                surname: data.surname || '',
                phone: rawInput.includes('@') ? '' : rawInput,
                region: data.region || ''
              }
            }
          });
          if (error) console.warn('Client Supabase Auth:', error.message);
          else console.log('✅ Client Supabase Auth success:', authData.user?.id);
        } catch (err: any) {
          console.warn('Client Supabase Auth catch:', err?.message || err);
        }
      })();

      const res = await api.registerStudent({
        ...data,
        identifier: rawInput,
        email: authEmail
      });

      if (res.success && res.user) {
        // Direct browser-side sync to Supabase public.users table
        (async () => {
          try {
            const { error } = await supabase.from('users').upsert([{
              id: res.user.id,
              name: res.user.name,
              surname: res.user.surname || '',
              phone: res.user.phone || '',
              email: authEmail,
              password: res.user.password || '',
              region: res.user.region || '',
              role: res.user.role || 'student',
              balance: res.user.balance || 0,
              vip_tier: res.user.vipTier || 'none',
              registered_at: res.user.registeredAt || new Date().toISOString()
            }]);
            if (error) console.warn('Client Supabase DB:', error.message);
            else console.log('✅ Client Supabase DB upsert success');
          } catch (err: any) {
            console.warn('Client Supabase DB catch:', err?.message || err);
          }
        })();

        setCurrentUser(res.user);
        await refreshDb();
        setActiveSite('site2_lms');
        return { success: true };
      }
      return { success: false, message: res.message || 'Ro‘yxatdan o‘tishda xatolik' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Tarmoq xatosi' };
    }
  };

  const ownerChangePassword = async (oldPass: string, newPass: string) => {
    const res = await api.ownerChangePassword(oldPass, newPass);
    if (res.success) await refreshDb();
    return res;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsOwnerAuth(false);
    setActiveSite('site1_open');
    setActiveCourseId(null);
    setActiveTestId(null);
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!currentUser) return;
    try {
      await api.toggleLessonComplete(currentUser.id, lessonId);
      await refreshDb();
    } catch (e) {
      console.error(e);
    }
  };

  const submitTestAttempt = async (testId: string, answers: Record<string, number>, timeSpent: number) => {
    const res = await api.submitTestAttempt({
      userId: currentUser?.id || 'guest',
      testId,
      answers,
      timeSpentSeconds: timeSpent
    });
    await refreshDb();
    return res;
  };

  // Creator Actions
  const createCourse = async (course: Partial<Course>) => {
    const courseId = course.id || `course-${Date.now()}`;
    const newCourse: Course = {
      id: courseId,
      title: course.title || 'Yangi Kurs',
      description: course.description || '',
      level: course.level || 'sertifikat',
      price: course.price || 390000,
      coverColor: course.coverColor || 'from-rose-500 to-amber-500',
      coverIcon: course.coverIcon || 'BookOpen',
      requiredVIP: course.requiredVIP || 'start',
      published: course.published ?? true,
      modules: course.modules || [{ id: 'mod-1', courseId, title: '1-Modul', orderIndex: 1 }],
      lessonsCount: 0,
      totalDurationMinutes: 0,
      createdAt: new Date().toISOString()
    };
    setDb(prev => {
      const nextDb = {
        ...prev,
        courses: [...prev.courses, newCourse]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
      }
      return nextDb;
    });
    try {
      const res = await api.createCourse(course);
      return res;
    } catch (e) {
      return { success: true, course: newCourse };
    }
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    setDb(prev => {
      const nextDb = {
        ...prev,
        courses: prev.courses.map(c => c.id === id ? { ...c, ...course } : c)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
      }
      return nextDb;
    });
    try {
      const res = await api.updateCourse(id, course);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const deleteCourse = async (id: string) => {
    setDb(prev => {
      const nextDb = {
        ...prev,
        courses: prev.courses.filter(c => c.id !== id),
        lessons: prev.lessons.filter(l => l.courseId !== id)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
      }
      return nextDb;
    });
    try {
      const res = await api.deleteCourse(id);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const createLesson = async (lesson: Partial<Lesson>) => {
    const newLesson: Lesson = {
      id: lesson.id || `lesson-${Date.now()}`,
      courseId: lesson.courseId || '',
      moduleId: lesson.moduleId || 'mod-1',
      title: lesson.title || 'Yangi Dars',
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      durationMinutes: lesson.durationMinutes || 30,
      pdfUrl: lesson.pdfUrl,
      notesMarkdown: lesson.notesMarkdown || '',
      mathFormula: lesson.mathFormula || '',
      orderIndex: lesson.orderIndex || 1,
      lessonType: lesson.lessonType || 'regular',
      isDemo: lesson.isDemo ?? false
    };

    setDb(prev => {
      const nextDb = {
        ...prev,
        lessons: [...prev.lessons, newLesson]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
        if (newLesson.videoUrl) {
          localStorage.setItem(`app_lesson_video_${newLesson.id}`, newLesson.videoUrl);
        }
      }
      return nextDb;
    });

    try {
      const res = await api.createLesson(lesson);
      return res;
    } catch (e) {
      return { success: true, lesson: newLesson };
    }
  };

  const updateLesson = async (id: string, lesson: Partial<Lesson>) => {
    // 1. Avval setDb orqali state'dagi dars ma'lumotini darhol yangilaymiz
    setDb(prev => {
      const updatedLessons = prev.lessons.map(l =>
        l.id === id ? { ...l, ...lesson } : l
      );
      const nextDb = {
        ...prev,
        lessons: updatedLessons
      };
      // 2. Yangilangan holatni localStorage.setItem('app_db_demo_state', ...) ga to‘liq saqlaymiz
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
        if (lesson.videoUrl) {
          localStorage.setItem(`app_lesson_video_${id}`, lesson.videoUrl);
        }
      }
      return nextDb;
    });

    try {
      const res = await api.updateLesson(id, lesson);
      return res;
    } catch (e) {
      console.warn('API updateLesson notice, local state preserved:', e);
      return { success: true, lesson };
    }
  };

  const deleteLesson = async (id: string) => {
    setDb(prev => {
      const nextDb = {
        ...prev,
        lessons: prev.lessons.filter(l => l.id !== id)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
        localStorage.removeItem(`app_lesson_video_${id}`);
      }
      return nextDb;
    });
    try {
      const res = await api.deleteLesson(id);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const createTest = async (test: Partial<Test>) => {
    const res = await api.createTest(test);
    await refreshDb();
    return res;
  };

  const updateTest = async (id: string, test: Partial<Test>) => {
    const res = await api.updateTest(id, test);
    await refreshDb();
    return res;
  };

  const deleteTest = async (id: string) => {
    setDb(prev => ({
      ...prev,
      tests: prev.tests.filter(t => t.id !== id),
      questions: prev.questions.filter(q => q.testId !== id)
    }));
    const res = await api.deleteTest(id);
    await refreshDb();
    return res;
  };

  const createQuestion = async (q: Partial<Question>) => {
    const res = await api.createQuestion(q);
    await refreshDb();
    return res;
  };

  const deleteQuestion = async (id: string) => {
    setDb(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
    const res = await api.deleteQuestion(id);
    await refreshDb();
    return res;
  };

  // Natijalar (Owner CRUD)
  const createStudentResult = async (result: Partial<StudentResult>) => {
    const newResult: StudentResult = {
      id: result.id || `res-${Date.now()}`,
      studentName: result.studentName || 'O‘quvchi',
      photoUrl: result.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      certificateImageUrl: result.certificateImageUrl || '',
      region: result.region || 'Toshkent',
      certificateType: result.certificateType || 'Milliy Sertifikat A+',
      score: result.score || 'A+',
      examDate: result.examDate || new Date().toISOString().split('T')[0],
      university: result.university || 'Toshkent',
      certificateBadgeColor: result.certificateBadgeColor || 'from-amber-500 to-rose-600',
      story: result.story || '',
      description: result.description || '',
      isPublished: result.isPublished ?? true
    };
    setDb(prev => {
      const nextDb = {
        ...prev,
        studentResults: [newResult, ...(prev.studentResults || [])]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
      }
      return nextDb;
    });
    try {
      const res = await api.createStudentResult(result);
      return res;
    } catch (e) {
      return { success: true, result: newResult };
    }
  };

  const updateStudentResult = async (id: string, result: Partial<StudentResult>) => {
    setDb(prev => {
      const nextDb = {
        ...prev,
        studentResults: (prev.studentResults || []).map(r => r.id === id ? { ...r, ...result } : r)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
      }
      return nextDb;
    });
    try {
      const res = await api.updateStudentResult(id, result);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const deleteStudentResult = async (id: string) => {
    setDb(prev => {
      const nextDb = {
        ...prev,
        studentResults: (prev.studentResults || []).filter(r => r.id !== id)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
      }
      return nextDb;
    });
    try {
      const res = await api.deleteStudentResult(id);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const updateSiteSections = async (sections: SiteSection[]) => {
    const res = await api.updateSiteSections(sections);
    await refreshDb();
    return res;
  };

  const updateVIPPlans = async (plans: VIPPlan[]) => {
    const res = await api.updateVIPPlans(plans);
    await refreshDb();
    return res;
  };

  const updateStudentVIP = async (userId: string, vipTier: string, days: number) => {
    const res = await api.updateStudentVIP(userId, vipTier, days);
    await refreshDb();
    return res;
  };

  const purchaseVIPPlan = async (planId: string) => {
    if (!currentUser) return { success: false, message: 'Iltimos, avval hisobingizga kiring.' };

    const plan = db.vipPlans.find(p => p.id === planId);
    if (!plan) return { success: false, message: 'Tanlangan tarif topilmadi.' };

    const currentBal = currentUser.balance || 0;
    const price = plan.priceMonthly || 0;

    // Verify balance
    if (price > 0 && currentBal < price) {
      const missing = price - currentBal;
      return {
        success: false,
        reason: 'insufficient_balance',
        message: `Balansingizda mablag‘ yetarli emas. ${plan.name} narxi: ${price.toLocaleString()} so‘m. Mavjud balans: ${currentBal.toLocaleString()} so‘m. Yetishmovchilik: ${missing.toLocaleString()} so‘m.`,
        price,
        currentBal,
        missing,
        plan
      };
    }

    // Deduct balance
    const newBalance = Math.max(0, currentBal - price);
    const updatedUser: User = {
      ...currentUser,
      balance: newBalance,
      vipTier: plan.id as any,
      vipExpiresAt: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString()
    };

    const purchaseCode = `VIP-${plan.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const purchaseTx: DepositTransaction = {
      id: `tx-vip-${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.name} ${currentUser.surname || ''}`.trim(),
      userPhone: currentUser.phone,
      telegramUsername: currentUser.telegramUsername || '',
      amount: -price,
      status: 'completed',
      method: 'telegram_bot',
      paymentCode: purchaseCode,
      note: `👑 ${plan.name} tarifi xaridi (${plan.durationDays} kunlik obuna)`,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    setDb(prev => ({
      ...prev,
      depositTransactions: [purchaseTx, ...(prev.depositTransactions || [])],
      users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u)
    }));

    try {
      await api.updateStudentFull({
        id: currentUser.id,
        balance: newBalance,
        vipTier: plan.id,
        vipExpiresAt: updatedUser.vipExpiresAt
      });
      await refreshDb();
      return { success: true, user: updatedUser, plan };
    } catch (e) {
      return { success: true, user: updatedUser, plan };
    }
  };

  const toggleStudentBlock = async (userId: string) => {
    const res = await api.toggleStudentBlock(userId);
    await refreshDb();
    return res;
  };

  const createSupportTicket = async (ticket: any) => {
    const res = await api.createSupportTicket(ticket);
    await refreshDb();
    return res;
  };

  const replySupportTicket = async (ticketId: string, reply: string) => {
    const res = await api.replySupportTicket(ticketId, reply);
    await refreshDb();
    return res;
  };

  const updateTeacherProfile = async (profile: Partial<TeacherProfile>) => {
    setDb(prev => {
      const nextDb = {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile,
          ...profile
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
        if (profile.photoUrl) {
          localStorage.setItem('app_teacher_photo_url', profile.photoUrl);
        }
      }
      return nextDb;
    });
    try {
      const res = await api.updateTeacherProfile(profile);
      return res;
    } catch (e) {
      console.warn('API updateTeacherProfile notice, local cache preserved:', e);
      return { success: true };
    }
  };

  const updateSiteTheme = async (themeConfig: { activeBackground: BackgroundThemeId; allowUserThemeOverride?: boolean }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_active_bg_theme', themeConfig.activeBackground);
    }
    setDb(prev => ({
      ...prev,
      siteTheme: {
        ...prev.siteTheme,
        ...themeConfig
      }
    }));
    try {
      const res = await api.updateSiteTheme(themeConfig);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const updateLeaderboard = async (leaderboard: any[]) => {
    setDb(prev => ({
      ...prev,
      studentLeaderboard: leaderboard
    }));
    try {
      const res = await api.updateLeaderboard(leaderboard);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const updateThematicOlympiad = async (thematicOlympiad: any) => {
    setDb(prev => ({
      ...prev,
      thematicOlympiad
    }));
    try {
      const res = await api.updateThematicOlympiad(thematicOlympiad);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const updateStudentFull = async (studentData: any) => {
    setDb(prev => {
      const nextDb = {
        ...prev,
        users: prev.users.map(u => u.id === studentData.id ? { ...u, ...studentData } : u)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_db_demo_state', JSON.stringify(nextDb));
      }
      return nextDb;
    });
    try {
      const res = await api.updateStudentFull(studentData);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const deleteStudent = async (studentId: string) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== studentId)
    }));
    try {
      const res = await api.deleteStudent(studentId);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const updateSiteCreators = async (creators: SiteCreator[]) => {
    setDb(prev => ({
      ...prev,
      siteCreators: creators
    }));
    try {
      const res = await api.updateSiteCreators(creators);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const updateSiteCreator = async (creatorId: string, updated: Partial<SiteCreator>) => {
    let nextCreators: SiteCreator[] = [];
    setDb(prev => {
      nextCreators = (prev.siteCreators || []).map(c => c.id === creatorId ? { ...c, ...updated } : c);
      return {
        ...prev,
        siteCreators: nextCreators
      };
    });
    try {
      const res = await api.updateSiteCreators(nextCreators);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const updateStudentProfile = async (profileData: Partial<User>) => {
    if (!currentUser) return;
    const cleanTg = profileData.telegramUsername ? profileData.telegramUsername.replace(/^@/, '') : currentUser.telegramUsername;
    const updatedUser: User = {
      ...currentUser,
      ...profileData,
      telegramUsername: cleanTg
    };
    setCurrentUser(updatedUser);
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u)
    }));
    try {
      const res = await api.updateStudentProfile({ id: currentUser.id, ...profileData, telegramUsername: cleanTg });
      return res;
    } catch (e) {
      return { success: true, user: updatedUser };
    }
  };

  const requestDeposit = async (amount: number, telegramUsername?: string, method = 'telegram_bot', receiptUrl?: string, cardNumber?: string, note?: string) => {
    if (!currentUser) return;
    const cleanTg = (telegramUsername || currentUser.telegramUsername || '').replace(/^@/, '');
    const code = `DEP-${Math.floor(10000 + Math.random() * 90000)}`;
    const userEmail = currentUser?.email || (currentUser?.phone ? `${currentUser.phone.replace(/\D/g, '')}@fayzullo-math.uz` : 'user@fayzullo-math.uz');

    // To'lov faqat bitta joyda (serverdagi /api/deposits/request orqali) Supabase va DBga yoziladi
    // Bu orqali qo'shaloq yozilish to'liq bartaraf etiladi
    try {
      const res = await api.requestDeposit({
        userId: currentUser.id,
        userName: `${currentUser.name} ${currentUser.surname || ''}`.trim(),
        userPhone: currentUser.phone,
        telegramUsername: cleanTg,
        amount: Number(amount),
        method,
        receiptUrl,
        cardNumber,
        note
      });
      await refreshDb();
      return res;
    } catch (e) {
      console.warn('requestDeposit error:', e);
      await refreshDb();
      return { success: true };
    }
  };

  const approveDeposit = async (depositId: string) => {
    // 1. Supabase'dagi payments jadvalida statusni 'approved' qilamiz
    try {
      await supabase
        .from('payments')
        .update({ status: 'approved' })
        .eq('id', depositId);
    } catch (supErr) {
      console.warn('Supabase payments update approved error:', supErr);
    }

    // O'quvchini user_email orqali aniq topamiz
    const targetTx = db.depositTransactions?.find(t => t.id === depositId);
    const userEmail = (targetTx as any)?.user_email || targetTx?.userId;
    const depositAmount = targetTx?.amount || 0;

    let calculatedNewBalance = 0;

    // 2. Local state'da balansni oshiramiz
    setDb(prev => {
      const txs = (prev.depositTransactions || []).map(t => {
        if (t.id === depositId) {
          return { ...t, status: 'approved' as const, approvedAt: new Date().toISOString() };
        }
        return t;
      });

      const updatedUsers = prev.users.map(u => {
        const isTarget = (userEmail && u.email && u.email.toLowerCase() === userEmail.toLowerCase()) ||
                         (targetTx?.userId && u.id === targetTx.userId);
        if (isTarget) {
          calculatedNewBalance = (u.balance || 0) + depositAmount;
          return { ...u, balance: calculatedNewBalance };
        }
        return u;
      });

      if (currentUser && ((userEmail && currentUser.email && currentUser.email.toLowerCase() === userEmail.toLowerCase()) || (targetTx?.userId && currentUser.id === targetTx.userId))) {
        setCurrentUser({
          ...currentUser,
          balance: (currentUser.balance || 0) + depositAmount
        });
      }

      return {
        ...prev,
        depositTransactions: txs,
        users: updatedUsers
      };
    });

    // 3. Supabase profiles jadvalida balansni oshiramiz
    if (userEmail) {
      try {
        // Avval mavjud balansni tortib tekshiramiz
        const { data: profData } = await supabase
          .from('profiles')
          .select('balance')
          .eq('email', userEmail)
          .single();

        const currentSupaBalance = profData?.balance ? Number(profData.balance) : 0;
        const finalSupaBalance = currentSupaBalance + depositAmount;

        const { error: profErr } = await supabase
          .from('profiles')
          .update({ balance: finalSupaBalance })
          .eq('email', userEmail);

        if (profErr) {
          console.warn('Supabase profiles balance update notice:', profErr.message);
        } else {
          console.log(`✅ Supabase profiles balance updated for ${userEmail}: ${finalSupaBalance}`);
        }
      } catch (err: any) {
        console.warn('Supabase profiles update exception:', err?.message || err);
      }
    }

    // 4. Server API orqali ham tasdiqlash
    try {
      await api.approveDeposit(depositId);
    } catch (e) {
      console.warn('api.approveDeposit error:', e);
    }

    await refreshDb();
    return { success: true };
  };

  const rejectDeposit = async (depositId: string) => {
    // 1. Supabase'dagi payments jadvalining status ustunini 'rejected'ga update qilamiz
    try {
      await supabase
        .from('payments')
        .update({ status: 'rejected' })
        .eq('id', depositId);
    } catch (supErr) {
      console.warn('Supabase payments update rejected error', supErr);
    }

    setDb(prev => ({
      ...prev,
      depositTransactions: (prev.depositTransactions || []).map(t =>
        t.id === depositId ? { ...t, status: 'rejected' as const } : t
      )
    }));

    try {
      const res = await api.rejectDeposit(depositId);
      await refreshDb();
      return res;
    } catch (e) {
      await refreshDb();
      return { success: true };
    }
  };

  const updateBotSettings = async (settings: Partial<TelegramBotSettings>) => {
    setDb(prev => ({
      ...prev,
      telegramBotSettings: {
        ...prev.telegramBotSettings,
        ...settings
      }
    }));

    try {
      const res = await api.updateBotSettings(settings);
      return res;
    } catch (e) {
      return { success: true };
    }
  };

  const saveAiKey = async (apiKey: string) => {
    try {
      const res = await api.saveAiKey(apiKey);
      await refreshDb();
      return res;
    } catch (e: any) {
      return { success: false, message: e?.message || 'AI kalitini saqlashda xatolik' };
    }
  };

  const resetAiKey = async () => {
    try {
      const res = await api.resetAiKey();
      await refreshDb();
      return res;
    } catch (e: any) {
      return { success: false, message: e?.message || 'Qaytarishda xatolik' };
    }
  };

  const getAiStatus = async () => {
    try {
      return await api.getAiStatus();
    } catch (e: any) {
      return { success: false, provider: 'gemini', activeModel: 'gemini-3.8-flash', providerLabel: 'Gemini (Standart)' };
    }
  };

  const getAiDiagnostic = async (force?: boolean) => {
    try {
      return await api.getAiDiagnostic(force);
    } catch (e: any) {
      return {
        success: false,
        status: 'network_error',
        balanceStatus: 'warning',
        message: e?.message || 'Diagnostika xatosi'
      };
    }
  };

  // Translations helper
  const translations: Record<string, Record<Language, string>> = {
    brand_name: { uz: 'Fayzullo Matematika Akademiyasi', ru: 'Академия Математики Файзуллоха', en: 'Fayzullo Math Academy' },
    nav_home: { uz: 'Bosh Sahifa', ru: 'Главная', en: 'Home' },
    nav_courses: { uz: 'Kurslar', ru: 'Курсы', en: 'Courses' },
    nav_demo: { uz: 'Demo Dars', ru: 'Демо урок', en: 'Demo Lesson' },
    nav_results: { uz: 'Natijalar', ru: 'Результаты', en: 'Results' },
    nav_mock: { uz: 'Milliy Sertifikat Test', ru: 'Тест Сертификат', en: 'Mock Test' },
    nav_vip: { uz: 'VIP Tariflar', ru: 'VIP Тарифы', en: 'VIP Plans' },
    btn_login: { uz: 'Kirish', ru: 'Войти', en: 'Sign In' },
    btn_register: { uz: 'Ro‘yxatdan o‘tish', ru: 'Регистрация', en: 'Register' }
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <AppContext.Provider
      value={{
        db,
        loading,
        activeSite,
        setActiveSite,
        currentUser,
        setCurrentUser,
        isOwnerAuth,
        setIsOwnerAuth,
        theme,
        toggleTheme,
        language,
        setLanguage,
        activeCourseId,
        setActiveCourseId,
        activeTestId,
        setActiveTestId,
        refreshDb,
        unifiedLogin,
        registerStudent,
        ownerChangePassword,
        logout,
        toggleLessonCompletion,
        submitTestAttempt,
        createCourse,
        updateCourse,
        deleteCourse,
        createLesson,
        updateLesson,
        deleteLesson,
        createTest,
        updateTest,
        deleteTest,
        createQuestion,
        deleteQuestion,
        createStudentResult,
        updateStudentResult,
        deleteStudentResult,
        updateSiteSections,
        updateVIPPlans,
        updateStudentVIP,
        purchaseVIPPlan,
        toggleStudentBlock,
        createSupportTicket,
        replySupportTicket,
        updateTeacherProfile,
        updateSiteTheme,
        updateLeaderboard,
        updateThematicOlympiad,
        updateStudentFull,
        deleteStudent,
        updateSiteCreators,
        updateSiteCreator,
        updateStudentProfile,
        requestDeposit,
        approveDeposit,
        rejectDeposit,
        updateBotSettings,
        saveAiKey,
        resetAiKey,
        getAiStatus,
        getAiDiagnostic,
        isStaticDemoMode,
        setIsStaticDemoMode,
        switchDemoRole,
        resetDemoData,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
