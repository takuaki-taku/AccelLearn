import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { AttemptResult } from '../types/task';
import { useTheme } from '../hooks/useTheme';

interface AddTaskInput {
  title: string;
  tag?: string;
  referenceUrl?: string;
  memo?: string;
  firstAttemptResult: AttemptResult;
}

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (input: AddTaskInput) => void;
  existingTags?: string[];
  initialTag?: string;
}

export function AddTaskModal({
  visible,
  onClose,
  onSave,
  existingTags = [],
  initialTag,
}: AddTaskModalProps) {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [creatingNewTag, setCreatingNewTag] = useState(false);
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [result, setResult] = useState<AttemptResult | null>(null);

  const sheetBg = isDark ? 'bg-zinc-900' : 'bg-white';
  const sheetBorder = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const inputBg = isDark ? 'bg-zinc-800' : 'bg-zinc-100';
  const inputBorder = isDark ? 'border-zinc-700' : 'border-zinc-200';
  const titleText = isDark ? 'text-white' : 'text-zinc-900';
  const labelText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const pillBg = isDark ? 'bg-zinc-800' : 'bg-zinc-100';
  const pillBorder = isDark ? 'border-zinc-700' : 'border-zinc-300';
  const pillText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const btnInactive = isDark ? 'bg-zinc-800' : 'bg-zinc-100';
  const btnInactiveBorder = isDark ? 'border-zinc-700' : 'border-zinc-200';
  const btnInactiveText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const disabledBg = isDark ? 'bg-zinc-700' : 'bg-zinc-200';
  const disabledText = isDark ? 'text-zinc-500' : 'text-zinc-400';

  useEffect(() => {
    if (visible && initialTag) {
      setTag(initialTag);
      setCreatingNewTag(false);
    }
  }, [visible, initialTag]);

  function reset() {
    setTitle('');
    setTag('');
    setCreatingNewTag(false);
    setUrl('');
    setMemo('');
    setResult(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!title.trim() || !result) return;
    onSave({
      title: title.trim(),
      tag: tag.trim() || undefined,
      referenceUrl: url.trim() || undefined,
      memo: memo.trim() || undefined,
      firstAttemptResult: result,
    });
    reset();
  }

  const canSave = title.trim().length > 0 && result !== null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <Pressable className="flex-1" onPress={handleClose} />

        <View className={`${sheetBg} rounded-t-2xl px-4 pt-5 pb-10 border-t ${sheetBorder}`}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`${titleText} text-xl font-bold`}>タスクを追加</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className={`${labelText} text-base`}>キャンセル</Text>
            </TouchableOpacity>
          </View>

          <Text className={`${labelText} text-sm mb-1`}>タイトル（必須）</Text>
          <TextInput
            className={`${inputBg} ${titleText} rounded-lg px-3 mb-4 border ${inputBorder}`}
            style={{ paddingVertical: 12 }}
            placeholder="例: Two Sum"
            placeholderTextColor="#71717a"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Text className={`${labelText} text-sm mb-2`}>カテゴリー（任意）</Text>
          {existingTags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
              contentContainerStyle={{ alignItems: 'center', paddingRight: 4 }}
            >
              {existingTags.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => { setTag(t); setCreatingNewTag(false); }}
                  style={{ marginRight: 8 }}
                  className={tag === t && !creatingNewTag ? 'bg-yellow-400 rounded-full px-3 py-1' : `${pillBg} rounded-full px-3 py-1 border ${pillBorder}`}
                >
                  <Text className={tag === t && !creatingNewTag ? 'text-zinc-900 text-sm font-semibold' : `${pillText} text-sm`}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => { setCreatingNewTag(true); setTag(''); }}
                style={{ marginRight: 4 }}
                className={creatingNewTag ? 'bg-yellow-400 rounded-full px-3 py-1' : `${pillBg} rounded-full px-3 py-1 border ${pillBorder}`}
              >
                <Text className={creatingNewTag ? 'text-zinc-900 text-sm font-semibold' : `${pillText} text-sm`}>
                  ＋ 新規
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {(creatingNewTag || existingTags.length === 0) ? (
            <TextInput
              className={`${inputBg} ${titleText} rounded-lg px-3 mb-4 border ${inputBorder}`}
              style={{ paddingVertical: 12 }}
              placeholder="カテゴリー名を入力"
              placeholderTextColor="#71717a"
              value={tag}
              onChangeText={setTag}
            />
          ) : (
            <View className="mb-2" />
          )}

          <Text className={`${labelText} text-sm mb-1`}>URL（任意）</Text>
          <TextInput
            className={`${inputBg} ${titleText} rounded-lg px-3 mb-4 border ${inputBorder}`}
            style={{ paddingVertical: 12 }}
            placeholder="https://leetcode.com/problems/..."
            placeholderTextColor="#71717a"
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text className={`${labelText} text-sm mb-1`}>メモ（任意）</Text>
          <TextInput
            className={`${inputBg} ${titleText} rounded-lg px-3 mb-5 border ${inputBorder}`}
            style={{ paddingVertical: 12, height: 72, textAlignVertical: 'top' }}
            placeholder="解法のヒント、気づきなど..."
            placeholderTextColor="#71717a"
            value={memo}
            onChangeText={setMemo}
            multiline
          />

          <Text className={`${labelText} text-sm mb-2`}>今日の結果（必須）</Text>
          <View className="flex-row gap-2 mb-6">
            <TouchableOpacity
              onPress={() => setResult('cross')}
              className={result === 'cross' ? 'flex-1 bg-red-500 rounded-lg py-3 items-center' : `flex-1 ${btnInactive} rounded-lg py-3 items-center border ${btnInactiveBorder}`}
            >
              <Text className={result === 'cross' ? 'text-white font-bold text-sm' : `${btnInactiveText} font-bold text-sm`}>✗ NG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setResult('triangle')}
              className={result === 'triangle' ? 'flex-1 bg-amber-400 rounded-lg py-3 items-center' : `flex-1 ${btnInactive} rounded-lg py-3 items-center border ${btnInactiveBorder}`}
            >
              <Text className={result === 'triangle' ? 'text-zinc-900 font-bold text-sm' : `${btnInactiveText} font-bold text-sm`}>△ ほぼ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setResult('circle')}
              className={result === 'circle' ? 'flex-1 bg-emerald-500 rounded-lg py-3 items-center' : `flex-1 ${btnInactive} rounded-lg py-3 items-center border ${btnInactiveBorder}`}
            >
              <Text className={result === 'circle' ? 'text-white font-bold text-sm' : `${btnInactiveText} font-bold text-sm`}>⭕ できた</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            className={canSave ? 'bg-yellow-400 rounded-xl py-4 items-center' : `${disabledBg} rounded-xl py-4 items-center`}
          >
            <Text className={canSave ? 'text-zinc-900 font-bold text-base' : `${disabledText} font-bold text-base`}>
              追加する
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
