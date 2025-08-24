// src/store/useResumeStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "resume-data-v1";

const makeInitial = () => ({
  basics: { name: "", email: "", phone: "", location: "" },
  education: [{ school: "", degree: "", start: "", end: "" }],
  experience: [{ company: "", role: "", start: "", end: "", bullets: [""] }],
  projects: [{ name: "", link: "", desc: "" }],
  skills: [], // المهارات المختارة فعليًا
});

const useResumeStore = create(
  persist(
    (set) => ({
      // ---------- state ----------
      resume: makeInitial(),
      skillSuggestions: [], // 👈 مهم: حالة ابتدائية للاقتراحات خارج resume

      // ---------- actions ----------
      setResume: (values) => set({ resume: values }),

      setBasics: (basics) =>
        set((state) => ({ resume: { ...state.resume, basics } })),

      setEducation: (education) =>
        set((state) => ({ resume: { ...state.resume, education } })),

      // ملاحظة: لاحقًا وحّد الاسم إلى setExperience إن حبيت
      setexperience: (experience) =>
        set((state) => ({ resume: { ...state.resume, experience } })),

      setProjects: (projects) =>
        set((state) => ({ resume: { ...state.resume, projects } })),

      // تنظيف وتوحيد (trim + unique)
      setSkills: (skills) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: Array.from(
              new Set(
                (skills || []).map((s) => String(s).trim()).filter(Boolean)
              )
            ),
          },
        })),

      // اقتراحات من الذكاء (أسماء فقط)
      setSkillSuggestions: (list) =>
        set(() => ({
          skillSuggestions: Array.from(
            new Set((list || []).map((s) => String(s).trim()).filter(Boolean))
          ),
        })),

      resetResume: () => set({ resume: makeInitial() }),

      // مسح التخزين المحلي + تصفير الحالة فورًا
      hardReset: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.warn("Failed to remove persisted key:", e);
        }
        set({ resume: makeInitial(), skillSuggestions: [] });
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),

      // خزّن فقط ما نحتاجه
      partialize: (state) => ({
        resume: state.resume,
        skillSuggestions: state.skillSuggestions, // 👈 نخزن الاقتراحات أيضًا (اختياري)
      }),
    }
  )
);

export default useResumeStore;
