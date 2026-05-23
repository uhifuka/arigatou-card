'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin/dashboard', label: 'ダッシュボード', icon: '📊' },
  { href: '/admin/staff',     label: 'スタッフ一覧',   icon: '👥' },
  { href: '/admin/history',   label: 'ありがとう履歴',  icon: '📋' },
  { href: '/admin/ranking',   label: 'ランキング',     icon: '🏆' },
];

function BearIcon() {
  return (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="10" cy="14" r="7" fill="#e8a878"/>
      <circle cx="30" cy="14" r="7" fill="#e8a878"/>
      <circle cx="10" cy="13" r="4.5" fill="#d4956a"/>
      <circle cx="30" cy="13" r="4.5" fill="#d4956a"/>
      <ellipse cx="20" cy="26" rx="14" ry="12" fill="#e8a878"/>
      <ellipse cx="20" cy="20" rx="10" ry="9" fill="#e8a878"/>
      <ellipse cx="20" cy="25" rx="6.5" ry="5" fill="#d4956a"/>
      <circle cx="17" cy="19" r="1.8" fill="#3d2b1f"/>
      <circle cx="23" cy="19" r="1.8" fill="#3d2b1f"/>
      <path d="M18 24 Q20 27 22 24" stroke="#3d2b1f" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.push('/login');
    if (!loading && session && session.role !== 'admin') router.push('/staff');
  }, [session, loading, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff5f8' }}>
        <div className="text-pink-300 animate-pulse text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#fafafa', fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .bear-float{animation:floatUp 3.5s ease-in-out infinite}
        .nav-active{background:linear-gradient(135deg,#a8d5a2,#7cc377) !important;color:white !important}
      `}</style>

      {/* サイドバー */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 bg-white border-r border-gray-100"
             style={{ boxShadow: '2px 0 12px rgba(0,0,0,0.04)' }}>
        {/* ロゴ */}
        <div className="px-4 pt-5 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #a8d5a2, #7cc377)' }}>
              <span className="text-sm">🍀</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700">ありがとう</p>
              <p className="text-[10px] text-green-400">管理者メニュー</p>
            </div>
          </div>
        </div>

        {/* ナビ */}
        <nav className="flex-1 p-2.5 space-y-0.5">
          {navItems.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                               ${active ? 'nav-active' : 'text-gray-500 hover:bg-green-50 hover:text-green-600'}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            );
          })}
          {/* 設定（将来用） */}
          <div className="pt-2 border-t border-gray-50 mt-2">
            <span className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 cursor-not-allowed">
              <span>⚙️</span>設定
            </span>
          </div>
        </nav>

        {/* ユーザー情報 */}
        <div className="p-3 border-t border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <BearIcon/>
            <div>
              <p className="text-xs font-semibold text-gray-600">{session.name}</p>
              <p className="text-[10px] text-gray-400">管理者 太郎 さん</p>
            </div>
          </div>
          <button onClick={logout}
                  className="w-full text-xs text-gray-400 hover:text-green-500 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
            ログアウト
          </button>
        </div>
      </aside>

      {/* モバイルボトムナビ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 flex"
           style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
        {navItems.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
                  className={`flex-1 flex flex-col items-center py-2 text-[10px] font-medium transition-colors
                             ${active ? 'text-green-500' : 'text-gray-400'}`}>
              <span className="text-base">{item.icon}</span>
              <span className="mt-0.5 leading-tight">
                {item.label.replace('ありがとう','')}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* モバイルヘッダー */}
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍀</span>
            <p className="text-sm font-bold text-gray-700">管理者画面</p>
          </div>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-green-400">ログアウト</button>
        </div>

        {/* デスクトップヘッダー */}
        <div className="hidden md:flex items-center justify-end px-6 py-3 bg-white border-b border-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bear-float inline-block"><BearIcon/></span>
            <span className="font-medium">管理者 {session.name} さん</span>
            <span className="text-gray-300">▾</span>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
