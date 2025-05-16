"use client";

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { lightTheme, darkTheme, type ThemeType } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme_preference");
        if (storedTheme !== null) {
          setIsDark(storedTheme === "dark");
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load theme preference:", error);
        setIsLoaded(true);
      }
    };

    loadThemePreference();
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.getItem("theme_preference");
      await AsyncStorage.setItem(
        "theme_preference",
        newTheme ? "dark" : "light"
      );
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  if (!isLoaded) {
    return null; // Or a loading indicator
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
