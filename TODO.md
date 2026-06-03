# AccelLearn TODO

## Android 配布

- [ ] Android APK ビルド完了を確認（EAS Build キュー待ち中）
- [ ] APK をダウンロードして Android 端末にインストール動作確認
- [ ] 友人に APK を共有して動作フィードバックをもらう

---

## App Store 公開（$99/年 が必要）

- [ ] Apple Developer Program に登録（https://developer.apple.com/programs/）
- [ ] `eas build --platform ios --profile production` で iOS 本番ビルド
- [ ] App Store Connect でアプリ登録
  - [ ] アプリ名・説明文・キーワード入力
  - [ ] スクリーンショットをアップロード（iPhone 6.9" / 5.5"）
  - [ ] カテゴリ：Education
  - [ ] 年齢制限の設定（アンケートに回答）
  - [ ] プライバシーポリシー URL を設定（https://takuaki-taku.github.io/AccelLearn/）
- [ ] `eas submit --platform ios` で Apple に提出
- [ ] Apple 審査通過を待つ（1〜3日）

---

## QA・実機テスト

- [ ] Android 実機での一連フロー確認
  - [ ] タスク追加 → Today's Queue に表示 → ジャッジ → スケジュール更新
  - [ ] アプリ再起動後もデータが保持されること
  - [ ] URL タップで外部ブラウザが開くこと
  - [ ] テーマ切り替え（ダーク ↔ ライト）
- [ ] iPhone 実機テスト（App Store 公開後 or TestFlight 経由）

---

## あると良い改善（優先度低）

- [ ] スプラッシュ画面の背景色をアイコンに合わせて調整
- [ ] Android 用アダプティブアイコンの背景色を確認・調整
- [ ] App Store 用の日本語説明文を追加（現在は英語のみ）
- [ ] タスク0件時のオンボーディング導線の改善
- [ ] 今日期限のタスクにプッシュ通知を送る機能

---

## 完了済み ✅

- [x] Phase 1–5: データ層・ナビ・Queue・All Tasks・編集/削除
- [x] Phase 6: UI 仕上げ（ダーク/ライトテーマ・アイコン・色分け）
- [x] Phase 7: シミュレーター動作確認・スクリーンショット撮影
- [x] EAS Build 設定（Android APK / iOS simulator / iOS production）
- [x] プライバシーポリシー（GitHub Pages 公開済み）
- [x] アプリアイコン・スプラッシュ画面
- [x] GitHub public リポジトリ公開
