import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { AccelTask, AttemptResult } from '../types/task';
import { useTheme } from '../hooks/useTheme';

const REVIEW_LABELS = ['第1回レビュー', '第2回レビュー', '第3回レビュー'];

const RESULT_SYMBOLS: Record<AttemptResult, string> = {
  circle: '○',
  triangle: '△',
  cross: '✗',
};

interface TaskCardProps {
  task: AccelTask;
  onJudge: (result: AttemptResult) => void;
}

export function TaskCard({ task, onJudge }: TaskCardProps) {
  const { isDark } = useTheme();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  function handleJudge(result: AttemptResult) {
    const direction = result === 'cross' ? -500 : 500;
    translateX.value = withTiming(direction, { duration: 280 });
    opacity.value = withTiming(0, { duration: 280 }, () => {
      runOnJS(onJudge)(result);
    });
  }

  function openUrl() {
    if (task.referenceUrl) {
      Linking.openURL(task.referenceUrl);
    }
  }

  const reviewLabel = REVIEW_LABELS[task.reviewStage] ?? '最終レビュー';
  const firstResultSymbol = RESULT_SYMBOLS[task.firstAttemptResult];

  const cardBg = isDark ? 'bg-zinc-900' : 'bg-zinc-100';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const titleText = isDark ? 'text-white' : 'text-zinc-900';
  const urlText = isDark ? 'text-yellow-400' : 'text-yellow-600';
  const memoText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const metaText = isDark ? 'text-zinc-600' : 'text-zinc-400';

  return (
    <Animated.View style={animatedStyle}>
      <View className={`${cardBg} rounded-xl p-4 mb-3 border ${cardBorder}`}>
        <TouchableOpacity onPress={openUrl} activeOpacity={task.referenceUrl ? 0.7 : 1}>
          <Text className={`${titleText} text-base font-semibold`}>{task.title}</Text>
          {task.referenceUrl && (
            <Text className={`${urlText} text-xs mt-1`} numberOfLines={1}>
              {task.referenceUrl}
            </Text>
          )}
          {task.memo ? (
            <Text className={`${memoText} text-sm mt-2`}>{task.memo}</Text>
          ) : null}
          <Text className={`${metaText} text-xs mt-3`}>
            {reviewLabel}　初回: {firstResultSymbol}
          </Text>
        </TouchableOpacity>

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            onPress={() => handleJudge('cross')}
            className="flex-1 bg-red-500 rounded-lg py-3 items-center flex-row justify-center gap-1"
          >
            <Ionicons name="close-circle" size={18} color="white" />
            <Text className="text-white font-bold text-sm">NG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleJudge('triangle')}
            className="flex-1 bg-amber-400 rounded-lg py-3 items-center flex-row justify-center gap-1"
          >
            <Ionicons name="remove-circle" size={18} color="#18181b" />
            <Text className="text-zinc-900 font-bold text-sm">ほぼ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleJudge('circle')}
            className="flex-1 bg-emerald-500 rounded-lg py-3 items-center flex-row justify-center gap-1"
          >
            <Ionicons name="checkmark-circle" size={18} color="white" />
            <Text className="text-white font-bold text-sm">できた</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
