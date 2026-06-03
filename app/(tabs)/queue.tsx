import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../../hooks/useTasks';
import { getTodaysTasks, judgeTask } from '../../utils/scheduler';
import { TaskCard } from '../../components/TaskCard';
import { AddTaskModal } from '../../components/AddTaskModal';
import { AccelTask, AttemptResult } from '../../types/task';

export default function QueueScreen() {
  const { tasks, loading, addTask, updateTask } = useTasks();
  const [queue, setQueue] = useState<AccelTask[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!loading && !initialized) {
      setQueue(getTodaysTasks(tasks));
      setInitialized(true);
    }
  }, [loading, tasks, initialized]);

  function handleJudge(task: AccelTask, result: AttemptResult) {
    const changes = judgeTask(task, result);
    updateTask(task.id, changes);
    setQueue((prev) => prev.filter((t) => t.id !== task.id));
  }

  async function handleAddTask(input: {
    title: string;
    referenceUrl?: string;
    memo?: string;
    firstAttemptResult: AttemptResult;
  }) {
    await addTask(input);
    setModalVisible(false);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
        <Text className="text-zinc-400">読み込み中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="px-4 py-6">
        <Text className="text-white text-3xl font-extrabold tracking-tight">Today's Queue</Text>
        <Text className="text-zinc-400 mt-1">
          {queue.length > 0 ? `${queue.length}件 残っています` : '記憶を加速させよう⚡'}
        </Text>
      </View>

      {queue.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">⚡</Text>
          <Text className="text-white text-xl font-bold">今日のアクセル完了！</Text>
          <Text className="text-zinc-400 mt-2">また明日会おう</Text>
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
      />
    </SafeAreaView>
  );
}
