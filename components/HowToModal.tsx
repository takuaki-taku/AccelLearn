import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface HowToModalProps {
  visible: boolean;
  onClose: () => void;
}

const CURVE_DATA = [
  { label: '学習直後', pct: 100 },
  { label: '1時間後',  pct: 58 },
  { label: '1日後',    pct: 26 },
  { label: '1週間後',  pct: 23 },
  { label: '1ヶ月後',  pct: 21 },
];

export function HowToModal({ visible, onClose }: HowToModalProps) {
  const { isDark } = useTheme();

  const bg = isDark ? 'bg-zinc-950' : 'bg-white';
  const cardBg = isDark ? 'bg-zinc-900' : 'bg-zinc-100';
  const border = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const titleText = isDark ? 'text-white' : 'text-zinc-900';
  const bodyText = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const mutedText = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const iconColor = isDark ? '#a1a1aa' : '#71717a';
  const barBg = isDark ? 'bg-zinc-800' : 'bg-zinc-200';
  const dividerBg = isDark ? 'border-zinc-700' : 'border-zinc-200';
  const dotBg = isDark ? 'bg-zinc-700' : 'bg-zinc-300';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className={`flex-1 ${bg}`}>
        <View className={`flex-row items-center justify-between px-4 py-4 border-b ${border}`}>
          <Text className={`${titleText} text-xl font-bold`}>使い方</Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>

          {/* 忘却曲線カード */}
          <View className={`${cardBg} rounded-2xl p-4 border ${border}`}>
            <Text className={`${titleText} text-base font-bold mb-2`}>
              エビングハウスの忘却曲線
            </Text>
            <Text className={`${bodyText} text-sm leading-relaxed`}>
              1885年にドイツの心理学者エビングハウスが発見した理論。人間は学習した内容を時間とともに急速に忘れていきます。
            </Text>

            {/* バーチャート */}
            <View className="mt-3">
              <Text className={`${mutedText} text-xs mb-2`}>記憶の定着率（復習なしの場合）</Text>
              {CURVE_DATA.map(({ label, pct }) => (
                <View key={label} className="flex-row items-center mb-2">
                  <Text className={`${mutedText} text-xs`} style={{ width: 52 }}>{label}</Text>
                  <View className={`flex-1 ${barBg} rounded-full overflow-hidden`} style={{ height: 8 }}>
                    <View
                      className="bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%`, height: 8 }}
                    />
                  </View>
                  <Text className={`${mutedText} text-xs text-right`} style={{ width: 34 }}>{pct}%</Text>
                </View>
              ))}
            </View>

            <View className={`mt-3 pt-3 border-t ${dividerBg}`}>
              <Text className={`${bodyText} text-sm leading-relaxed`}>
                でも「間隔を開けて繰り返す」と記憶は定着します。このアプリはその復習タイミングを自動で管理します。
              </Text>
            </View>
          </View>

          {/* 復習スケジュール */}
          <Text className={`${titleText} text-lg font-bold mt-6 mb-3`}>復習スケジュール</Text>
          <View className={`${cardBg} rounded-2xl p-4 border ${border}`}>
            <View className="flex-row items-center justify-between">
              {['登録日', '1日後', '1週間後', '3週間後'].map((label, i, arr) => (
                <View key={label} className="flex-row items-center">
                  <View className="items-center">
                    <View className="bg-yellow-400 rounded-full w-3 h-3" />
                    <Text className={`${mutedText} text-xs mt-1`}>{label}</Text>
                  </View>
                  {i < arr.length - 1 && (
                    <View className={`${dotBg} h-0.5 mb-4 mx-1`} style={{ width: 20 }} />
                  )}
                </View>
              ))}
            </View>
            <Text className={`${mutedText} text-xs mt-3`}>
              ○ が出た時点でそのタスクの復習は終了します
            </Text>
          </View>

          {/* 使い方 */}
          <Text className={`${titleText} text-lg font-bold mt-6 mb-3`}>使い方</Text>
          {[
            { step: '1', title: 'タスクを登録する', desc: '＋ボタンからタスクを追加。タイトルと、その日解いた結果（○ / △ / ✗）を入力します。' },
            { step: '2', title: '復習日に一覧を確認する', desc: '復習日になったタスクには「今日」バッジが表示されます。タップするとジャッジ画面が開きます。' },
            { step: '3', title: '結果を入力する', desc: '結果に応じて次の復習日が自動でセットされます。' },
          ].map(({ step, title, desc }) => (
            <View key={step} className="flex-row items-start mb-4">
              <View className="bg-yellow-400 rounded-full w-7 h-7 items-center justify-center mr-3 mt-0.5">
                <Text className="text-zinc-900 font-bold text-xs">{step}</Text>
              </View>
              <View className="flex-1">
                <Text className={`${titleText} text-sm font-semibold`}>{title}</Text>
                <Text className={`${mutedText} text-xs mt-0.5`}>{desc}</Text>
              </View>
            </View>
          ))}

          {/* 結果の意味 */}
          <Text className={`${titleText} text-lg font-bold mt-2 mb-3`}>結果の意味</Text>
          {[
            { symbol: '○', color: 'text-emerald-500', label: 'できた', desc: 'その時点で復習終了。マスター済みとして記録されます。' },
            { symbol: '△', color: 'text-amber-400',   label: 'ほぼできた', desc: '記録として残しますが、✗ と同じ復習スケジュールで次のステージへ進みます。' },
            { symbol: '✗', color: 'text-red-500',     label: 'NG', desc: '次の復習日（1日後 → 1週間後 → 3週間後）がセットされます。' },
          ].map(({ symbol, color, label, desc }) => (
            <View key={label} className="flex-row items-start mb-3">
              <Text className={`text-2xl w-10 ${color}`}>{symbol}</Text>
              <View className="flex-1">
                <Text className={`${titleText} text-sm font-semibold`}>{label}</Text>
                <Text className={`${mutedText} text-xs mt-0.5`}>{desc}</Text>
              </View>
            </View>
          ))}

          {/* 画面説明 */}
          <Text className={`${titleText} text-lg font-bold mt-2 mb-3`}>画面の説明</Text>
          <View className={`${cardBg} rounded-2xl border ${border} overflow-hidden`}>
            <View className="px-4 py-3 flex-row items-center gap-2">
              <Ionicons name="list" size={16} color={iconColor} />
              <View className="flex-1">
                <Text className={`${titleText} text-sm font-semibold`}>All Tasks</Text>
                <Text className={`${mutedText} text-xs`}>全タスクを一覧表示。今日の復習タスクは「今日」バッジ付きで強調表示されます</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={onClose} className="bg-yellow-400 rounded-xl py-4 items-center mt-8">
            <Text className="text-zinc-900 font-bold text-base">はじめる</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
