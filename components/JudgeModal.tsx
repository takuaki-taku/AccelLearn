import { Modal, View, Text, TouchableOpacity, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccelTask, AttemptResult } from '../types/task';
import { useTheme } from '../hooks/useTheme';

interface JudgeModalProps {
  task: AccelTask | null;
  onClose: () => void;
  onJudge: (task: AccelTask, result: AttemptResult) => void;
}

const STAGE_LABELS = ['1日後の復習', '1週間後の復習', '3週間後の復習'];

export function JudgeModal({ task, onClose, onJudge }: JudgeModalProps) {
  const { isDark } = useTheme();

  const sheetBg = isDark ? 'bg-zinc-900' : 'bg-white';
  const sheetBorder = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const titleText = isDark ? 'text-white' : 'text-zinc-900';
  const subText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const mutedText = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const iconColor = isDark ? '#a1a1aa' : '#71717a';

  if (!task) return null;

  const stageLabel = STAGE_LABELS[task.reviewStage] ?? '最終ステージの復習';

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose} />

      <View className={`${sheetBg} rounded-t-2xl px-4 pt-5 pb-10 border-t ${sheetBorder}`}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="bg-yellow-400 px-2 rounded" style={{ paddingVertical: 2 }}>
              <Text className="text-zinc-900 text-xs font-bold">今日</Text>
            </View>
            <Text className={`${mutedText} text-xs`}>{stageLabel}</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color={iconColor} />
          </TouchableOpacity>
        </View>

        <Text className={`${titleText} text-xl font-bold mb-1`} numberOfLines={2}>
          {task.title}
        </Text>

        {task.tag ? (
          <Text className={`${mutedText} text-xs mb-3`}>{task.tag}</Text>
        ) : (
          <View className="mb-3" />
        )}

        {task.memo ? (
          <Text className={`${subText} text-sm mb-3 leading-relaxed`}>{task.memo}</Text>
        ) : null}

        {task.referenceUrl ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(task.referenceUrl!)}
            className="flex-row items-center gap-1 mb-4"
          >
            <Ionicons name="link-outline" size={16} color="#facc15" />
            <Text className="text-yellow-400 text-sm flex-1" numberOfLines={1}>
              {task.referenceUrl}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View className={`border-t ${sheetBorder} pt-4`}>
          <Text className={`${mutedText} text-xs text-center mb-3`}>今日の結果は？</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => onJudge(task, 'cross')}
              className="flex-1 bg-red-500 rounded-xl py-4 items-center"
            >
              <Ionicons name="close-circle-outline" size={22} color="white" />
              <Text className="text-white font-bold text-sm mt-1">DOWN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onJudge(task, 'triangle')}
              className="flex-1 bg-blue-500 rounded-xl py-4 items-center"
            >
              <Ionicons name="remove-circle-outline" size={22} color="white" />
              <Text className="text-white font-bold text-sm mt-1">KEEP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onJudge(task, 'circle')}
              className="flex-1 bg-yellow-400 rounded-xl py-4 items-center"
            >
              <Ionicons name="checkmark-circle-outline" size={22} color="#18181b" />
              <Text className="text-zinc-900 font-bold text-sm mt-1">BOOST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
