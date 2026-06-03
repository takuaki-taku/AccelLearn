import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllTasksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <View className="py-6">
        <Text className="text-white text-3xl font-extrabold tracking-tight">All Tasks</Text>
        <Text className="text-zinc-400 mt-2">登録済みのタスク一覧</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-zinc-600">Phase 5 で実装予定</Text>
      </View>
    </SafeAreaView>
  );
}
