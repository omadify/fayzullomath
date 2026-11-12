import { AppDatabase, Course, Lesson, Test, Question, TestAttempt, SiteSection, StudentResult, SupportTicket, NotificationItem, VIPPlan, TeacherProfile, User } from '../types';

class ApiService {
  async fetchAllDb(): Promise<AppDatabase> {
    const res = await fetch('/api/db/all');
    if (!res.ok) throw new Error('Ma’lumotlar bazasini yuklab bo‘lmadi');
    const json = await res.json();
    return json.data;
  }

  // Unified login: handles student phone number or Creator 'fayzullo' + password
  async unifiedLogin(loginInput: string, password?: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginInput, password })
    });
    return res.json();
  }

  async registerStudent(data: { name: string; surname?: string; identifier?: string; phone?: string; email?: string; password?: string; region?: string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async ownerChangePassword(oldPassword: string, newPassword: string) {
    const res = await fetch('/api/auth/owner-change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    return res.json();
  }

  async createCourse(course: Partial<Course>) {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return res.json();
  }

  async updateCourse(id: string, course: Partial<Course>) {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return res.json();
  }

  async deleteCourse(id: string) {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    return res.json();
  }

  async createLesson(lesson: Partial<Lesson>) {
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson)
    });
    return res.json();
  }

  async updateLesson(id: string, lesson: Partial<Lesson>) {
    const res = await fetch(`/api/lessons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson)
    });
    return res.json();
  }

  async deleteLesson(id: string) {
    const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
    return res.json();
  }

  async toggleLessonComplete(userId: string, lessonId: string) {
    const res = await fetch('/api/lessons/toggle-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, lessonId })
    });
    return res.json();
  }

  async createTest(test: Partial<Test>) {
    const res = await fetch('/api/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test)
    });
    return res.json();
  }

  async updateTest(id: string, test: Partial<Test>) {
    const res = await fetch(`/api/tests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test)
    });
    return res.json();
  }

  async deleteTest(id: string) {
    const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
    return res.json();
  }

  async createQuestion(question: Partial<Question>) {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question)
    });
    return res.json();
  }

  async deleteQuestion(id: string) {
    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    return res.json();
  }

  async submitTestAttempt(data: { userId: string; testId: string; answers: Record<string, number>; timeSpentSeconds: number }) {
    const res = await fetch('/api/test-attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // O‘quvchilar Natijalari (Owner CRUD)
  async createStudentResult(result: Partial<StudentResult>) {
    const res = await fetch('/api/student-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    return res.json();
  }

  async updateStudentResult(id: string, result: Partial<StudentResult>) {
    const res = await fetch(`/api/student-results/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    return res.json();
  }

  async deleteStudentResult(id: string) {
    const res = await fetch(`/api/student-results/${id}`, { method: 'DELETE' });
    return res.json();
  }

  async bulkUploadStudentResults(items: Array<{ filename: string; base64: string }>) {
    const res = await fetch('/api/owner/bulk-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    return res.json();
  }

  async updateSiteSections(sections: SiteSection[]) {
    const res = await fetch('/api/site-sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sections)
    });
    return res.json();
  }

  async updateVIPPlans(plans: VIPPlan[]) {
    const res = await fetch('/api/vip-plans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plans)
    });
    return res.json();
  }

  async updateStudentVIP(userId: string, vipTier: string, durationDays: number) {
    const res = await fetch('/api/users/update-vip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, vipTier, durationDays })
    });
    return res.json();
  }

  async toggleStudentBlock(userId: string) {
    const res = await fetch('/api/users/toggle-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  }

  async createSupportTicket(ticket: Partial<SupportTicket>) {
    const res = await fetch('/api/support-tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    return res.json();
  }

  async replySupportTicket(ticketId: string, replyText: string) {
    const res = await fetch('/api/support-tickets/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, replyText })
    });
    return res.json();
  }

  async solveMathWithAI(question: string, userVIP: string) {
    const res = await fetch('/api/ai/solve-math', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userVIP })
    });
    return res.json();
  }

  async generateQuizWithAI(topicOrText: string, count: number = 3) {
    const res = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicOrText, count })
    });
    return res.json();
  }

  async checkHomeworkWithAI(questionPrompt: string, studentAnswer: string) {
    const res = await fetch('/api/ai/check-homework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionPrompt, studentAnswer })
    });
    return res.json();
  }

  async askCounselorWithAI(promptText: string, studentName?: string) {
    const res = await fetch('/api/ai/ask-counselor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptText, studentName })
    });
    return res.json();
  }

  // Creator Advanced Controls
  async updateTeacherProfile(profile: Partial<TeacherProfile>) {
    const res = await fetch('/api/owner/teacher-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return res.json();
  }

  async updateSiteTheme(themeConfig: { activeBackground: string; allowUserThemeOverride?: boolean }) {
    const res = await fetch('/api/owner/site-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(themeConfig)
    });
    return res.json();
  }

  async updateLeaderboard(leaderboard: any[]) {
    const res = await fetch('/api/owner/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaderboard })
    });
    return res.json();
  }

  async updateThematicOlympiad(thematicOlympiad: any) {
    const res = await fetch('/api/owner/olympiad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thematicOlympiad })
    });
    return res.json();
  }

  async updateStudentFull(studentData: any) {
    const res = await fetch('/api/owner/students/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    return res.json();
  }

  async deleteStudent(studentId: string) {
    const res = await fetch(`/api/owner/students/${studentId}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  async updateSiteCreators(siteCreators: any[]) {
    const res = await fetch('/api/owner/site-creators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteCreators })
    });
    return res.json();
  }

  async updateStudentProfile(profileData: any) {
    const res = await fetch('/api/student/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  }

  async uploadAsset(imageBase64: string, filename?: string) {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, filename })
    });
    return res.json();
  }

  async requestDeposit(depositData: {
    userId: string;
    userName: string;
    userPhone: string;
    telegramUsername?: string;
    amount: number;
    method?: string;
    receiptUrl?: string;
    cardNumber?: string;
    note?: string;
  }) {
    const res = await fetch('/api/deposits/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(depositData)
    });
    return res.json();
  }

  async approveDeposit(depositId: string) {
    const res = await fetch(`/api/owner/deposits/approve/${depositId}`, {
      method: 'POST'
    });
    return res.json();
  }

  async rejectDeposit(depositId: string) {
    const res = await fetch(`/api/owner/deposits/reject/${depositId}`, {
      method: 'POST'
    });
    return res.json();
  }

  async updateBotSettings(botSettings: any) {
    const res = await fetch('/api/owner/bot-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botSettings })
    });
    return res.json();
  }

  // Universal AI Key & Speed Engine
  async getAiStatus() {
    const res = await fetch('/api/ai/status');
    return res.json();
  }

  async saveAiKey(apiKey: string) {
    const res = await fetch('/api/owner/ai-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    return res.json();
  }

  async resetAiKey() {
    const res = await fetch('/api/owner/ai-key/reset', {
      method: 'POST'
    });
    return res.json();
  }

  async getAiDiagnostic(force?: boolean) {
    const res = await fetch(`/api/ai/live-diagnostic${force ? '?force=true' : ''}`);
    return res.json();
  }
}

export const api = new ApiService();
