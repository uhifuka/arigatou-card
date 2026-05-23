'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ===================== 季節の木 =====================
const MONTH_CFG = [
  { name: '梅の木',     label: '輪', leafColor: 'transparent', bg: 'linear-gradient(160deg,#e8f4f8,#fff0f5)' },
  { name: '蝋梅の木',   label: '輪', leafColor: '#c8e6c0',     bg: 'linear-gradient(160deg,#fffde7,#fffff0)' },
  { name: '桜の木',     label: '輪', leafColor: '#f8c0d0',     bg: 'linear-gradient(160deg,#fce4ec,#fff5f8)' },
  { name: 'りんごの木', label: '輪', leafColor: '#a5d6a7',     bg: 'linear-gradient(160deg,#e8f5e9,#f1f8e9)' },
  { name: '藤の木',     label: '房', leafColor: '#a5d6a7',     bg: 'linear-gradient(160deg,#ede7f6,#f3e5f5)' },
  { name: '紫陽花の木', label: '房', leafColor: '#388e3c',     bg: 'linear-gradient(160deg,#e3f2fd,#e8eaf6)' },
  { name: '百日紅の木', label: '輪', leafColor: '#2e7d32',     bg: 'linear-gradient(160deg,#b3e5fc,#f0fff0)' },
  { name: '桃の木',     label: '個', leafColor: '#2e7d32',     bg: 'linear-gradient(160deg,#b3e5fc,#e1f5fe)' },
  { name: '金木犀の木', label: '輪', leafColor: '#2e7d32',     bg: 'linear-gradient(160deg,#b3e5fc,#e8f5e9)' },
  { name: '柿の木',     label: '個', leafColor: '#f57c00',     bg: 'linear-gradient(160deg,#fff9c4,#fff3e0)' },
  { name: '紅葉の木',   label: '枚', leafColor: 'transparent', bg: 'linear-gradient(160deg,#ffccbc,#fff0e8)' },
  { name: '南天の木',   label: '粒', leafColor: '#2e7d32',     bg: 'linear-gradient(160deg,#e3f2fd,#f0f8ff)' },
];

function renderDeco(month: number, cx: number, cy: number, i: number) {
  switch (month) {
    case 1: {
      const c = i % 2 === 0 ? '#ff4d88' : '#ff6ba0';
      return <g key={i}>{[0,1,2,3,4].map(p => <circle key={p} cx={cx+Math.cos(p*72*Math.PI/180)*4.5} cy={cy+Math.sin(p*72*Math.PI/180)*4.5} r="3.8" fill={c}/>)}<circle cx={cx} cy={cy} r="2.2" fill="#ffeb3b"/></g>;
    }
    case 2: {
      const yc = i % 2 === 0 ? '#ffd700' : '#ffca28';
      return <g key={i}>{[0,1,2,3,4,5].map(p => <ellipse key={p} cx={cx+Math.cos(p*60*Math.PI/180)*4} cy={cy+Math.sin(p*60*Math.PI/180)*4} rx="3.5" ry="2.2" fill={yc} transform={`rotate(${p*60},${cx+Math.cos(p*60*Math.PI/180)*4},${cy+Math.sin(p*60*Math.PI/180)*4})`}/>)}<circle cx={cx} cy={cy} r="2" fill="#fff176"/></g>;
    }
    case 3: {
      const pc = i%3===0 ? '#ffb7c5' : i%3===1 ? '#ff8fab' : '#ffc8d3';
      return <g key={i}>{[0,1,2,3,4].map(p => <ellipse key={p} cx={cx+Math.cos(p*72*Math.PI/180)*4} cy={cy+Math.sin(p*72*Math.PI/180)*4} rx="3.2" ry="2.2" fill={pc} transform={`rotate(${p*72+36},${cx+Math.cos(p*72*Math.PI/180)*4},${cy+Math.sin(p*72*Math.PI/180)*4})`}/>)}<circle cx={cx} cy={cy} r="1.5" fill="#fff5f7"/></g>;
    }
    case 4:
      return <g key={i}>{[0,1,2,3,4].map(p => <ellipse key={p} cx={cx+Math.cos(p*72*Math.PI/180)*4.5} cy={cy+Math.sin(p*72*Math.PI/180)*4.5} rx="3.5" ry="2.5" fill="white" stroke="#f8bbd0" strokeWidth="0.5" transform={`rotate(${p*72+36},${cx+Math.cos(p*72*Math.PI/180)*4.5},${cy+Math.sin(p*72*Math.PI/180)*4.5})`}/>)}<circle cx={cx} cy={cy} r="2.2" fill="#a5d6a7"/></g>;
    case 5:
      return <g key={i}><ellipse cx={cx} cy={cy-3} rx="5" ry="3" fill="#ce93d8"/><ellipse cx={cx-2.5} cy={cy+1.5} rx="3.5" ry="2.5" fill="#ba68c8"/><ellipse cx={cx+2.5} cy={cy+1.5} rx="3.5" ry="2.5" fill="#ab47bc"/><ellipse cx={cx} cy={cy+6} rx="3" ry="2" fill="#9c27b0"/></g>;
    case 6:
      return <g key={i}>{[[-4,-4],[4,-4],[-4,4],[4,4]].map(([dx,dy],p) => <g key={p}><circle cx={cx+(dx||0)} cy={cy+(dy||0)} r="4.5" fill={['#64b5f6','#42a5f5','#90caf9','#1e88e5'][p]}/><circle cx={cx+(dx||0)} cy={cy+(dy||0)} r="1.5" fill="white" opacity="0.8"/></g>)}</g>;
    case 7: {
      const rc = i%2===0 ? '#f06292' : '#ec407a';
      return <g key={i}>{[0,1,2,3,4].map(p => { const a=p*72*Math.PI/180; return <g key={p}><circle cx={cx+Math.cos(a)*5} cy={cy+Math.sin(a)*5} r="3.8" fill={rc}/><circle cx={cx+Math.cos(a+0.6)*3} cy={cy+Math.sin(a+0.6)*3} r="2" fill={rc}/></g>; })}<circle cx={cx} cy={cy} r="2.5" fill="#fff176"/></g>;
    }
    case 8: {
      const col = i%3===0 ? '#ffb347' : i%3===1 ? '#ff8c69' : '#ffa07a';
      return <g key={i}><ellipse cx={cx} cy={cy+1} rx="7.5" ry="8" fill={col}/><ellipse cx={cx-2.5} cy={cy-1} rx="2.5" ry="3.5" fill="rgba(255,255,255,0.3)"/><path d={`M${cx} ${cy-7} Q${cx+3} ${cy-11} ${cx+4.5} ${cy-12}`} stroke="#6d4c41" strokeWidth="1.5" fill="none" strokeLinecap="round"/></g>;
    }
    case 9: {
      const oc = i%2===0 ? '#ff8f00' : '#ffa726';
      return <g key={i}>{[0,1,2,3].map(p => <ellipse key={p} cx={cx+Math.cos(p*90*Math.PI/180)*3.5} cy={cy+Math.sin(p*90*Math.PI/180)*3.5} rx="3" ry="1.8" fill={oc} transform={`rotate(${p*90},${cx+Math.cos(p*90*Math.PI/180)*3.5},${cy+Math.sin(p*90*Math.PI/180)*3.5})`}/>)}<circle cx={cx} cy={cy} r="1.8" fill="#ffcc02"/></g>;
    }
    case 10:
      return <g key={i}><ellipse cx={cx} cy={cy} rx="7" ry="6.5" fill="#ffa726"/><ellipse cx={cx-2} cy={cy-2} rx="2" ry="2.5" fill="rgba(255,255,255,0.3)"/>{[0,1,2,3].map(p => <ellipse key={p} cx={cx+Math.cos(p*90*Math.PI/180)*3.5} cy={cy-6.5+Math.sin(p*90*Math.PI/180)*1.5} rx="3.5" ry="1.5" fill="#4caf50" transform={`rotate(${p*90},${cx+Math.cos(p*90*Math.PI/180)*3.5},${cy-6.5+Math.sin(p*90*Math.PI/180)*1.5})`}/>)}</g>;
    case 11: {
      const rc2 = i%3===0 ? '#e53935' : i%3===1 ? '#f57c00' : '#c62828';
      return <g key={i} transform={`translate(${cx},${cy})`}><ellipse cx="0" cy="-6" rx="3.5" ry="6" fill={rc2}/><ellipse cx="-5.5" cy="-2" rx="3" ry="5" fill={rc2} transform="rotate(-38,-5.5,-2)"/><ellipse cx="5.5" cy="-2" rx="3" ry="5" fill={rc2} transform="rotate(38,5.5,-2)"/><path d="M0 5 L0 10" stroke="#795548" strokeWidth="1.5" strokeLinecap="round"/></g>;
    }
    case 12:
      return <g key={i}><circle cx={cx-3.5} cy={cy-3} r="4" fill="#e53935"/><circle cx={cx+3.5} cy={cy-3} r="4" fill="#c62828"/><circle cx={cx} cy={cy+3} r="4" fill="#ef5350"/><circle cx={cx-4.2} cy={cy-4} r="1.2" fill="rgba(255,255,255,0.6)"/><circle cx={cx+2.8} cy={cy-4} r="1.2" fill="rgba(255,255,255,0.6)"/></g>;
    default: return null;
  }
}

function LoginSeasonalTree({ month, count }: { month: number; count: number }) {
  const MAX = 30;
  const display = Math.min(count, MAX);
  const [visible, setVisible] = useState(0);
  const cfg = MONTH_CFG[month - 1];
  const hasLeaves = cfg.leafColor !== 'transparent';

  useEffect(() => {
    setVisible(0);
    if (display === 0) return;
    let n = 0;
    const iv = setInterval(() => { n++; setVisible(n); if (n >= display) clearInterval(iv); }, 50);
    return () => clearInterval(iv);
  }, [display, month]);

  const positions = useMemo(() =>
    Array.from({ length: MAX }, (_, i) => {
      const angle = (i / MAX) * Math.PI * 8 + i * 0.72;
      const r = 35 + (i % 6) * 11 + Math.sin(i * 1.5) * 10;
      const cx = 140 + Math.cos(angle) * r;
      const cy = 98 + Math.sin(angle) * r * 0.6 - i * 0.28;
      return { cx: Math.max(22, Math.min(258, cx)), cy: Math.max(14, Math.min(178, cy)) };
    }), []);

  return (
    <svg viewBox="0 0 280 300" className="w-full" style={{ maxHeight: 220 }}>
      {hasLeaves && <>
        <ellipse cx="140" cy="98" rx="85" ry="58" fill={cfg.leafColor} opacity="0.55"/>
        <ellipse cx="82" cy="132" rx="40" ry="27" fill={cfg.leafColor} opacity="0.45"/>
        <ellipse cx="198" cy="124" rx="37" ry="25" fill={cfg.leafColor} opacity="0.45"/>
      </>}
      <ellipse cx="140" cy="295" rx="26" ry="7" fill="#c4a882" opacity="0.55"/>
      <path d="M133 295 Q130 268 128 244 Q125 220 128 200 Q130 183 133 170" stroke="#8B6347" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M147 295 Q150 268 152 244 Q155 220 152 200 Q150 183 147 170" stroke="#8B6347" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M133 182 Q108 165 80 150" stroke="#9B7050" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
      <path d="M147 174 Q172 158 200 146" stroke="#9B7050" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
      <path d="M138 178 Q133 150 129 126" stroke="#a07858" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M142 172 Q148 144 153 120" stroke="#a07858" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M106 166 Q94 148 88 132" stroke="#b08868" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M174 158 Q186 140 192 124" stroke="#b08868" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {positions.map((pos, i) => (
        <g key={i} style={{
          opacity: i < visible ? 1 : 0,
          transform: i < visible ? 'scale(1)' : 'scale(0)',
          transformOrigin: `${pos.cx}px ${pos.cy}px`,
          transition: `opacity 0.3s ease ${i*0.03}s, transform 0.3s ease ${i*0.03}s`,
        }}>
          {renderDeco(month, pos.cx, pos.cy, i)}
        </g>
      ))}
    </svg>
  );
}

// ===================== ログインページキャラ =====================
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
      <ellipse cx="32" cy="88" rx="12" ry="9" fill="#ff8fab"/>
      <ellipse cx="58" cy="88" rx="12" ry="9" fill="#ff8fab"/>
      <path d="M45 78 C43 74 37 74 37 80 C37 84 45 90 45 90 C45 90 53 84 53 80 C53 74 47 74 45 78Z" fill="#ff4d6d" opacity="0.9"/>
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

// ===================== メインページ =====================
export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [treeInfo, setTreeInfo] = useState<{ count: number; month: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/public/tree')
      .then(r => r.json())
      .then(({ data }) => setTreeInfo(data))
      .catch(() => {});
  }, []);

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

  const month = treeInfo?.month ?? new Date().getMonth() + 1;
  const count = treeInfo?.count ?? 0;
  const cfg = MONTH_CFG[month - 1];

  const motivationMsg = count === 0
    ? 'まだ誰も送っていません。あなたが最初の一人になりませんか？ 🌱'
    : count < 5
    ? `もう${count}${cfg.label}の感謝が届いています。あなたも伝えませんか？ 🌿`
    : count < 15
    ? `${count}${cfg.label}の感謝が届いています！木がぐんぐん育っています 🌸`
    : `なんと${count}${cfg.label}も！みんなの感謝で木が満開です ✨`;

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
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #ffb3c9, transparent)' }}/>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #b3d4ff, transparent)' }}/>
      </div>

      <div className="relative w-full max-w-sm fade-in">
        {/* キャラクター */}
        <div className="flex justify-center items-end gap-4 mb-3">
          <div className="float1"><BunnyHeart/></div>
          <div className="float2"><BearChar/></div>
        </div>

        {/* タイトル */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">ありがとう</h1>
          <p className="text-xs text-pink-400 mt-0.5 font-medium">感謝のきもちを伝えよう 💗</p>
          <p className="text-[10px] text-gray-400 mt-1">上田皮ふ科 スタッフシステム</p>
        </div>

        {/* 今月の感謝の木カード */}
        <div className="rounded-2xl overflow-hidden mb-4"
             style={{ background: cfg.bg, boxShadow: '0 4px 20px rgba(255,143,171,0.15)' }}>
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 font-medium">{month}月の感謝の木 🌳</p>
              <p className="text-base font-bold text-gray-700">{cfg.name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400">今月のありがとう</p>
              <p className="text-3xl font-black" style={{ color: '#ff6b9d', lineHeight: 1 }}>{count}</p>
              <p className="text-[10px] text-gray-500">{cfg.label}</p>
            </div>
          </div>

          <div className="px-4 pb-2">
            <LoginSeasonalTree month={month} count={count} />
          </div>

          <div className="px-4 pb-3 text-center">
            <p className="text-[11px] text-gray-500 leading-relaxed">{motivationMsg}</p>
          </div>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6"
             style={{ boxShadow: '0 8px 40px rgba(255,143,171,0.2)', border: '1.5px solid rgba(255,183,197,0.3)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1.5">ログインID</label>
              <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                placeholder="ログインID"
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

        <p className="text-center text-xs text-gray-300 mt-4">
          感謝のきもちを、かんたんに伝え合える♪
        </p>
      </div>
    </div>
  );
}
