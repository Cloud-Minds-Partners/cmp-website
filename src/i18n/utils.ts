// src/i18n/utils.ts
// Source: https://docs.astro.build/en/recipes/i18n/
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const ui = { en, pt, es } as const;
export const defaultLang = 'en' as const;
export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui['en']): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}
