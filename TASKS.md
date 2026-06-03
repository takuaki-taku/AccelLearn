# AccelLearn 実装タスクリスト

**プロダクト概要:** 忘却曲線型タスク管理アプリ。外部リソース（LeetCode URL・参考書ページ）への参照を管理し、スペーシング（間隔反復）で最速暗記を実現する。

---

## Phase 1: データ層 & 基盤

- [x] **1-1** `AccelTask` 型定義ファイルを作成 (`types/task.ts`)
  - `id`, `title`, `referenceUrl?`, `memo?`, `currentInterval`, `nextReviewDate`, `createdAt`
- [x] **1-2** AsyncStorage を使ったデータ永続化フック作成 (`hooks/useTasks.ts`)
  - `tasks` の読み込み・保存
  - `addTask(task)` / `updateTask(id, changes)` / `deleteTask(id)` の3関数
- [x] **1-3** 忘却曲線ロジック関数を作成 (`utils/scheduler.ts`)
  - `judgeDown(task)` → interval を 1 にリセット
  - `judgeKeep(task)` → interval を `Math.floor(interval × 1.5)` に更新
  - `judgeBoost(task)` → interval を `Math.floor(interval × 3.0)` に更新
  - `nextReviewDate` の再計算（今日 + interval 日）
- [x] **1-4** 「今日のキュー」フィルター関数を作成 (`utils/scheduler.ts`)
  - `getTodaysTasks(tasks)` → `nextReviewDate <= 今日` のタスクを返す

---

## Phase 2: 画面構成（タブナビゲーション）

- [x] **2-1** Expo Router のタブ構成を設定 (`app/(tabs)/_layout.tsx`)
  - Tab 1: `queue`（Today's Queue）
  - Tab 2: `all`（全タスク一覧）
- [x] **2-2** `app/_layout.tsx` を更新してタブルートに対応させる

---

## Phase 3: Today's Queue 画面

- [ ] **3-1** キュー画面の基本UI構築 (`app/(tabs)/queue.tsx`)
  - 今日のタスク一覧をFlatListで表示
  - タスクゼロ時に完了メッセージを表示（「今日のアクセル完了！⚡」）
- [ ] **3-2** タスクカードコンポーネント作成 (`components/TaskCard.tsx`)
  - タイトル・メモを表示
  - タップで `referenceUrl` を外部ブラウザで開く（`Linking.openURL`）
- [ ] **3-3** ジャッジボタン（3つ）をタスクカードに実装
  - ❌ DOWN / 🔄 KEEP / ⚡ BOOST
  - タップ後にタスクを更新し、横スライドアニメーションで消去
- [ ] **3-4** カード消去アニメーション（`react-native-reanimated` を使用）
  - `useAnimatedStyle` + `withTiming` で横スライド退場

---

## Phase 4: クイック追加モーダル

- [ ] **4-1** 追加ボタン（FAB）をキュー画面右下に配置
- [ ] **4-2** 追加モーダルコンポーネント作成 (`components/AddTaskModal.tsx`)
  - 入力項目: タイトル（必須）・URL（任意）・メモ（任意）
  - 保存時に `currentInterval=1`, `nextReviewDate=今日` を自動セット
  - キーボードが表示されても隠れない `KeyboardAvoidingView` 対応

---

## Phase 5: 全タスク一覧画面

- [ ] **5-1** 全タスク一覧画面の構築 (`app/(tabs)/all.tsx`)
  - 全タスクをFlatListで表示
  - 各タスクに「次回レビュー日」「現在のinterval」を表示
- [ ] **5-2** タスク削除機能（スワイプ or 長押しメニュー）
- [ ] **5-3** タスクタップで詳細編集モーダルを開く（タイトル・URL・メモの編集）

---

## Phase 6: UI / スタイル仕上げ

- [ ] **6-1** ダークテーマの一貫したカラーパレットを `tailwind.config.js` に定義
  - ベース: `bg-black` / カード: `bg-zinc-900` / アクセント: `yellow-400`（⚡イメージ）
- [ ] **6-2** ジャッジボタンの色を役割で統一
  - DOWN: `red-500` / KEEP: `blue-500` / BOOST: `yellow-400`
- [ ] **6-3** タブバーのアイコン設定（`@expo/vector-icons`）

---

## Phase 7: QA & 動作確認

- [ ] **7-1** タスク追加 → キューに表示 → ジャッジ → interval更新 の一連フローを実機確認
- [ ] **7-2** アプリ再起動後もデータが保持されること（AsyncStorage永続化）を確認
- [ ] **7-3** URLタップでSafari/ブラウザが開くことを確認
- [ ] **7-4** 今日のタスクゼロ状態の画面表示を確認

---

## 優先順位まとめ

```
Phase 1 → Phase 3 → Phase 4  ← MVP（最速で自分が使える状態）
Phase 2 → Phase 5 → Phase 6 → Phase 7  ← 仕上げ
```

**MVPゴール:** タスクを追加して、今日のキューで3ボタンジャッジができる状態
