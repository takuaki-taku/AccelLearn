import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { useTasks } from '../../hooks/useTasks';
import { getTodaysTasks, judgeTask, todayString } from '../../utils/scheduler';
import { useThemeToggle } from '../../hooks/useTheme';
import { TaskCard } from '../../components/TaskCard';
import { AddTaskModal } from '../../components/AddTaskModal';
import { HowToModal } from '../../components/HowToModal';
import { AccelTask, AttemptResult, ReviewEntry } from '../../types/task';

const HOWTO_KEY = 'accellearn_howto_shown';

export default function QueueScreen() {
  const { tasks, loading, addTask, updateTask } = useTasks();
  const [queue, setQueue] = useState<AccelTask[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [howToVisible, setHowToVisible] = useState(false);
  const { colorScheme } = useColorScheme();
  const { toggle } = useThemeToggle();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    AsyncStorage.getItem(HOWTO_KEY).then((shown) => {
      if (!shown) {
        setHowToVisible(true);
        AsyncStorage.setItem(HOWTO_KEY, '1');
      }
    });
  }, []);

  useEffect(() => {
    if (!loading && !initialized) {
      setQueue(getTodaysTasks(tasks));
      setInitialized(true);
    }
  }, [loading, tasks, initialized]);

  function handleJudge(task: AccelTask, result: AttemptResult) {
    const changes = judgeTask(task, result);
    const entry: ReviewEntry = { stage: task.reviewStage, result, date: todayString() };
    updateTask(task.id, {
      ...changes,
      reviewHistory: [...(task.reviewHistory ?? []), entry],
    });
    setQueue((prev) => prev.filter((t) => t.id !== task.id));
  }

  async function handleAddTask(input: {
    title: string;
    tag?: string;
    referenceUrl?: string;
    memo?: string;
    firstAttemptResult: AttemptResult;
  }) {
    await addTask(input);
    setModalVisible(false);
  }

  const existingTags = [...new Set(tasks.map((t) => t.tag).filter((t): t is string => Boolean(t)))];
  const iconColor = isDark ? '#a1a1aa' : '#71717a';

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950 items-center justify-center">
        <Text className="text-zinc-500 dark:text-zinc-400">読み込み中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="px-4 pt-6 pb-3 flex-row items-start justify-between">
        <View>
          <Text className="text-zinc-900 dark:text-white text-3xl font-extrabold tracking-tight">Today's Queue</Text>
          <Text className="text-zinc-500 dark:text-zinc-400 mt-1">
            {queue.length > 0 ? `${queue.length}件 残っています` : '記憶を加速させよう⚡'}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 pt-1">
          <TouchableOpacity onPress={() => setHowToVisible(true)} className="p-1">
            <Ionicons name="information-circle-outline" size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggle} className="p-1">
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {queue.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">⚡</Text>
          <Text className="text-zinc-900 dark:text-white text-xl font-bold">本日のタスク完了！</Text>
          <Text className="text-zinc-500 dark:text-zinc-400 mt-2">また明日</Text>
        </View>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onJudge={(result) => handleJudge(item, result)}
            />
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-8 right-6 bg-yellow-400 w-14 h-14 rounded-full items-center justify-center"
        style={{ elevation: 6 }}
      >
        <Text className="text-zinc-900 text-3xl font-light" style={{ lineHeight: 36 }}>+</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddTask}
        existingTags={existingTags}
      />

      <HowToModal
        visible={howToVisible}
        onClose={() => setHowToVisible(false)}
      />
    </SafeAreaView>
  );
}
