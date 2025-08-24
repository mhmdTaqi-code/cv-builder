// src/hooks/useAISuggest.js
import { useRef, useState } from "react";
import axios from "axios";

export default function useAISuggest() {
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const suggestSkills = async (title) => {
    if (!title) return [];
    abortRef.current?.abort?.();
    abortRef.current = new AbortController();

    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://gemeni-skills-cv-api-4acy.vercel.app/api/suggest-skills",
        { title },
        { signal: abortRef.current.signal }
      );
      // سيرفرك يرجّع Array<string>
      return Array.isArray(data) ? data : data?.skills || [];
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { suggestSkills, loading };
}
