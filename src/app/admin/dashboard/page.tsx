'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { formatMonth } from '@/lib/utils';
import { UserStats, MonthlyStats } from '@/types';

interface StatsData {
  monthly_stats: MonthlyStats[];
  user_stats: UserStats[];
  total_count: number;
}

// ===== かわいいキャラ =====
function BearWithBird() {
  return (
    <svg viewBox="0 0 80 90" width="70" height="70">
      <circle cx="22" cy="32" r="11" fill="#d4956a"/>
      <circle cx="58" cy="32" r="11" fill="#d4956a"/>
      <circle cx="22" cy="31" r="7.5" fill="#c4855a"/>
      <circle cx="58" cy="31" r="7.5" fill="#c4855a"/>
      <ellipse cx="40" cy="56" rx="25" ry="23" fill="#e8a878"/>
      <ellipse cx="40" cy="43" rx="19" ry="17" fill="#e8a878"/>
      <ellipse cx="40" cy="52" rx="12" ry="9" fill="#d4956a"/>
      <circle cx="34" cy="41" r="3" fill="#3d2b1f"/>
      <circle cx="46" cy="41" r="3" fill="#3d2b1f"/>
      <circle cx="35" cy="39.5" r="1" fill="white"/>
      <circle cx="47" cy="39.5" r="1" fill="white"/>
      <path d="M36 51 Q40 55 44 51" stroke="#3d2b1f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* ひよこ */}
      <ellipse cx="53" cy="20" rx="8" ry="7" fill="#ffd54f"/>
      <circle cx="53" cy="14" r="5.5" fill="#ffd54f"/>
      <circle cx="51" cy="13" r="1.2" fill="#3d2b1f"/>
      <polygon points="53,16 51,18 55,18" fill="#ff9800"/>
      <ellipse cx="45" cy="23" rx="3" ry="2" fill="#ffd54f" transform="rotate(-30,45,23)"/>
      <ellipse cx="61" cy="23" rx="3" ry="2" fill="#ffd54f" transform="rotate(30,61,23)"/>
    </svg>
  );
}

function GreenBird() {
  return (
    <svg viewBox="0 0 50 60" width="40" height="48">
      <ellipse cx="25" cy="38" rx="16" ry="18" fill="#81c784"/>
      <circle cx="25" cy="20" r="13" fill="#81c784"/>
      <circle cx="21" cy="18" r="2.5" fill="#3d2b1f"/>
      <circle cx="21.5" cy="17" r="0.8" fill="white"/>
      <polygon points="25,22 22,25 28,25" fill="#ff9800"/>
      <ellipse cx="13" cy="38" rx="5" ry="3" fill="#66bb6a" transform="rotate(-40,13,38)"/>
      <ellipse cx="37" cy="38" rx="5" ry="3" fill="#66bb6a" transform="rotate(40,37,38)"/>
    </svg>
  );
}

// ===== ランキングアイコン =====
function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm font-bold text-gray-300 w-6 text-center">{rank}</span>;
}

// ===== 成長指標 =====
function GrowthBadge({ value, prev }: { value: number; prev: number }) {
  const diff = value - prev;
  if (diff === 0) return null;
  const positive = diff > 0;
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${positive ? 'text-green-600 bg-green-50' : 'text-red-400 bg-red-50'}`}>
      {positive ? '↑' : '↓'} {Math.abs(diff)}件
    </span>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [ranking, setRanking] = useState<{ send_ranking: any[]; receive_ranking: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const month = new Date().toISOString().substring(0, 7);
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch(`/api/admin/ranking?month=${month}`).then(r => r.json()),
    ]).then(([statsData, rankData]) => {
      setStats(statsData.data);
      setRanking(rankData.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-pink-300 animate-pulse text-sm">データを読み込み中...</div>
      </div>
    );
  }

  const monthlyData = stats?.monthly_stats.map(m => ({
    ...m,
    label: formatMonth(m.month + '-01').replace('年', '/').replace('月', ''),
  })) || [];

  const currentMonthCount = monthlyData[monthlyData.length - 1]?.total_count || 0;
  const prevMonthCount = monthlyData[monthlyData.length - 2]?.total_count || 0;

  const totalReceive = stats?.user_stats.reduce((s, u) => s + u.receive_count, 0) || 0;
  const totalSend = stats?.user_stats.reduce((s, u) => s + u.send_count, 0) || 0;

  const pieData = [
    { name: 'もらったありがとう', value: totalReceive },
    { name: '送ったありがとう', value: totalSend },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .float-anim{animation:floatUp 3s ease-in-out infinite}
        .fade-slide{animation:fadeSlideIn 0.35s ease-out both}
        .stagger>*:nth-child(1){animation-delay:0.05s}
        .stagger>*:nth-child(2){animation-delay:0.1s}
        .stagger>*:nth-child(3){animation-delay:0.15s}
        .stagger>*:nth-child(4){animation-delay:0.2s}
      `}</style>

      {/* ページタイトル + キャラ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-700">📊 ダッシュボード</h1>
          <p className="text-xs text-gray-400 mt-0.5">全体のありがとう活動をまとめて確認できます</p>
        </div>
        <div className="float-anim">
          <BearWithBird />
        </div>
      </div>

      {/* ===== KPIカード ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger fade-slide">
        <KpiCard
          label="ありがとう総数（今月）"
          value={currentMonthCount}
          color="#4caf50"
          badge={<GrowthBadge value={currentMonthCount} prev={prevMonthCount}/>}
        />
        <KpiCard
          label="もらったありがとう数（今月）"
          value={totalReceive > 0 ? Math.round(totalReceive / Math.max(monthlyData.length, 1)) : currentMonthCount}
          color="#e85d6a"
          badge={<span className="text-[10px] text-pink-300">今月推定</span>}
        />
        <KpiCard
          label="送ったありがとう数（今月）"
          value={totalSend > 0 ? Math.round(totalSend / Math.max(monthlyData.length, 1)) : currentMonthCount}
          color="#5c8ae8"
          badge={<span className="text-[10px] text-blue-300">今月推定</span>}
        />
      </div>

      {/* ===== グラフ行 ===== */}
      <div className="grid md:grid-cols-2 gap-4 fade-slide">
        {/* 月別棒グラフ */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(255,143,171,0.1)' }}>
          <h2 className="text-sm font-bold text-gray-600 mb-3">月ごとのありがとう総数</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top:4, right:8, left:-20, bottom:4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8f8f8"/>
              <XAxis dataKey="label" tick={{ fontSize:10, fill:'#bbb' }}/>
              <YAxis tick={{ fontSize:10, fill:'#bbb' }} allowDecimals={false}/>
              <Tooltip
                contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', fontSize:'12px' }}
                formatter={(v) => [`${v}件`]}
              />
              <Bar dataKey="total_count" fill="#81c784" radius={[5,5,0,0]}/>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a5d6a7"/>
                  <stop offset="100%" stopColor="#66bb6a"/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ドーナツ円グラフ */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(255,143,171,0.1)' }}>
          <h2 className="text-sm font-bold text-gray-600 mb-1">ありがとうの内訳（今月）</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%"
                   innerRadius={50} outerRadius={80}
                   dataKey="value" paddingAngle={3}>
                <Cell fill="#ffb3c9"/>
                <Cell fill="#b3d4ff"/>
              </Pie>
              <Tooltip formatter={(v, name) => [`${v}件 (${Math.round(Number(v)/(totalReceive+totalSend||1)*100)}%)`, name]}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{background:'#ffb3c9'}}/> もらったありがとう {totalReceive}件</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{background:'#b3d4ff'}}/> 送ったありがとう {totalSend}件</span>
          </div>
        </div>
      </div>

      {/* ===== ランキング行 ===== */}
      <div className="grid md:grid-cols-2 gap-4 fade-slide">
        <RankingCard
          title="✈️ ありがとう送信ランキング（今月）"
          entries={ranking?.send_ranking || []}
          colorClass="text-pink-500"
          bgClass="bg-pink-50"
        />
        <RankingCard
          title="💗 ありがとう受信ランキング（今月）"
          entries={ranking?.receive_ranking || []}
          colorClass="text-pink-500"
          bgClass="bg-pink-50"
        />
      </div>

      {/* ===== 下部装飾 ===== */}
      <div className="flex justify-end items-end gap-3 mt-2 pb-2">
        <div className="float-anim">
          <GreenBird/>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-400 font-bold">みんなの感謝が</p>
          <p className="text-xs text-green-400 font-bold">職場をもっとステキにするよ♪</p>
        </div>
      </div>
    </div>
  );
}

// ===== サブコンポーネント =====

function KpiCard({ label, value, color, badge }: { label: string; value: number; color: string; badge?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 fade-slide" style={{ boxShadow: '0 2px 14px rgba(255,143,171,0.1)' }}>
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold" style={{ color }}>{value.toLocaleString()}<span className="text-sm font-normal text-gray-400 ml-0.5">件</span></p>
        {badge}
      </div>
    </div>
  );
}

function RankingCard({ title, entries, colorClass, bgClass }: {
  title: string; entries: any[]; colorClass: string; bgClass: string;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 14px rgba(255,143,171,0.1)' }}>
      <div className={`px-4 py-3 ${bgClass}`}>
        <h2 className="text-sm font-bold text-gray-600">{title}</h2>
      </div>
      <div className="p-4">
        {entries.length === 0
          ? <p className="text-xs text-gray-300 text-center py-6">データなし</p>
          : (
            <div className="space-y-2">
              {entries.slice(0, 5).map((entry, i) => (
                <div key={entry.user_id}
                     className={`flex items-center gap-3 p-2.5 rounded-xl ${i < 3 ? bgClass : 'bg-gray-50'}`}>
                  <RankIcon rank={i + 1}/>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{entry.user_name}さん</p>
                    {entry.department_name && <p className="text-[10px] text-gray-400">{entry.department_name}</p>}
                  </div>
                  <p className={`text-lg font-bold ${colorClass}`}>
                    {entry.count}<span className="text-xs font-normal text-gray-400">件</span>
                  </p>
                </div>
              ))}
              {entries.length > 5 && (
                <button className="w-full text-xs text-pink-400 hover:text-pink-600 pt-1 transition-colors">
                  もっと見る ›
                </button>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
}
