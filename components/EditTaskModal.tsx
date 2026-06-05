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
import { Ionicons } from '@expo/vector-icons';
import { AccelTask } from '../types/task';
import { useTheme } from '../hooks/useTheme';

interface EditTaskInput {
  title: string;
  tag?: string;
  referenceUrl?: string;
  memo?: string;
}

interface EditTaskModalProps {
  task: AccelTask | null;
  onClose: () => void;
  onSave: (taskId: string, input: EditTaskInput) => void;
  onDelete?: (task: AccelTask) => void;
  existingTags?: string[];
}

export function EditTaskModal({ task, onClose, onSave, onDelete, existingTags = [] }: EditTaskModalProps) {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [creatingNewTag, setCreatingNewTag] = useState(false);
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');

  const sheetBg = isDark ? 'bg-zinc-900' : 'bg-white';
  const sheetBorder = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const inputBg = isDark ? 'bg-zinc-800' : 'bg-zinc-100';
  const inputBorder = isDark ? 'border-zinc-700' : 'border-zinc-200';
  const titleText = isDark ? 'text-white' : 'text-zinc-900';
  const labelText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const pillBg = isDark ? 'bg-zinc-800' : 'bg-zinc-100';
  const pillBorder = isDark ? 'border-zinc-700' : 'border-zinc-300';
  const pillText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const disabledBg = isDark ? 'bg-zinc-700' : 'bg-zinc-200';
  const disabledText = isDark ? 'text-zinc-500' : 'text-zinc-400';

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setTag(task.tag ?? '');
      setCreatingNewTag(task.tag ? !existingTags.includes(task.tag) : false);
      setUrl(task.referenceUrl ?? '');
      setMemo(task.memo ?? '');
    }
  }, [task]);

  function handleSave() {
    if (!task || !title.trim()) return;
    onSave(task.id, {
      title: title.trim(),
      tag: tag.trim() || undefined,
      referenceUrl: url.trim() || undefined,
      memo: memo.trim() || undefined,
    });
  }

  const canSave = title.trim().length > 0;

  return (
    <Modal visible={task !== null} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <Pressable className="flex-1" onPress={onClose} />

        <View className={`${sheetBg} rounded-t-2xl px-4 pt-5 pb-10 border-t ${sheetBorder}`}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`${titleText} text-xl font-bold`}>タスクを編集</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className={`${labelText} text-base`}>キャンセル</Text>
            </TouchableOpacity>
          </View>

          <Text className={`${labelText} text-sm mb-1`}>タイトル（必須）</Text>
          <TextInput
            className={`${inputBg} ${titleText} rounded-lg px-3 mb-4 border ${inputBorder}`}
            style={{ paddingVertical: 12 }}
            placeholder="タイトル"
            placeholderTextColor="#71717a"
            value={title}
            onChangeText={setTitle}
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
            placeholder="https://..."
            placeholderTextColor="#71717a"
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text className={`${labelText} text-sm mb-1`}>メモ（任意）</Text>
          <TextInput
            className={`${inputBg} ${titleText} rounded-lg px-3 mb-6 border ${inputBorder}`}
            style={{ paddingVertical: 12, height: 80, textAlignVertical: 'top' }}
            placeholder="解法のヒント、気づきなど..."
            placeholderTextColor="#71717a"
            value={memo}
            onChangeText={setMemo}
            multiline
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            className={canSave ? 'bg-yellow-400 rounded-xl py-4 items-center' : `${disabledBg} rounded-xl py-4 items-center`}
          >
            <Text className={canSave ? 'text-zinc-900 font-bold text-base' : `${disabledText} font-bold text-base`}>
              保存する
            </Text>
          </TouchableOpacity>

          {onDelete && task && (
            <TouchableOpacity
              onPress={() => onDelete(task)}
              className="flex-row items-center justify-center gap-2 mt-3 py-3"
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text className="text-red-500 text-sm">このタスクを削除</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
