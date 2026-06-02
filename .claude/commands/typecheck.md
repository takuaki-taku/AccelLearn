---
description: "TypeScript の型チェックを実行してエラーを報告する"
---

以下のコマンドを実行して TypeScript の型エラーを確認する:

```bash
npx tsc --noEmit
```

## 結果の解釈

- **エラーなし** — 型チェック通過。コミット可能。
- **エラーあり** — エラー内容を解析して修正案を提示する。

## AccelLearn 固有のよくあるエラー

1. **NativeWind の `className`**: `nativewind-env.d.ts` に `/// <reference types="nativewind/types" />` が含まれているか確認する。

2. **AsyncStorage の戻り値**: `AsyncStorage.getItem()` は `Promise<string | null>` を返す。null チェックを省くと strict モードで型エラーになる。

3. **Reanimated の `runOnJS`**: コールバックの型が合わない場合、ワークレット外で定義した関数を `runOnJS` でラップしているか確認する。

4. **AccelTask の optional フィールド**: `referenceUrl?` と `memo?` は `string | undefined`。アクセス前に存在確認（`task.referenceUrl && ...`）が必要。
