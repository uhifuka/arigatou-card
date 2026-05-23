import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 日付フォーマット
export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy年M月d日', { locale: ja });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy年M月d日 HH:mm', { locale: ja });
  } catch {
    return dateStr;
  }
}

// YYYY-MM フォーマット
export function formatMonth(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy年M月', { locale: ja });
  } catch {
    return dateStr;
  }
}

// 今日の日付を YYYY-MM-DD で返す
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// 現在の YYYY-MM を返す
export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

// 月のリストを生成（過去12ヶ月）
export function getPastMonths(count: number = 12): { value: string; label: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      value: format(d, 'yyyy-MM'),
      label: format(d, 'yyyy年M月', { locale: ja }),
    });
  }
  return months;
}
