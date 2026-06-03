import { AccelTask, AttemptResult } from '../types/task';

export const REVIEW_DAYS = [1, 7, 21];

export function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// 登録時の初回 nextReviewDate を計算する
export function getInitialNextReviewDate(createdAt: string, result: AttemptResult): string | null {
  if (result === 'circle') return null;
  return addDays(createdAt, REVIEW_DAYS[0]); // +1日
}

// レビュー時の判定: 結果に応じて次のステージを返す
export function judgeTask(task: AccelTask, result: AttemptResult): Partial<AccelTask> {
  const nextStage = task.reviewStage + 1;

  // ⭕ または最終ステージ到達 → 復習終了
  if (result === 'circle' || nextStage >= REVIEW_DAYS.length) {
    return { reviewStage: nextStage, nextReviewDate: null };
  }

  // ✗ または △ → 次のステージをスケジュール（初回登録日基準）
  return {
    reviewStage: nextStage,
    nextReviewDate: addDays(task.createdAt, REVIEW_DAYS[nextStage]),
  };
}

export function getTodaysTasks(tasks: AccelTask[]): AccelTask[] {
  const today = todayString();
  return tasks.filter((t) => t.nextReviewDate !== null && t.nextReviewDate <= today);
}
