import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const HISTORY_KEY = "@search_history";
const MAX_HISTORY = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then((stored) => {
      if (stored) setHistory(JSON.parse(stored));
    });
  }, []);

  const addToHistory = useCallback(async (term: string) => {
    if (!term.trim()) return;
    setHistory((prev) => {
      const updated = [term, ...prev.filter((h) => h !== term)].slice(
        0,
        MAX_HISTORY,
      );
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  }, []);

  return { history, addToHistory, clearHistory };
};
