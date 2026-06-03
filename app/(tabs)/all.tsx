import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../../hooks/useTasks';
import { addDays, REVIEW_DAYS } from '../../utils/scheduler';
import { EditTaskModal } from '../../components/EditTaskModal';
import { AccelTask, AttemptResult } from '../../types/task';

const STAGE_OFFSETS = [0, ...REVIEW_DAYS]; // [0, 1, 7, 21]
const STAGE_LABELS = ['1日目', '2日目', '1週間', '3週間'];
const COL_WIDTH = 52;

const RESULT_SYMBOLS: Record<AttemptResult, string> = {
  circle: '⭕',
  triangle: '△',
  cross: '✗',
};

function toMD(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
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
  const [selectedTag, setSelectedTag] = useState<string>('すべて');

  const allTags = ['すべて', ...Array.from(new Set(tasks.map((t) => t.tag).filter((t): t is string => Boolean(t))))];
  const filtered = selectedTag === 'すべて' ? tasks : tasks.filter((t) => t.tag === selectedTag);
  const sorted = sortTasks(filtered);

  function handleLongPress(task: AccelTask) {
    Alert.alert(
      task.title,
      'このタスクを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除', style: 'destructive', onPress: () => deleteTask(task.id) },
      ],
    );
  }

  function handleSaveEdit(taskId: string, input: { title: string; tag?: string; referenceUrl?: string; memo?: string }) {
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

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="px-4 pt-6 pb-3">
        <Text className="text-white text-3xl font-extrabold tracking-tight">All Tasks</Text>
        <Text className="text-zinc-400 mt-1">
          {tasks.length > 0 ? `${tasks.length}件登録中` : 'タスクがありません'}
        </Text>
      </View>

      {/* タグフィルターピル */}
      {allTags.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8, flexDirection: 'row' }}
        >
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => setSelectedTag(tag)}
              className={selectedTag === tag ? 'bg-yellow-400 rounded-full px-4 py-1' : 'bg-zinc-800 rounded-full px-4 py-1'}
            >
              <Text className={selectedTag === tag ? 'text-zinc-900 font-semibold text-sm' : 'text-zinc-400 text-sm'}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* カラムヘッダー */}
      {tasks.length > 0 && (
        <View className="flex-row items-center px-4 pb-2 border-b border-zinc-800">
          <Text className="flex-1 text-zinc-600 text-xs">タスク名</Text>
          {STAGE_LABELS.map((label) => (
            <View key={label} style={{ width: COL_WIDTH }} className="items-center">
              <Text className="text-zinc-600 text-xs">{label}</Text>
            </View>
          ))}
        </View>
      )}

      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-zinc-600 text-base">＋ボタンからタスクを追加してください</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => {
            const history = item.reviewHistory ?? [];
            return (
              <TouchableOpacity
                onPress={() => setEditingTask(item)}
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.7}
                className="flex-row items-center px-4 py-3 border-b border-zinc-800"
              >
                <View className="flex-1 pr-2">
                  <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                    {item.title}
                  </Text>
                  {item.tag ? (
                    <Text className="text-zinc-600 text-xs mt-0.5">{item.tag}</Text>
                  ) : null}
                </View>

                {STAGE_OFFSETS.map((offset, stageIndex) => {
                  const dateStr = addDays(item.createdAt, offset);
                  const entry = history.find((e) => e.stage === stageIndex);
                  return (
                    <View key={stageIndex} style={{ width: COL_WIDTH }} className="items-center">
                      <Text className="text-zinc-600 text-xs">{toMD(dateStr)}</Text>
                      {entry ? (
                        <Text className="text-base" style={{ lineHeight: 20 }}>
                          {RESULT_SYMBOLS[entry.result]}
                        </Text>
                      ) : (
                        <View style={{ height: 20 }} />
                      )}
                    </View>
                  );
                })}
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
