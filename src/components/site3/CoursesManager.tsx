import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, CourseLevel, VIPTier } from '../../types';
import { Plus, Trash2, Edit3, PlayCircle, Video, FileText, CheckCircle, X } from 'lucide-react';

export const CoursesManager: React.FC = () => {
  const { db, createCourse, updateCourse, deleteCourse, createLesson, updateLesson, deleteLesson } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(db.courses[0]?.id || '');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form states for Course
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLevel, setCourseLevel] = useState<CourseLevel>('sertifikat');
  const [coursePrice, setCoursePrice] = useState(390000);
  const [courseVIP, setCourseVIP] = useState<VIPTier>('start');

  // Form states for Lesson
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonVideo, setLessonVideo] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [lessonDuration, setLessonDuration] = useState(30);
  const [lessonFormula, setLessonFormula] = useState('');
  const [lessonNotes, setLessonNotes] = useState('');

  // Form states for Editing Lesson
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDesc, setEditLessonDesc] = useState('');
  const [editLessonVideo, setEditLessonVideo] = useState('');
  const [editLessonDuration, setEditLessonDuration] = useState(30);
  const [editLessonFormula, setEditLessonFormula] = useState('');
  const [editLessonNotes, setEditLessonNotes] = useState('');

  const formatVideoEmbedUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return trimmed;
  };

  const openEditLessonModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditLessonTitle(lesson.title);
    setEditLessonDesc(lesson.description || '');
    setEditLessonVideo(lesson.videoUrl || '');
    setEditLessonDuration(lesson.durationMinutes || 30);
    setEditLessonFormula(lesson.mathFormula || '');
    setEditLessonNotes(lesson.notesMarkdown || '');
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !editLessonTitle) return;

    const formattedVideo = formatVideoEmbedUrl(editLessonVideo);

    await updateLesson(editingLesson.id, {
      title: editLessonTitle,
      description: editLessonDesc,
      videoUrl: formattedVideo,
      durationMinutes: editLessonDuration,
      mathFormula: editLessonFormula,
      notesMarkdown: editLessonNotes
    });
    setEditingLesson(null);
  };

  const activeCourse = db.courses.find(c => c.id === selectedCourseId) || db.courses[0];
  const activeLessons = db.lessons.filter(l => l.courseId === activeCourse?.id);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;

    await createCourse({
      title: courseTitle,
      description: courseDesc,
      level: courseLevel,
      price: coursePrice,
      requiredVIP: courseVIP,
      published: true
    });
    setShowCourseModal(false);
    setCourseTitle('');
    setCourseDesc('');
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !lessonTitle) return;

    const formattedVideo = formatVideoEmbedUrl(lessonVideo);

    await createLesson({
      courseId: activeCourse.id,
      moduleId: activeCourse.modules[0]?.id || 'mod-1',
      title: lessonTitle,
      description: lessonDesc,
      videoUrl: formattedVideo,
      durationMinutes: lessonDuration,
      mathFormula: lessonFormula,
      notesMarkdown: lessonNotes,
      orderIndex: activeLessons.length + 1
    });

    setShowLessonModal(false);
    setLessonTitle('');
    setLessonDesc('');
    setLessonFormula('');
    setLessonNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
            Kurslar va Video Darslar Boshqaruvi
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Yangi kurslar yaratish, video darslar yuklash, konspekt va formulalar biriktirish
          </p>
        </div>

        <button
          onClick={() => setShowCourseModal(true)}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 transition-colors shadow-xs flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kurs Qo‘shish</span>
        </button>
      </div>

      {/* Courses Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {db.courses.map(course => (
          <div
            key={course.id}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all border ${
              course.id === activeCourse?.id
                ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
            }`}
          >
            <button
              onClick={() => setSelectedCourseId(course.id)}
              className="hover:underline"
            >
              {course.title}
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (confirm(`"${course.title}" kursini rostdan ham o‘chirasizmi?`)) {
                  await deleteCourse(course.id);
                  const remaining = db.courses.filter(c => c.id !== course.id);
                  if (remaining.length > 0) {
                    setSelectedCourseId(remaining[0].id);
                  }
                }
              }}
              title="O‘chirish"
              className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {activeCourse ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <span className="font-bold text-rose-600 uppercase">{activeCourse.level}</span>
                <span>·</span>
                <span>VIP: {activeCourse.requiredVIP.toUpperCase()}</span>
                <span>·</span>
                <span>Narxi: {activeCourse.price.toLocaleString()} so‘m</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                {activeCourse.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                {activeCourse.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLessonModal(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#F95738] hover:bg-[#E04828] text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Dars Qo‘shish</span>
              </button>
              <button
                onClick={async () => {
                  if (confirm('Ushbu kurs va uning barcha darslarini rostdan ham o‘chirasizmi?')) {
                    await deleteCourse(activeCourse.id);
                    const remaining = db.courses.filter(c => c.id !== activeCourse.id);
                    if (remaining.length > 0) {
                      setSelectedCourseId(remaining[0].id);
                    }
                  }
                }}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 border border-stone-200 dark:border-stone-800 transition-colors"
                title="Kursni o‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lessons List in Course */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
              Kurs Darslari ({activeLessons.length} ta)
            </h4>

            {activeLessons.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">
                Bu kursda hozircha darslar mavjud emas. Yuqoridagi "+ Dars Qo‘shish" tugmasi orqali qo‘shing.
              </p>
            ) : (
              activeLessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-800/50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-xs text-stone-600 dark:text-stone-300 shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                        {lesson.title}
                      </h5>
                      <div className="text-[11px] text-stone-500 flex items-center gap-3 mt-0.5">
                        <span>{lesson.durationMinutes} daqiqa</span>
                        {lesson.mathFormula && <span className="text-rose-500 font-mono">Formula bor</span>}
                        {lesson.pdfUrl && <span className="text-blue-500">PDF Konspekt</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditLessonModal(lesson)}
                      className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                      title="Dars va videoni tahrirlash"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Ushbu darsni o‘chirasizmi?')) {
                          await deleteLesson(lesson.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 text-center text-xs text-stone-500">
          Hozircha kurslar yo‘q. Yuqoridagi "Yangi Kurs Qo‘shish" tugmasini bosing.
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Yangi Kurs Yaratish
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Kurs Nomi *</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  placeholder="Masalan, Milliy Sertifikat A+ Yangi Dastur"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Tavsifi</label>
                <textarea
                  rows={3}
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  placeholder="Kurs kimlar uchun va nimalar o‘rgatiladi..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Bosqich / Daraja</label>
                  <select
                    value={courseLevel}
                    onChange={e => setCourseLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    <option value="sertifikat">Milliy Sertifikat</option>
                    <option value="otm">OTM Kirish Bloki</option>
                    <option value="maktab">Maktab Geometriyasi</option>
                    <option value="olimpiada">Oliy Matematika</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Talab Etiladigan VIP</label>
                  <select
                    value={courseVIP}
                    onChange={e => setCourseVIP(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    <option value="start">START</option>
                    <option value="gold">GOLD</option>
                    <option value="platinum">PLATINUM</option>
                    <option value="individual">INDIVIDUAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Narxi (so‘m)</label>
                <input
                  type="number"
                  value={coursePrice}
                  onChange={e => setCoursePrice(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-semibold mt-2"
              >
                Kursni Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowLessonModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Yangi Dars Qo‘shish: {activeCourse.title}
            </h3>

            <form onSubmit={handleCreateLesson} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Dars Mavzusi *</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={e => setLessonTitle(e.target.value)}
                  placeholder="Masalan, 3. Trigonometrik ayniyatlar va tenglamalar"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Video Embed URL (YouTube/MP4) *</label>
                <input
                  type="text"
                  required
                  value={lessonVideo}
                  onChange={e => setLessonVideo(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Davomiyligi (Daqiqa)</label>
                  <input
                    type="number"
                    value={lessonDuration}
                    onChange={e => setLessonDuration(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Asosiy Formula (LaTeX)</label>
                  <input
                    type="text"
                    value={lessonFormula}
                    onChange={e => setLessonFormula(e.target.value)}
                    placeholder="\sin^2 x + \cos^2 x = 1"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Dars Konspekti / Tavsif</label>
                <textarea
                  rows={3}
                  value={lessonNotes}
                  onChange={e => setLessonNotes(e.target.value)}
                  placeholder="Qoidalar, teoremalar va eslatmalar..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] font-semibold mt-2"
              >
                Darsni Qo‘shish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setEditingLesson(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">
              Darsni Tahrirlash
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Video havolasi (YouTube embed / MP4) va dars konspektini o‘zgartiring. O‘zgarishlar darhol brauzerda va serverda qat'iy saqlanadi.
            </p>

            <form onSubmit={handleUpdateLesson} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Dars Mavzusi *</label>
                <input
                  type="text"
                  required
                  value={editLessonTitle}
                  onChange={e => setEditLessonTitle(e.target.value)}
                  placeholder="Masalan, Trigonometriya asoslari"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Video Embed URL (YouTube/MP4) *</label>
                <input
                  type="text"
                  required
                  value={editLessonVideo}
                  onChange={e => setEditLessonVideo(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Davomiyligi (Daqiqa)</label>
                  <input
                    type="number"
                    value={editLessonDuration}
                    onChange={e => setEditLessonDuration(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Asosiy Formula (LaTeX)</label>
                  <input
                    type="text"
                    value={editLessonFormula}
                    onChange={e => setEditLessonFormula(e.target.value)}
                    placeholder="\sin^2 x + \cos^2 x = 1"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Dars Konspekti / Tavsif</label>
                <textarea
                  rows={3}
                  value={editLessonNotes}
                  onChange={e => setEditLessonNotes(e.target.value)}
                  placeholder="Qoidalar, teoremalar va eslatmalar..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="flex-1 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 font-semibold hover:bg-stone-200 transition-colors"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-semibold transition-colors"
                >
                  O‘zgarishlarni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
