import * as React from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  // An explicit user choice (from a previous toggle click) always wins.
  // Only fall back to the OS-level preference if they've never chosen.
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return getSystemTheme();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(getInitialTheme);
  // Tracks whether the person has ever clicked the toggle. Until they do,
  // we keep following the OS setting live (e.g. they switch their laptop
  // into dark mode at sunset); once they make an explicit choice, that
  // choice is sticky and stops following the system.
  const hasExplicitChoice = React.useRef(
    typeof window !== "undefined" && window.localStorage.getItem(THEME_STORAGE_KEY) !== null,
  );

  const setTheme = React.useCallback((next: Theme) => {
    hasExplicitChoice.current = true;
    setThemeState(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Reflect the theme on <html> so global CSS ([data-theme="dark"] in
  // index.css) applies everywhere, not just inside whatever component
  // happens to read this context.
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Follow OS-level theme changes live, but only until the person makes
  // their own explicit choice via the toggle.
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (e: MediaQueryListEvent) => {
      if (hasExplicitChoice.current) return;
      setThemeState(e.matches ? "dark" : "light");
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const value = React.useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}