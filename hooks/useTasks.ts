import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccelTask, AttemptResult, ReviewEntry } from '../types/task';
import { todayString, getInitialNextReviewDate } from '../utils/scheduler';

const STORAGE_KEY = 'accellearn_tasks';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useTasks() {
  const [tasks, setTasks] = useState<AccelTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setTasks(JSON.parse(raw));
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: AccelTask[]) => {
    setTasks(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addTask = useCallback(
    async (input: Pick<AccelTask, 'title' | 'referenceUrl' | 'memo' | 'tag'> & { firstAttemptResult: AttemptResult }): Promise<AccelTask> => {
      const today = todayString();
      const firstEntry: ReviewEntry = { stage: 0, result: input.firstAttemptResult, date: today };
      const task: AccelTask = {
        id: generateId(),
        title: input.title,
        tag: input.tag,
        referenceUrl: input.referenceUrl,
        memo: input.memo,
        firstAttemptResult: input.firstAttemptResult,
        reviewStage: 0,
        nextReviewDate: getInitialNextReviewDate(today, input.firstAttemptResult),
        createdAt: today,
        reviewHistory: [firstEntry],
      };
      await persist([...tasks, task]);
      return task;
    },
    [tasks, persist],
  );

  const updateTask = useCallback(
    (id: string, changes: Partial<AccelTask>) => {
      const next = tasks.map((t) => (t.id === id ? { ...t, ...changes } : t));
      return persist(next);
    },
    [tasks, persist],
  );

  const deleteTask = useCallback(
    (id: string) => {
      return persist(tasks.filter((t) => t.id !== id));
    },
    [tasks, persist],
  );

  return { tasks, loading, addTask, updateTask, deleteTask };
}
