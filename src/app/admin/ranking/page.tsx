'use client';

import { useState, useEffect } from 'react';
import { getPastMonths, formatMonth } from '@/lib/utils';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function RankingPage() {
  const [data, setData] = useState<any>(null);
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  const [loading, setLoading] = useState(true);
  const months = getPastMonths(12);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/ranking?month=${month}`)
      .then(r => r.json())
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [month]);

  return (
    <div className="space-y-5 max-w-3xl mx-auto" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fade-slide{animation:fadeSlideIn 0.35s ease-out both}`}</style>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-700">🏆 ランキング</h1>
          <p className="text-xs text-gray-400 mt-0.5">月ごとの送信・受信ランキング</p>
        </div>
      </div>

      {/* 月選択 */}
      <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 inline-flex w-full"
           style={{ boxShadow: '0 2px 12px rgba(255,143,171,0.08)' }}>
        <span className="text-sm text-gray-500 font-semibold whitespace-nowrap">📅 対象月：</span>
        <select value={month} onChange={e => setMonth(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-pink-100 text-sm text-gray-700 bg-pink-50 focus:outline-none focus:border-pink-300">
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      {loading
        ? <div className="text-center py-12 text-pink-300 animate-pulse">読み込み中...</div>
        : (
          <>
            <div className="grid md:grid-cols-2 gap-4 fade-slide">
              <RankPanel
                title="✈️ ありがとう送信ランキング（今月）"
                entries={data?.send_ranking || []}
                accent="#ff8fab"
                bg="bg-pink-50"
              />
              <RankPanel
                title="💗 ありがとう受信ランキング（今月）"
                entries={data?.receive_ranking || []}
                accent="#e85d6a"
                bg="bg-rose-50"
              />
            </div>

            {/* まとめ */}
            <div className="bg-white rounded-2xl p-4 fade-slide text-center"
                 style={{ boxShadow: '0 2px 12px rgba(255,143,171,0.1)' }}>
              <p className="text-sm font-bold text-gray-600 mb-3">
                {formatMonth((data?.month || month) + '-01')} のまとめ
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-pink-500">
                    {data?.send_ranking?.reduce((s: number, r: any) => s + r.count, 0) || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">総ありがとう数</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">
                    {data?.send_ranking?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">参加スタッフ数</p>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}

function RankPanel({ title, entries, accent, bg }: {
  title: string; entries: any[]; accent: string; bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 14px rgba(255,143,171,0.1)' }}>
      <div className={`px-4 py-3 ${bg}`}>
        <h2 className="text-sm font-bold text-gray-600">{title}</h2>
      </div>
      <div className="p-4">
        {entries.length === 0
          ? <p className="text-xs text-gray-300 text-center py-8">今月はまだデータがありません</p>
          : (
            <div className="space-y-2">
              {entries.slice(0, 5).map((entry: any, i: number) => (
                <div key={entry.user_id}
                     className={`flex items-center gap-3 p-2.5 rounded-xl ${i < 3 ? bg : 'bg-gray-50'}`}>
                  <div className="w-7 text-center shrink-0">
                    {i < 3
                      ? <span className="text-xl">{['🥇','🥈','🥉'][i]}</span>
                      : <span className="text-sm font-bold text-gray-300">{i + 1}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">{entry.user_name}さん</p>
                    {entry.department_name && (
                      <p className="text-[10px] text-gray-400">{entry.department_name}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold" style={{ color: accent }}>{entry.count}</span>
                    <span className="text-xs text-gray-400 ml-0.5">件</span>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
