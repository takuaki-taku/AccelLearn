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
import { AccelTask } from '../types/task';

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
  existingTags?: string[];
}

export function EditTaskModal({ task, onClose, onSave, existingTags = [] }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [creatingNewTag, setCreatingNewTag] = useState(false);
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setTag(task.tag ?? '');
      setCreatingNewTag(task.tag ? !existingTags.includes(task.tag) : false);
      setUrl(task.referenceUrl ?? '');
      setMemo(task.memo ?? '');
    }
  }, [task]);

  function handleClose() {
    onClose();
  }

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
    <Modal
      visible={task !== null}
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
            <Text className="text-white text-xl font-bold">タスクを編集</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-zinc-400 text-base">キャンセル</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-zinc-400 text-sm mb-1">タイトル（必須）</Text>
          <TextInput
            className="bg-zinc-800 text-white rounded-lg px-3 mb-4"
            style={{ paddingVertical: 12 }}
            placeholder="タイトル"
            placeholderTextColor="#52525b"
            value={title}
            onChangeText={setTitle}
          />

          <Text className="text-zinc-400 text-sm mb-2">カテゴリー（任意）</Text>
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
                  className={tag === t && !creatingNewTag ? 'bg-yellow-400 rounded-full px-3 py-1' : 'bg-zinc-800 rounded-full px-3 py-1 border border-zinc-700'}
                >
                  <Text className={tag === t && !creatingNewTag ? 'text-zinc-900 text-sm font-semibold' : 'text-zinc-400 text-sm'}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => { setCreatingNewTag(true); setTag(''); }}
                style={{ marginRight: 4 }}
                className={creatingNewTag ? 'bg-yellow-400 rounded-full px-3 py-1' : 'bg-zinc-800 rounded-full px-3 py-1 border border-zinc-700'}
              >
                <Text className={creatingNewTag ? 'text-zinc-900 text-sm font-semibold' : 'text-zinc-400 text-sm'}>
                  ＋ 新規
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {(creatingNewTag || existingTags.length === 0) ? (
            <TextInput
              className="bg-zinc-800 text-white rounded-lg px-3 mb-4"
              style={{ paddingVertical: 12 }}
              placeholder="カテゴリー名を入力"
              placeholderTextColor="#52525b"
              value={tag}
              onChangeText={setTag}
            />
          ) : (
            <View className="mb-2" />
          )}

          <Text className="text-zinc-400 text-sm mb-1">URL（任意）</Text>
          <TextInput
            className="bg-zinc-800 text-white rounded-lg px-3 mb-4"
            style={{ paddingVertical: 12 }}
            placeholder="https://..."
            placeholderTextColor="#52525b"
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text className="text-zinc-400 text-sm mb-1">メモ（任意）</Text>
          <TextInput
            className="bg-zinc-800 text-white rounded-lg px-3 mb-6"
            style={{ paddingVertical: 12, height: 80, textAlignVertical: 'top' }}
            placeholder="解法のヒント、気づきなど..."
            placeholderTextColor="#52525b"
            value={memo}
            onChangeText={setMemo}
            multiline
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            className={canSave ? 'bg-yellow-400 rounded-xl py-4 items-center' : 'bg-zinc-700 rounded-xl py-4 items-center'}
          >
            <Text className={canSave ? 'text-zinc-900 font-bold text-base' : 'text-zinc-500 font-bold text-base'}>
              保存する
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
