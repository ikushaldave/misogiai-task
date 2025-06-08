import React, { useState, useContext, createContext, ReactNode } from "react";
import { ThemeStyles, themeStyles, ThemeValue } from "@/types/case-study";

interface ThemeContextType {
  currentTheme: ThemeStyles;
  themeName: ThemeValue;
  setTheme: (theme: ThemeValue) => void;
  availableThemes: ThemeStyles[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeValue>("default");
  const currentTheme = themeStyles[themeName];
  const availableThemes = Object.values(themeStyles);

  const setTheme = (theme: ThemeValue) => {
    setThemeName(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeName,
        setTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
