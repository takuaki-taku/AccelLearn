import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { AttemptResult } from '../types/task';

interface AddTaskInput {
  title: string;
  referenceUrl?: string;
  memo?: string;
  firstAttemptResult: AttemptResult;
}

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (input: AddTaskInput) => void;
}

export function AddTaskModal({ visible, onClose, onSave }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [result, setResult] = useState<AttemptResult | null>(null);

  function reset() {
    setTitle('');
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
      referenceUrl: url.trim() || undefined,
      memo: memo.trim() || undefined,
      firstAttemptResult: result,
    });
    reset();
  }

  const canSave = title.trim().length > 0 && result !== null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable className="flex-1" onPress={handleClose} />

        <View className="bg-zinc-900 rounded-t-2xl px-4 pt-5 pb-10 border-t border-zinc-800">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-xl font-bold">タスクを追加</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-zinc-400 text-base">キャンセル</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-zinc-400 text-sm mb-1">タイトル（必須）</Text>
          <TextInput
            className="bg-zinc-800 text-white rounded-lg px-3 mb-4"
            style={{ paddingVertical: 12 }}
            placeholder="例: Two Sum"
            placeholderTextColor="#52525b"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Text className="text-zinc-400 text-sm mb-1">URL（任意）</Text>
          <TextInput
            className="bg-zinc-800 text-white rounded-lg px-3 mb-4"
            style={{ paddingVertical: 12 }}
            placeholder="https://leetcode.com/problems/..."
            placeholderTextColor="#52525b"
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text className="text-zinc-400 text-sm mb-1">メモ（任意）</Text>
          <TextInput
            className="bg-zinc-800 text-white rounded-lg px-3 mb-5"
            style={{ paddingVertical: 12, height: 72, textAlignVertical: 'top' }}
            placeholder="解法のヒント、気づきなど..."
            placeholderTextColor="#52525b"
            value={memo}
            onChangeText={setMemo}
            multiline
          />

          <Text className="text-zinc-400 text-sm mb-2">今日の結果（必須）</Text>
          <View className="flex-row gap-2 mb-6">
            <TouchableOpacity
              onPress={() => setResult('cross')}
              className={result === 'cross' ? 'flex-1 bg-red-500 rounded-lg py-3 items-center' : 'flex-1 bg-zinc-800 rounded-lg py-3 items-center border border-zinc-700'}
            >
              <Text className={result === 'cross' ? 'text-white font-bold text-sm' : 'text-zinc-400 font-bold text-sm'}>✗ NG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setResult('triangle')}
              className={result === 'triangle' ? 'flex-1 bg-amber-400 rounded-lg py-3 items-center' : 'flex-1 bg-zinc-800 rounded-lg py-3 items-center border border-zinc-700'}
            >
              <Text className={result === 'triangle' ? 'text-zinc-900 font-bold text-sm' : 'text-zinc-400 font-bold text-sm'}>△ ほぼ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setResult('circle')}
              className={result === 'circle' ? 'flex-1 bg-emerald-500 rounded-lg py-3 items-center' : 'flex-1 bg-zinc-800 rounded-lg py-3 items-center border border-zinc-700'}
            >
              <Text className={result === 'circle' ? 'text-white font-bold text-sm' : 'text-zinc-400 font-bold text-sm'}>⭕ できた</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            className={canSave ? 'bg-yellow-400 rounded-xl py-4 items-center' : 'bg-zinc-700 rounded-xl py-4 items-center'}
          >
            <Text className={canSave ? 'text-zinc-900 font-bold text-base' : 'text-zinc-500 font-bold text-base'}>
              追加する
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
