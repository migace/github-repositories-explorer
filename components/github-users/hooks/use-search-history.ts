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

  const addToHistory = useCallback(
    async (term: string) => {
      if (!term.trim()) return;
      const updated = [term, ...history.filter((h) => h !== term)].slice(
        0,
        MAX_HISTORY,
      );
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    },
    [history],
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  }, []);

  return { history, addToHistory, clearHistory };
};
