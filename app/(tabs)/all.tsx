import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../../hooks/useTasks';
import { todayString } from '../../utils/scheduler';
import { EditTaskModal } from '../../components/EditTaskModal';
import { AccelTask, AttemptResult } from '../../types/task';

const RESULT_SYMBOLS: Record<AttemptResult, string> = {
  circle: '⭕',
  triangle: '△',
  cross: '✗',
};

const STAGE_LABELS: Record<number, string> = {
  0: '第1回待ち',
  1: '第2回待ち',
  2: '第3回待ち',
};

function formatNextReview(nextReviewDate: string | null): string {
  if (!nextReviewDate) return 'マスター済み';
  const today = todayString();
  if (nextReviewDate === today) return '今日';
  const diff = Math.round(
    (new Date(nextReviewDate).getTime() - new Date(today).getTime()) / 86400000,
  );
  if (diff === 1) return '明日';
  if (diff > 1) return `${diff}日後`;
  return `${Math.abs(diff)}日前`;
}

function sortTasks(tasks: AccelTask[]): AccelTask[] {
  const active = tasks
    .filter((t) => t.nextReviewDate !== null)
    .sort((a, b) => a.nextReviewDate!.localeCompare(b.nextReviewDate!));
  const completed = tasks
    .filter((t) => t.nextReviewDate === null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return [...active, ...completed];
}

export default function AllTasksScreen() {
  const { tasks, loading, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<AccelTask | null>(null);

  function handleLongPress(task: AccelTask) {
    Alert.alert(
      task.title,
      'このタスクを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ],
    );
  }

  function handleSaveEdit(taskId: string, input: { title: string; referenceUrl?: string; memo?: string }) {
    updateTask(taskId, input);
    setEditingTask(null);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
        <Text className="text-zinc-400">読み込み中...</Text>
      </SafeAreaView>
    );
  }

  const sorted = sortTasks(tasks);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="px-4 py-6">
        <Text className="text-white text-3xl font-extrabold tracking-tight">All Tasks</Text>
        <Text className="text-zinc-400 mt-1">
          {tasks.length > 0 ? `${tasks.length}件登録中` : 'タスクがありません'}
        </Text>
      </View>

      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-zinc-600 text-base">＋ボタンからタスクを追加してください</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          renderItem={({ item }) => {
            const isDue = item.nextReviewDate !== null && item.nextReviewDate <= todayString();
            const isCompleted = item.nextReviewDate === null;
            const reviewLabel = formatNextReview(item.nextReviewDate);
            const stageLabel = !isCompleted ? STAGE_LABELS[item.reviewStage] : undefined;

            return (
              <TouchableOpacity
                onPress={() => setEditingTask(item)}
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.7}
                className="bg-zinc-900 rounded-xl px-4 py-3 mb-2 border border-zinc-800 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className={isDue ? 'text-yellow-400 text-xs font-medium' : isCompleted ? 'text-emerald-500 text-xs font-medium' : 'text-zinc-400 text-xs'}>
                      {reviewLabel}
                    </Text>
                    {stageLabel ? (
                      <Text className="text-zinc-600 text-xs">{stageLabel}</Text>
                    ) : null}
                  </View>
                </View>
                <Text className="text-lg ml-3">{RESULT_SYMBOLS[item.firstAttemptResult]}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
    </SafeAreaView>
  );
}
