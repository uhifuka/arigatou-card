'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThanksWithNames, UserStats } from '@/types';
import { formatDate, getPastMonths } from '@/lib/utils';

export default function HistoryPage() {
  const [messages, setMessages] = useState<ThanksWithNames[]>([]);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  const [month, setMonth] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [search, setSearch] = useState('');

  const months = getPastMonths(12);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (month) params.set('month', month);
    if (senderId) params.set('sender_id', senderId);
    if (receiverId) params.set('receiver_id', receiverId);
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/thanks?${params}`);
    if (res.ok) {
      const { data } = await res.json();
      setMessages(data || []);
    }
    setLoading(false);
  }, [month, senderId, receiverId, search]);

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(({ data }) => setUsers(data || []));
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchMessages, 300);
    return () => clearTimeout(t);
  }, [fetchMessages]);

  const clearFilters = () => {
    setMonth(''); setSenderId(''); setReceiverId(''); setSearch('');
  };

  const hasFilter = month || senderId || receiverId || search;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">ありがとう履歴</h1>
        <p className="text-sm text-gray-400">{messages.length}件表示中</p>
      </div>

      {/* フィルターパネル */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FilterSelect label="月" value={month} onChange={setMonth}>
            <option value="">すべて</option>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </FilterSelect>
          <FilterSelect label="送った人" value={senderId} onChange={setSenderId}>
            <option value="">すべて</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </FilterSelect>
          <FilterSelect label="受け取った人" value={receiverId} onChange={setReceiverId}>
            <option value="">すべて</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </FilterSelect>
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">フリー検索</label>
            <input value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="名前・メッセージ..."
                   className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700
                              focus:outline-none focus:border-rose-300 transition-colors" />
          </div>
        </div>
        {hasFilter && (
          <button onClick={clearFilters}
                  className="text-xs text-rose-400 hover:text-rose-600 transition-colors">
            ✕ フィルターをクリア
          </button>
        )}
      </div>

      {/* 履歴一覧 */}
      {loading
        ? <div className="text-center py-12 text-gray-400 animate-pulse">読み込み中...</div>
        : messages.length === 0
          ? (
            <div className="text-center py-16 text-gray-300">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm">条件に合うメッセージが見つかりません</p>
            </div>
          )
          : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs">
                      <th className="text-left px-4 py-3 font-semibold">日付</th>
                      <th className="text-left px-4 py-3 font-semibold">送った人</th>
                      <th className="text-left px-4 py-3 font-semibold">受け取った人</th>
                      <th className="text-left px-4 py-3 font-semibold">メッセージ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(m => (
                      <tr key={m.id} className="border-t border-gray-50 hover:bg-rose-50/30 transition-colors">
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                          {formatDate(m.sent_date)}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                          {m.sender_name}
                        </td>
                        <td className="px-4 py-3 text-rose-500 font-medium whitespace-nowrap">
                          {m.receiver_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">
                          <p className="truncate">{m.message}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
      }
    </div>
  );
}

function FilterSelect({ label, value, onChange, children }: {
  label: string; value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-400 block mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700
                         focus:outline-none focus:border-rose-300 transition-colors bg-white">
        {children}
      </select>
    </div>
  );
}
