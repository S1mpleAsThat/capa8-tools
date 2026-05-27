// src/hooks/useLanguage.js

import { useLanguageContext } from "../context/LanguageContext";

export default function useLanguage() {
  return useLanguageContext();
}