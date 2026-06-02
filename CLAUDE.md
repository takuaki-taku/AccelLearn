@AGENTS.md

# AccelLearn — Claude Code ガイド

## プロダクト概要

**AccelLearn** は忘却曲線型タスク管理アプリ。問題データそのものは保持せず、外部リソース（LeetCode URL、参考書ページ番号）への「参照（リンクとメモ）」だけを管理し、間隔反復（スペーシング）で記憶を最速化する。

ユースケース例: LeetCode の URL を登録 → Today's Queue で解く → DOWN / KEEP / BOOST の3ボタンでジャッジ → interval が自動計算されて次回日程が決まる。

---

## Tech Stack（バージョン固定）

| 項目 | バージョン |
|------|-----------|
| Expo | ~56.0.5 |
| React Native | 0.85.3 |
| React | 19.2.3 |
| TypeScript | ~6.0.3 |
| Expo Router | ^56.2.6 |
| NativeWind | ^4.2.4 |
| TailwindCSS | ^3.4.15 |
| react-native-reanimated | ^4.3.1 |
| @react-native-async-storage/async-storage | ^3.1.0 |
| @expo/vector-icons | ^15.1.1 |

**重要:** Expo 56 はメジャーな変更が入っている。コードを書く前に必ず `https://docs.expo.dev/versions/v56.0.0/` を確認すること。

---

## ファイル構成

```
app/
├── _layout.tsx              # ルートレイアウト（Stack、global.css import）
├── index.tsx                # /(tabs)/queue へリダイレクト
└── (tabs)/
    ├── _layout.tsx          # タブナビゲーション（zinc-950 / yellow-400 テーマ）
    ├── queue.tsx            # Today's Queue 画面（Phase 3 実装予定）
    └── all.tsx              # 全タスク一覧画面（Phase 5 実装予定）

components/                  # 再利用可能な UI コンポーネント（Phase 3 で作成開始）
├── TaskCard.tsx             # Phase 3 で作成
└── AddTaskModal.tsx         # Phase 4 で作成

hooks/
└── useTasks.ts              # AsyncStorage 永続化 + CRUD フック

utils/
└── scheduler.ts             # judgeDown / judgeKeep / judgeBoost / getTodaysTasks

types/
└── task.ts                  # AccelTask インターフェース定義

global.css                   # @tailwind base/components/utilities（NativeWind エントリ）
tailwind.config.js           # nativewind/preset + content paths
metro.config.js              # withNativeWind(config, { input: './global.css' })
babel.config.js              # babel-preset-expo + nativewind/babel
```

---

## カラーパレット（ダークテーマ）

| 役割 | クラス | HEX |
|------|--------|-----|
| 背景（最深） | `bg-zinc-950` | `#09090b` |
| 背景（カード） | `bg-zinc-900` | `#18181b` |
| ボーダー | `border-zinc-800` | `#27272a` |
| テキスト（メイン） | `text-white` | `#ffffff` |
| テキスト（サブ） | `text-zinc-400` | `#a1a1aa` |
| テキスト（無効） | `text-zinc-600` | `#52525b` |
| アクセント（BOOST） | `text-yellow-400` | `#facc15` |
| ジャッジ DOWN | `bg-red-500` | `#ef4444` |
| ジャッジ KEEP | `bg-blue-500` | `#3b82f6` |
| ジャッジ BOOST | `bg-yellow-400` | `#facc15` |
| タブバー背景 | インライン指定 | `#09090b` |
| タブアクティブ | インライン指定 | `#facc15` |

---

## コーディング規約

### NativeWind
- スタイルは `className` プロパティのみ使用する（`StyleSheet.create` と混在させない）
- 動的クラス名は**完全なクラス名**を条件分岐で切り替える。部分文字列の結合（テンプレートリテラル）は TailwindCSS のパージで消えるため禁止
  ```tsx
  // NG: `bg-${color}-500`
  // OK: isBoost ? 'bg-yellow-400' : 'bg-blue-500'
  ```
- `components/` を追加したら `tailwind.config.js` の `content` 配列に `"./components/**/*.{js,jsx,ts,tsx}"` を追加すること

### コンポーネント
- ファイル名・コンポーネント名: PascalCase
- Props 型: `{ComponentName}Props`
- `SafeAreaView` を画面コンポーネントの最外殻に使う（`react-native-safe-area-context` から import）

### AsyncStorage / データ層
- ストレージへの読み書きは必ず `useTasks()` フック（`hooks/useTasks.ts`）経由
- 画面・コンポーネント内で直接 `AsyncStorage` を呼び出さない
- `STORAGE_KEY` は `'accellearn_tasks'` で固定

### スペーシングアルゴリズム（`utils/scheduler.ts`）
- `judgeDown`: interval を `1` にリセット
- `judgeKeep`: `Math.floor(interval × 1.5)`（最小 1）
- `judgeBoost`: `Math.floor(interval × 3.0)`（最小 1）
- `nextReviewDate` は `今日 + interval 日` で再計算

### Expo Router
- `app/` ディレクトリ以外にルートファイルを置かない
- タブ追加時は `app/(tabs)/` に `.tsx` ファイルを追加し `_layout.tsx` に `<Tabs.Screen>` を追記
- `Linking.openURL(url)` は `referenceUrl` が存在する場合のみ呼び出す（guard 必須）

### Reanimated 4.x
- v4 API: `useSharedValue`, `useAnimatedStyle`, `withTiming`, `runOnJS`
- `useAnimatedGestureHandler` は v3 で廃止済み — 使用禁止
- Reanimated 4 は Worklets v2 ベース

### TypeScript
- strict モード有効（`tsconfig.json` 設定済み）
- `any` は使用しない。型不明の場合は `unknown` + 型ガード
- 型チェック: `npx tsc --noEmit`

---

## 開発コマンド

```bash
# 開発サーバー起動（Expo Go）
npm start

# iOS シミュレーター（dev client、ネイティブモジュール対応）
npm run ios
# または
npx expo run:ios

# 型チェック
npx tsc --noEmit

# パッケージ追加（Expo 互換バージョンを自動解決）
npx expo install <package-name>
```

> `expo start` は Expo Go で動作、`expo run:ios` はネイティブビルド（dev client）。  
> このプロジェクトは `expo-dev-client` が入っているため `expo run:ios` 推奨。

---

## 既知の罠

1. **NativeWind パッチ:** `patches/react-native-css-interop+0.2.4.patch` が Metro HMR イベントフォーマットの差異を修正している。`npm install` 時に `patch-package` が自動適用する。

2. **tailwind.config.js の content:** `components/` ディレクトリ作成時は必ず `content` 配列に追加すること。現在は `app/` のみ。

3. **userInterfaceStyle:** `app.json` は `"light"` のままだが、アプリ内は常にダークテーマで実装する（システム設定に依存しない）。

4. **Ionicons:** `@expo/vector-icons ^15.1.1` の `Ionicons` を使用。`tabBarIcon` の `size` prop はそのまま渡す。

---

## 実装フェーズ状況

| フェーズ | 内容 | 状態 |
|----------|------|------|
| Phase 1 | データ層（型定義・AsyncStorage・忘却曲線ロジック） | ✅ 完了 |
| Phase 2 | タブナビゲーション（Expo Router） | ✅ 完了 |
| Phase 3 | Today's Queue 画面・TaskCard・ジャッジボタン・退場アニメーション | ⏳ 次 |
| Phase 4 | クイック追加モーダル（FAB + AddTaskModal） | ⏳ 未着手 |
| Phase 5 | 全タスク一覧画面・削除・編集 | ⏳ 未着手 |
| Phase 6 | UI/スタイル仕上げ | ⏳ 未着手 |
| Phase 7 | QA・実機動作確認 | ⏳ 未着手 |

詳細タスクリストは `TASKS.md` を参照。
