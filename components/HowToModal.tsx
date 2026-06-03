import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

interface HowToModalProps {
  visible: boolean;
  onClose: () => void;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="text-zinc-900 dark:text-white text-lg font-bold mt-6 mb-3">
      {children}
    </Text>
  );
}

function BodyText({ children }: { children: string }) {
  return (
    <Text className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
      {children}
    </Text>
  );
}

const CURVE_DATA = [
  { label: '学習直後', pct: 100 },
  { label: '1時間後',  pct: 58 },
  { label: '1日後',    pct: 26 },
  { label: '1週間後',  pct: 23 },
  { label: '1ヶ月後',  pct: 21 },
];

function ForgettingCurveChart() {
  return (
    <View className="mt-3">
      <Text className="text-zinc-400 dark:text-zinc-500 text-xs mb-2">記憶の定着率（復習なしの場合）</Text>
      {CURVE_DATA.map(({ label, pct }) => (
        <View key={label} className="flex-row items-center mb-2">
          <Text className="text-zinc-500 dark:text-zinc-400 text-xs" style={{ width: 52 }}>
            {label}
          </Text>
          <View
            className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden"
            style={{ height: 8 }}
          >
            <View
              className="bg-emerald-500 rounded-full"
              style={{ width: `${pct}%`, height: 8 }}
            />
          </View>
          <Text className="text-zinc-500 dark:text-zinc-400 text-xs text-right" style={{ width: 34 }}>
            {pct}%
          </Text>
        </View>
      ))}
    </View>
  );
}

function ResultRow({ symbol, label, description }: { symbol: string; label: string; description: string }) {
  return (
    <View className="flex-row items-start mb-3">
      <Text className="text-2xl w-10">{symbol}</Text>
      <View className="flex-1">
        <Text className="text-zinc-900 dark:text-white text-sm font-semibold">{label}</Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{description}</Text>
      </View>
    </View>
  );
}

function StepRow({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <View className="flex-row items-start mb-4">
      <View className="bg-yellow-400 rounded-full w-7 h-7 items-center justify-center mr-3 mt-0.5">
        <Text className="text-zinc-900 font-bold text-xs">{step}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-zinc-900 dark:text-white text-sm font-semibold">{title}</Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{description}</Text>
      </View>
    </View>
  );
}

export function HowToModal({ visible, onClose }: HowToModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <Text className="text-zinc-900 dark:text-white text-xl font-bold">使い方</Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={24} color={isDark ? '#a1a1aa' : '#71717a'} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>

          {/* エビングハウス */}
          <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
            <Text className="text-zinc-900 dark:text-white text-base font-bold mb-2">
              エビングハウスの忘却曲線
            </Text>
            <BodyText>
              1885年にドイツの心理学者エビングハウスが発見した理論。人間は学習した内容を時間とともに急速に忘れていきます。
            </BodyText>
            <ForgettingCurveChart />
            <View className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
              <BodyText>
                でも「間隔を開けて繰り返す」と記憶は定着します。AccelLearnはその復習タイミングを自動で管理します。
              </BodyText>
            </View>
          </View>

          <SectionTitle>復習スケジュール</SectionTitle>
          <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
            <View className="flex-row items-center justify-between">
              {['登録日', '1日後', '1週間後', '3週間後'].map((label, i, arr) => (
                <View key={label} className="flex-row items-center">
                  <View className="items-center">
                    <View className="bg-yellow-400 rounded-full w-3 h-3" />
                    <Text className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">{label}</Text>
                  </View>
                  {i < arr.length - 1 && (
                    <View className="bg-zinc-300 dark:bg-zinc-700 h-0.5 w-6 mb-4 mx-1" />
                  )}
                </View>
              ))}
            </View>
            <Text className="text-zinc-500 dark:text-zinc-400 text-xs mt-3">
              ⭕ が出た時点でそのタスクの復習は終了します
            </Text>
          </View>

          <SectionTitle>使い方</SectionTitle>
          <StepRow
            step="1"
            title="タスクを登録する"
            description="＋ボタンからタスクを追加。タイトルと、その日解いた結果（⭕ / △ / ✗）を入力します。"
          />
          <StepRow
            step="2"
            title="Today's Queue で復習"
            description="復習日になったタスクが自動で画面に表示されます。問題を解いてから結果を入力してください。"
          />
          <StepRow
            step="3"
            title="結果を入力する"
            description="結果に応じて次の復習日が自動でセットされます。"
          />

          <SectionTitle>結果の意味</SectionTitle>
          <ResultRow
            symbol="⭕"
            label="できた"
            description="その時点で復習終了。マスター済みとして記録されます。"
          />
          <ResultRow
            symbol="△"
            label="ほぼできた"
            description="記録として残しますが、✗ と同じ復習スケジュールで次のステージへ進みます。"
          />
          <ResultRow
            symbol="✗"
            label="NG"
            description="次の復習日（1日後 → 1週間後 → 3週間後）がセットされます。"
          />

          <SectionTitle>画面の説明</SectionTitle>
          <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <View className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-row items-center gap-2">
              <Ionicons name="flash" size={16} color="#facc15" />
              <View className="flex-1">
                <Text className="text-zinc-900 dark:text-white text-sm font-semibold">Today's Queue</Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-xs">今日復習すべきタスクの一覧</Text>
              </View>
            </View>
            <View className="px-4 py-3 flex-row items-center gap-2">
              <Ionicons name="list" size={16} color={isDark ? '#a1a1aa' : '#71717a'} />
              <View className="flex-1">
                <Text className="text-zinc-900 dark:text-white text-sm font-semibold">All Tasks</Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-xs">全タスクと各ステージの結果を一覧で確認</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="bg-yellow-400 rounded-xl py-4 items-center mt-8"
          >
            <Text className="text-zinc-900 font-bold text-base">はじめる</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
