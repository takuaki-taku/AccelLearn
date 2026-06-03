import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../../hooks/useTasks';
import { addDays, REVIEW_DAYS } from '../../utils/scheduler';
import { useTheme } from '../../hooks/useTheme';
import { EditTaskModal } from '../../components/EditTaskModal';
import { AddTaskModal } from '../../components/AddTaskModal';
import { AccelTask, AttemptResult } from '../../types/task';

const STAGE_OFFSETS = [0, ...REVIEW_DAYS];
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
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const { isDark } = useTheme();
  const [editingTask, setEditingTask] = useState<AccelTask | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('すべて');

  const bg = isDark ? 'bg-zinc-950' : 'bg-white';
  const titleText = isDark ? 'text-white' : 'text-zinc-900';
  const subText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const mutedText = isDark ? 'text-zinc-600' : 'text-zinc-400';
  const rowBorder = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const tagBg = isDark ? 'bg-zinc-800' : 'bg-zinc-100';

  const existingTags = [...new Set(tasks.map((t) => t.tag).filter((t): t is string => Boolean(t)))];
  const allTagFilters = ['すべて', ...existingTags];
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

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${bg} items-center justify-center`}>
        <Text className={subText}>読み込み中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${bg}`}>
      <View className="px-4 pt-6 pb-3">
        <Text className={`${titleText} text-3xl font-extrabold tracking-tight`}>All Tasks</Text>
        <Text className={`${subText} mt-1`}>
          {tasks.length > 0 ? `${tasks.length}件登録中` : 'タスクがありません'}
        </Text>
      </View>

      {existingTags.length > 0 && (
        <View style={{ height: 44 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
          >
            {allTagFilters.map((t, i) => (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedTag(t)}
                style={{ marginRight: i < allTagFilters.length - 1 ? 8 : 0 }}
                className={selectedTag === t ? 'bg-yellow-400 rounded-full px-4 py-1' : `${tagBg} rounded-full px-4 py-1`}
              >
                <Text className={selectedTag === t ? 'text-zinc-900 font-semibold text-sm' : `${subText} text-sm`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {tasks.length > 0 && (
        <View className={`flex-row items-center px-4 py-2 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <Text className={`flex-1 ${mutedText} text-xs`}>タスク名</Text>
          {STAGE_LABELS.map((label) => (
            <View key={label} style={{ width: COL_WIDTH }} className="items-center">
              <Text className={`${mutedText} text-xs`}>{label}</Text>
            </View>
          ))}
        </View>
      )}

      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className={`${mutedText} text-base`}>＋ボタンからタスクを追加してください</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const history = item.reviewHistory ?? [];
            return (
              <TouchableOpacity
                onPress={() => setEditingTask(item)}
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.7}
                className={`flex-row items-center px-4 py-3 border-b ${rowBorder}`}
              >
                <View className="flex-1 pr-2">
                  <Text className={`${titleText} text-sm font-semibold`} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {item.tag ? (
                    <Text className={`${mutedText} text-xs mt-0.5`}>{item.tag}</Text>
                  ) : null}
                </View>

                {STAGE_OFFSETS.map((offset, stageIndex) => {
                  const dateStr = addDays(item.createdAt, offset);
                  const entry = history.find((e) => e.stage === stageIndex);
                  return (
                    <View key={stageIndex} style={{ width: COL_WIDTH }} className="items-center">
                      <Text className={`${mutedText} text-xs`}>{toMD(dateStr)}</Text>
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
        initialTag={selectedTag !== 'すべて' ? selectedTag : undefined}
      />

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
        existingTags={existingTags}
      />
    </SafeAreaView>
  );
}
