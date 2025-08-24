import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "resume-data-v1";

const makeInitial = () => ({
  basics: { name: "", email: "", phone: "", location: "" },
  education: [{ school: "", degree: "", start: "", end: "" }],
  experience: [{ company: "", role: "", start: "", end: "", bullets: [""] }],
  projects: [{ name: "", link: "", desc: "" }],
  skills: [],
});

const useResumeStore = create(
  persist(
    (set) => ({
      resume: makeInitial(),

      // actions
      setResume: (values) => set({ resume: values }),

      setBasics: (basics) =>
        set((state) => ({ resume: { ...state.resume, basics } })),

      setEducation: (education) =>
        set((state) => ({ resume: { ...state.resume, education } })),

      setexperience: (experience) =>
        set((state) => ({ resume: { ...state.resume, experience } })),

      setProjects: (projects) =>
        set((state) => ({ resume: { ...state.resume, projects } })),

      setSkills: (skills) =>
        set((state) => ({ resume: { ...state.resume, skills } })),

      setSkillSuggestions: (list) =>
        set(() => ({ skillSuggestions: list || [] })),

      resetResume: () => set({ resume: makeInitial() }),

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
      partialize: (state) => ({
        resume: state.resume,
        skillSuggestions: state.skillSuggestions,
      }),
    }
  )
);

export default useResumeStore;
