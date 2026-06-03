export type AttemptResult = 'circle' | 'triangle' | 'cross';

export interface AccelTask {
  id: string;
  title: string;
  referenceUrl?: string;
  memo?: string;
  firstAttemptResult: AttemptResult;
  reviewStage: number;           // 0=1日後待ち, 1=7日後待ち, 2=21日後待ち, 3=完了
  nextReviewDate: string | null; // null = 復習なし（完了 or 初回⭕）
  createdAt: string;             // YYYY-MM-DD 初回登録日（復習スケジュールの基準）
}
