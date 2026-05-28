import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

// Dummy data structure as per PRD
const MOCK_TASKS = [
  { id: '1', title: 'LeetCode 1. Two Sum', nextReviewDate: '2026-05-25' },
  { id: '2', title: '青チャ数ⅠA P.45 例題2', nextReviewDate: '2026-05-25' },
];

export default function Index() {
  const router = useRouter();

  const renderTask = ({ item }: { item: typeof MOCK_TASKS[0] }) => (
    <TouchableOpacity 
      className="bg-zinc-900 p-6 rounded-2xl mb-4 border border-zinc-800"
      onPress={() => console.log('Open URL for:', item.id)}
    >
      <Text className="text-white text-lg font-bold">{item.title}</Text>
      <Text className="text-zinc-500 mt-2">タップして詳細/URLへ</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <View className="py-6">
        <Text className="text-white text-3xl font-extrabold tracking-tight">Today's Queue</Text>
        <Text className="text-zinc-400 mt-2">記憶を加速させよう⚡</Text>
      </View>
      
      <FlatList
        data={MOCK_TASKS}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
