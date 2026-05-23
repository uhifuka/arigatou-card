// =============================================
// 型定義
// =============================================

export type UserRole = 'staff' | 'admin';

export interface User {
  id: string;
  login_id: string;
  name: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  created_at: string;
}

export interface ThanksMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  sent_date: string;
  created_at: string;
}

export interface ThanksWithNames extends ThanksMessage {
  sender_name: string;
  sender_login_id: string;
  sender_department?: string;
  receiver_name: string;
  receiver_login_id: string;
  receiver_department?: string;
}

export interface UserStats {
  id: string;
  login_id: string;
  name: string;
  role: UserRole;
  department_name?: string;
  send_count: number;
  receive_count: number;
}

export interface MonthlyStats {
  month: string;
  total_count: number;
}

export interface RankingEntry {
  rank: number;
  user_id: string;
  user_name: string;
  department_name?: string;
  count: number;
}

// APIレスポンス型
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// 認証セッション型
export interface AuthSession {
  userId: string;
  loginId: string;
  name: string;
  role: UserRole;
}

// フォーム送信型
export interface ThanksFormData {
  receiver_id: string;
  message: string;
  sent_date: string;
}

// 管理者用フィルター型
export interface ThanksFilter {
  month?: string;      // YYYY-MM
  sender_id?: string;
  receiver_id?: string;
  search?: string;
}
