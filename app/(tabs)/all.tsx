import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../hooks/useTasks';
import { addDays, REVIEW_DAYS, judgeTask, todayString } from '../../utils/scheduler';
import { useTheme } from '../../hooks/useTheme';
import { EditTaskModal } from '../../components/EditTaskModal';
import { AddTaskModal } from '../../components/AddTaskModal';
import { JudgeModal } from '../../components/JudgeModal';
import { HowToModal } from '../../components/HowToModal';
import { AccelTask, AttemptResult, ReviewEntry } from '../../types/task';

const STAGE_OFFSETS = [0, ...REVIEW_DAYS];
const STAGE_LABELS = ['1日目', '2日目', '1週間', '3週間'];
const COL_WIDTH = 52;

const RESULT_SYMBOLS: Record<AttemptResult, string> = {
  circle: '○',
  triangle: '△',
  cross: '✗',
};

const RESULT_COLORS: Record<AttemptResult, string> = {
  circle: 'text-emerald-500',
  triangle: 'text-amber-400',
  cross: 'text-red-500',
};

function toMD(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function sortTasks(tasks: AccelTask[], today: string): AccelTask[] {
  const due = tasks
    .filter((t) => t.nextReviewDate !== null && t.nextReviewDate <= today)
    .sort((a, b) => a.nextReviewDate!.localeCompare(b.nextReviewDate!));
  const upcoming = tasks
    .filter((t) => t.nextReviewDate !== null && t.nextReviewDate > today)
    .sort((a, b) => a.nextReviewDate!.localeCompare(b.nextReviewDate!));
  const completed = tasks
    .filter((t) => t.nextReviewDate === null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return [...due, ...upcoming, ...completed];
}

export default function AllTasksScreen() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const { isDark, toggle } = useTheme();
  const [editingTask, setEditingTask] = useState<AccelTask | null>(null);
  const [judgeTarget, setJudgeTarget] = useState<AccelTask | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [howToVisible, setHowToVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('すべて');

  const today = todayString();

  const bg = isDark ? 'bg-zinc-950' : 'bg-white';
  const titleText = isDark ? 'text-white' : 'text-zinc-900';
  const subText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const mutedText = isDark ? 'text-zinc-600' : 'text-zinc-400';
  const rowBorder = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const tagBg = isDark ? 'bg-zinc-800' : 'bg-zinc-100';
  const iconColor = isDark ? '#a1a1aa' : '#71717a';

  const existingTags = [...new Set(tasks.map((t) => t.tag).filter((t): t is string => Boolean(t)))];
  const allTagFilters = ['すべて', ...existingTags];
  const filtered = selectedTag === 'すべて' ? tasks : tasks.filter((t) => t.tag === selectedTag);
  const sorted = sortTasks(filtered, today);
  const todayCount = tasks.filter((t) => t.nextReviewDate !== null && t.nextReviewDate <= today).length;

  function handleLongPress(task: AccelTask) {
    Alert.alert(task.title, 'このタスクを削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  }

  function handleDelete(task: AccelTask) {
    Alert.alert(task.title, 'このタスクを削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          setEditingTask(null);
        },
      },
    ]);
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
    setAddModalVisible(false);
  }

  function handleJudge(task: AccelTask, result: AttemptResult) {
    const changes = judgeTask(task, result);
    const entry: ReviewEntry = { stage: task.reviewStage, result, date: today };
    updateTask(task.id, {
      ...changes,
      reviewHistory: [...(task.reviewHistory ?? []), entry],
    });
    setJudgeTarget(null);
  }

  function handleResultCellTap(task: AccelTask, stageIndex: number) {
    const entry = (task.reviewHistory ?? []).find((e) => e.stage === stageIndex);
    if (!entry) return;
    Alert.alert(`${STAGE_LABELS[stageIndex]}の結果を変更`, undefined, [
      { text: '○ できた', onPress: () => changeResult(task, stageIndex, 'circle') },
      { text: '△ ほぼ', onPress: () => changeResult(task, stageIndex, 'triangle') },
      { text: '✗ NG', onPress: () => changeResult(task, stageIndex, 'cross') },
      { text: 'キャンセル', style: 'cancel' },
    ]);
  }

  function changeResult(task: AccelTask, stageIndex: number, newResult: AttemptResult) {
    const newHistory = (task.reviewHistory ?? []).map((e) =>
      e.stage === stageIndex ? { ...e, result: newResult } : e,
    );
    updateTask(task.id, { reviewHistory: newHistory });
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
      <View className="px-4 pt-6 pb-3 flex-row items-start justify-between">
        <View>
          <Text className={`${titleText} text-3xl font-extrabold tracking-tight`}>All Tasks</Text>
          <Text className={`${subText} mt-1`}>
            {tasks.length === 0
              ? 'タスクがありません'
              : todayCount > 0
              ? `${todayCount}件 今日の復習あり`
              : `${tasks.length}件登録中`}
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
                className={
                  selectedTag === t
                    ? 'bg-yellow-400 rounded-full px-4 py-1'
                    : `${tagBg} rounded-full px-4 py-1`
                }
              >
                <Text
                  className={
                    selectedTag === t
                      ? 'text-zinc-900 font-semibold text-sm'
                      : `${subText} text-sm`
                  }
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {tasks.length > 0 && (
        <View
          className={`flex-row items-center px-4 py-2 border-b ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}
        >
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
            const isToday = item.nextReviewDate !== null && item.nextReviewDate <= today;
            return (
              <View
                className={`flex-row items-center py-3 border-b ${rowBorder}`}
                style={{ paddingRight: 16 }}
              >
                {isToday && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      backgroundColor: '#facc15',
                    }}
                  />
                )}

                <TouchableOpacity
                  onPress={() => (isToday ? setJudgeTarget(item) : setEditingTask(item))}
                  onLongPress={() => handleLongPress(item)}
                  activeOpacity={0.7}
                  className="flex-1 pr-2"
                  style={{ paddingLeft: isToday ? 14 : 16 }}
                >
                  {isToday ? (
                    <View className="flex-row items-center gap-1.5 flex-wrap">
                      <View
                        className="bg-yellow-400 px-1.5 rounded"
                        style={{ paddingVertical: 1 }}
                      >
                        <Text className="text-zinc-900 text-xs font-bold">今日</Text>
                      </View>
                      <Text
                        className={`${titleText} text-sm font-semibold flex-shrink`}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      className={`${titleText} text-sm font-semibold`}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  )}
                  {item.tag ? (
                    <Text className={`${mutedText} text-xs mt-0.5`}>{item.tag}</Text>
                  ) : null}
                </TouchableOpacity>

                {STAGE_OFFSETS.map((offset, stageIndex) => {
                  const dateStr = addDays(item.createdAt, offset);
                  const entry = history.find((e) => e.stage === stageIndex);
                  return (
                    <TouchableOpacity
                      key={stageIndex}
                      style={{ width: COL_WIDTH, alignItems: 'center' }}
                      onPress={() => handleResultCellTap(item, stageIndex)}
                      activeOpacity={entry ? 0.5 : 1}
                      disabled={!entry}
                    >
                      <View style={{ height: 44, width: 44, alignItems: 'center', justifyContent: 'center' }}>
                        {entry ? (
                          <>
                            <Text
                              className={`absolute ${RESULT_COLORS[entry.result]}`}
                              style={{ fontSize: 36, opacity: 0.5 }}
                            >
                              {RESULT_SYMBOLS[entry.result]}
                            </Text>
                            <Text className="text-white text-sm font-semibold">
                              {toMD(dateStr)}
                            </Text>
                          </>
                        ) : (
                          <Text className="text-white text-xs font-medium">
                            {toMD(dateStr)}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => setAddModalVisible(true)}
        className="absolute bottom-8 right-6 bg-yellow-400 w-14 h-14 rounded-full items-center justify-center"
        style={{ elevation: 6 }}
      >
        <Text className="text-zinc-900 text-3xl font-light" style={{ lineHeight: 36 }}>+</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddTask}
        existingTags={existingTags}
        initialTag={selectedTag !== 'すべて' ? selectedTag : undefined}
      />

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        existingTags={existingTags}
      />

      <JudgeModal
        task={judgeTarget}
        onClose={() => setJudgeTarget(null)}
        onJudge={handleJudge}
      />

      <HowToModal visible={howToVisible} onClose={() => setHowToVisible(false)} />
    </SafeAreaView>
  );
}
