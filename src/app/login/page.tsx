'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function BunnyHeart() {
  return (
    <svg viewBox="0 0 90 110" width="80" height="88">
      <ellipse cx="45" cy="85" rx="30" ry="22" fill="#fce8f0"/>
      <ellipse cx="45" cy="55" rx="23" ry="21" fill="#fce8f0"/>
      <ellipse cx="28" cy="33" rx="8" ry="17" fill="#fce8f0" transform="rotate(-12,28,33)"/>
      <ellipse cx="62" cy="33" rx="8" ry="17" fill="#fce8f0" transform="rotate(12,62,33)"/>
      <ellipse cx="28" cy="35" rx="4.5" ry="12" fill="#ffb3c9" transform="rotate(-12,28,33)"/>
      <ellipse cx="62" cy="35" rx="4.5" ry="12" fill="#ffb3c9" transform="rotate(12,62,33)"/>
      <circle cx="38" cy="53" r="4" fill="#3d2b1f"/>
      <circle cx="52" cy="53" r="4" fill="#3d2b1f"/>
      <circle cx="39.5" cy="51" r="1.3" fill="white"/>
      <circle cx="53.5" cy="51" r="1.3" fill="white"/>
      <ellipse cx="45" cy="61" rx="3.5" ry="2.2" fill="#ffb3c9"/>
      <path d="M40 65 Q45 70 50 65" stroke="#3d2b1f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* ハートを持つ腕 */}
      <ellipse cx="32" cy="88" rx="12" ry="9" fill="#ff8fab"/>
      <ellipse cx="58" cy="88" rx="12" ry="9" fill="#ff8fab"/>
      {/* 中央のハート */}
      <path d="M45 78 C43 74 37 74 37 80 C37 84 45 90 45 90 C45 90 53 84 53 80 C53 74 47 74 45 78Z"
            fill="#ff4d6d" opacity="0.9"/>
    </svg>
  );
}

function BearChar() {
  return (
    <svg viewBox="0 0 80 95" width="65" height="77">
      <circle cx="22" cy="30" r="12" fill="#d4956a"/>
      <circle cx="58" cy="30" r="12" fill="#d4956a"/>
      <circle cx="22" cy="29" r="8" fill="#c4855a"/>
      <circle cx="58" cy="29" r="8" fill="#c4855a"/>
      <ellipse cx="40" cy="55" rx="26" ry="24" fill="#e8a878"/>
      <ellipse cx="40" cy="42" rx="20" ry="18" fill="#e8a878"/>
      <ellipse cx="40" cy="53" rx="13" ry="10" fill="#d4956a"/>
      <circle cx="34" cy="40" r="3.5" fill="#3d2b1f"/>
      <circle cx="46" cy="40" r="3.5" fill="#3d2b1f"/>
      <circle cx="35" cy="38.5" r="1.2" fill="white"/>
      <circle cx="47" cy="38.5" r="1.2" fill="white"/>
      <path d="M36 52 Q40 56 44 52" stroke="#3d2b1f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="28" cy="67" rx="9" ry="7" fill="#d4956a"/>
      <ellipse cx="52" cy="67" rx="9" ry="7" fill="#d4956a"/>
    </svg>
  );
}

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || 'ログインに失敗しました'); return; }
      toast.success(`ようこそ、${json.data.name}さん！ 🌸`);
      router.push(json.data.role === 'admin' ? '/admin/dashboard' : '/staff');
    } catch {
      toast.error('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg, #fff0f4 0%, #fff8fa 50%, #f5f0ff 100%)', fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .float1{animation:floatUp 3s ease-in-out infinite}
        .float2{animation:floatUp 3.6s ease-in-out infinite 0.4s}
        .fade-in{animation:fadeIn 0.5s ease-out both}
        input:focus{outline:none;border-color:#ffb7c5 !important}
      `}</style>

      {/* 背景の丸 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-25"
             style={{ background: 'radial-gradient(circle, #ffb3c9, transparent)' }}/>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, #b3d4ff, transparent)' }}/>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-15"
             style={{ background: 'radial-gradient(circle, #ffd6e7, transparent)' }}/>
      </div>

      <div className="relative w-full max-w-sm fade-in">
        {/* キャラクター */}
        <div className="flex justify-center items-end gap-4 mb-4">
          <div className="float1"><BunnyHeart/></div>
          <div className="float2"><BearChar/></div>
        </div>

        {/* タイトル */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-gray-700">ありがとう</h1>
          <p className="text-xs text-pink-400 mt-0.5 font-medium">感謝のきもちを伝えよう 💗</p>
          <p className="text-[10px] text-gray-400 mt-1">上田皮ふ科 スタッフシステム</p>
        </div>

        {/* フォームカード */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6"
             style={{ boxShadow: '0 8px 40px rgba(255,143,171,0.2)', border: '1.5px solid rgba(255,183,197,0.3)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1.5">ログインID</label>
              <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                placeholder="例: ueda001"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 bg-pink-50/60 text-gray-700 text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1.5">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 bg-pink-50/60 text-gray-700 text-sm transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #ff8fab, #ff6b9d)', boxShadow: '0 4px 20px rgba(255,107,157,0.4)' }}
            >
              {loading ? '読み込み中...' : '✈️ ログイン'}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-300 mt-4">
            IDがわからない場合は管理者にご確認ください
          </p>
        </div>

        {/* 底部テキスト */}
        <p className="text-center text-xs text-gray-300 mt-5">
          感謝のきもちを、かんたんに伝え合える♪<br/>
          みんなでつくる、あたたかい職場づくりをサポートします！
        </p>
      </div>
    </div>
  );
}
