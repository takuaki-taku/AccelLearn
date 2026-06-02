---
description: "AccelLearn 用の React Native コンポーネントを NativeWind / ダークテーマ規約に従って作成する"
argument-hint: "ComponentName [--screen]"
---

`$ARGUMENTS` で指定されたコンポーネントを作成する。

## 事前確認（必須）

1. `components/ComponentName.tsx` が既に存在しないか確認する
2. `tailwind.config.js` の `content` 配列に `"./components/**/*.{js,jsx,ts,tsx}"` が含まれているか確認し、なければ追加する
3. `--screen` フラグがある場合は `app/(tabs)/` に画面コンポーネントとして作成し、`app/(tabs)/_layout.tsx` に `<Tabs.Screen>` を追記する

## 命名規則

- ファイル名・エクスポート名: PascalCase（例: `TaskCard`, `AddTaskModal`）
- Props 型: `{ComponentName}Props`

## コンポーネントテンプレート

```tsx
import { View, Text } from 'react-native';

interface ComponentNameProps {
  // props here
}

export function ComponentName({}: ComponentNameProps) {
  return (
    <View className="bg-zinc-900 rounded-xl p-4">
      <Text className="text-white text-base font-semibold">
        {/* content */}
      </Text>
    </View>
  );
}
```

## ダークテーマ規約

- 背景: `bg-zinc-950`（最深） / `bg-zinc-900`（カード）
- テキスト: `text-white`（メイン） / `text-zinc-400`（サブ） / `text-zinc-600`（無効）
- アクセント: `text-yellow-400`（BOOST） / `bg-red-500`（DOWN） / `bg-blue-500`（KEEP）
- **動的 className は完全なクラス名を条件分岐で切り替える（部分文字列の結合は禁止）**

## アニメーションが必要な場合

react-native-reanimated 4.x の API を使用する:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
```

`useAnimatedGestureHandler` は廃止済み — 使用しないこと。
