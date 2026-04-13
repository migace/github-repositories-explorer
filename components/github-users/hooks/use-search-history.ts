import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const HISTORY_KEY = "@search_history";
const MAX_HISTORY = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then((stored) => {
      if (stored) setHistory(JSON.parse(stored));
      initialized.current = true;
    });
  }, []);

  useEffect(() => {
    if (initialized.current) {
      if (history.length === 0) {
        AsyncStorage.removeItem(HISTORY_KEY);
      } else {
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    }
  }, [history]);

  const addToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    setHistory((prev) =>
      [term, ...prev.filter((h) => h !== term)].slice(0, MAX_HISTORY),
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
};
