'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { ThanksWithNames } from '@/types';
import { formatDate, getTodayString } from '@/lib/utils';

interface StaffUser {
  id: string;
  name: string;
  departments?: { name: string };
}

type NavItem = 'home' | 'send' | 'received' | 'sent' | 'mypage' | 'tree';

// ===================== 桜の木コンポーネント =====================
function SakuraTree({ totalCount }: { totalCount: number }) {
  const maxFlowers = 60;
  const flowerCount = Math.min(totalCount, maxFlowers);
  const [visibleFlowers, setVisibleFlowers] = useState(0);

  useEffect(() => {
    setVisibleFlowers(0);
    if (flowerCount === 0) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleFlowers(i);
      if (i >= flowerCount) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [flowerCount]);

  const flowers = Array.from({ length: maxFlowers }, (_, i) => {
    const angle = (i / maxFlowers) * Math.PI * 6 + i * 0.7;
    const radius = 28 + (i % 5) * 9 + Math.sin(i * 1.3) * 8;
    const cx = 80 + Math.cos(angle) * radius * 0.9;
    const cy = 60 + Math.sin(angle) * radius * 0.55 - i * 0.35;
    return { cx: Math.max(10, Math.min(150, cx)), cy: Math.max(5, Math.min(100, cy)) };
  });

  return (
    <div className="flex flex-col items-center py-3">
      <div className="relative">
        <svg viewBox="0 0 160 140" width="150" height="130">
          <path d="M78 138 Q75 120 72 105 Q68 90 70 80" stroke="#a0785a" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M82 138 Q85 120 88 105 Q92 90 90 80" stroke="#a0785a" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M78 100 Q60 85 45 75" stroke="#8b6347" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M80 90 Q95 75 110 68" stroke="#8b6347" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M79 108 Q65 98 55 92" stroke="#8b6347" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M81 95 Q93 87 100 82" stroke="#8b6347" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M79 85 Q80 70 80 60" stroke="#8b6347" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="80" cy="58" rx="42" ry="30" fill="#c8e6c0" opacity="0.6"/>
          <ellipse cx="55" cy="72" rx="22" ry="15" fill="#b8ddb0" opacity="0.5"/>
          <ellipse cx="108" cy="68" rx="20" ry="14" fill="#b8ddb0" opacity="0.5"/>
          {flowers.map((pos, i) => (
            <g key={i} style={{
              opacity: i < visibleFlowers ? 1 : 0,
              transform: i < visibleFlowers ? 'scale(1)' : 'scale(0)',
              transformOrigin: `${pos.cx}px ${pos.cy}px`,
              transition: `opacity 0.3s ease ${i * 0.02}s, transform 0.3s ease ${i * 0.02}s`,
            }}>
              {[0,1,2,3,4].map(p => (
                <ellipse key={p}
                  cx={pos.cx + Math.cos(p * Math.PI * 2 / 5) * 3.5}
                  cy={pos.cy + Math.sin(p * Math.PI * 2 / 5) * 3.5}
                  rx="3" ry="2"
                  fill={i % 3 === 0 ? '#ffb7c5' : i % 3 === 1 ? '#ff8fab' : '#ffc8d3'}
                  transform={`rotate(${p * 72 + 30}, ${pos.cx + Math.cos(p * Math.PI * 2 / 5) * 3.5}, ${pos.cy + Math.sin(p * Math.PI * 2 / 5) * 3.5})`}
                />
              ))}
              <circle cx={pos.cx} cy={pos.cy} r="1.5" fill="#fff5f7"/>
              <circle cx={pos.cx} cy={pos.cy} r="0.8" fill="#ffb7c5"/>
            </g>
          ))}
        </svg>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[10px] font-bold text-rose-400 bg-white rounded-full px-2 py-0.5 shadow-sm border border-rose-100">
            🌸 {totalCount}件
          </span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center leading-tight">
        みんなの感謝が<br/>木を咲かせています
      </p>
    </div>
  );
}

function BunnyChar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className}>
      <ellipse cx="40" cy="75" rx="28" ry="22" fill="#fce8f0"/>
      <ellipse cx="40" cy="48" rx="22" ry="20" fill="#fce8f0"/>
      <ellipse cx="25" cy="28" rx="7" ry="16" fill="#fce8f0" transform="rotate(-10,25,28)"/>
      <ellipse cx="55" cy="28" rx="7" ry="16" fill="#fce8f0" transform="rotate(10,55,28)"/>
      <ellipse cx="25" cy="30" rx="4" ry="11" fill="#ffb3c9" transform="rotate(-10,25,28)"/>
      <ellipse cx="55" cy="30" rx="4" ry="11" fill="#ffb3c9" transform="rotate(10,55,28)"/>
      <circle cx="34" cy="46" r="3.5" fill="#3d2b1f"/>
      <circle cx="46" cy="46" r="3.5" fill="#3d2b1f"/>
      <circle cx="35" cy="44.5" r="1.2" fill="white"/>
      <circle cx="47" cy="44.5" r="1.2" fill="white"/>
      <ellipse cx="40" cy="53" rx="3" ry="2" fill="#ffb3c9"/>
      <path d="M36 57 Q40 61 44 57" stroke="#3d2b1f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="30" cy="78" rx="10" ry="8" fill="#ff8fab"/>
      <path d="M30 74 L22 85 M30 74 L38 85" stroke="#fce8f0" strokeWidth="2"/>
      <ellipse cx="50" cy="78" rx="10" ry="8" fill="#ff8fab"/>
      <path d="M50 74 L42 85 M50 74 L58 85" stroke="#fce8f0" strokeWidth="2"/>
    </svg>
  );
}

function BearChar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 95" className={className}>
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
      <ellipse cx="40" cy="48" rx="4" ry="2.5" fill="#c4855a"/>
      <path d="M36 52 Q40 56 44 52" stroke="#3d2b1f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="28" cy="67" rx="9" ry="7" fill="#d4956a"/>
      <ellipse cx="52" cy="67" rx="9" ry="7" fill="#d4956a"/>
    </svg>
  );
}

// ===================== 月別感謝の木 =====================
const MONTH_CONFIG = [
  { name: '梅', bg: 'linear-gradient(180deg,#e8f4f8 0%,#fff0f5 100%)', leafColor: 'transparent', label: '輪', maxItems: 40 },
  { name: '蝋梅', bg: 'linear-gradient(180deg,#fffde7 0%,#fffff0 100%)', leafColor: '#c8e6c0', label: '輪', maxItems: 40 },
  { name: '桜', bg: 'linear-gradient(180deg,#fce4ec 0%,#fff5f8 100%)', leafColor: '#f8c0d0', label: '輪', maxItems: 50 },
  { name: 'りんごの花', bg: 'linear-gradient(180deg,#e8f5e9 0%,#f1f8e9 100%)', leafColor: '#a5d6a7', label: '輪', maxItems: 40 },
  { name: '藤', bg: 'linear-gradient(180deg,#ede7f6 0%,#f3e5f5 100%)', leafColor: '#a5d6a7', label: '房', maxItems: 30 },
  { name: '紫陽花', bg: 'linear-gradient(180deg,#e3f2fd 0%,#e8eaf6 100%)', leafColor: '#388e3c', label: '房', maxItems: 28 },
  { name: '百日紅', bg: 'linear-gradient(180deg,#b3e5fc 0%,#f0fff0 100%)', leafColor: '#2e7d32', label: '輪', maxItems: 40 },
  { name: '桃', bg: 'linear-gradient(180deg,#b3e5fc 0%,#e1f5fe 100%)', leafColor: '#2e7d32', label: '個', maxItems: 25 },
  { name: '金木犀', bg: 'linear-gradient(180deg,#b3e5fc 0%,#e8f5e9 100%)', leafColor: '#2e7d32', label: '輪', maxItems: 50 },
  { name: '柿', bg: 'linear-gradient(180deg,#fff9c4 0%,#fff3e0 100%)', leafColor: '#f57c00', label: '個', maxItems: 25 },
  { name: '紅葉', bg: 'linear-gradient(180deg,#ffccbc 0%,#fff0e8 100%)', leafColor: 'transparent', label: '枚', maxItems: 50 },
  { name: '南天', bg: 'linear-gradient(180deg,#e3f2fd 0%,#f0f8ff 100%)', leafColor: '#2e7d32', label: '粒', maxItems: 35 },
];

function renderDecoration(month: number, cx: number, cy: number, i: number) {
  switch (month) {
    case 1: { // 梅
      const c = i % 2 === 0 ? '#ff4d88' : '#ff6ba0';
      return (
        <g key={i}>
          {[0,1,2,3,4].map(p => (
            <circle key={p} cx={cx + Math.cos(p*72*Math.PI/180)*4.5} cy={cy + Math.sin(p*72*Math.PI/180)*4.5} r="3.8" fill={c}/>
          ))}
          <circle cx={cx} cy={cy} r="2.2" fill="#ffeb3b"/>
        </g>
      );
    }
    case 2: { // 蝋梅
      const yc = i % 2 === 0 ? '#ffd700' : '#ffca28';
      return (
        <g key={i}>
          {[0,1,2,3,4,5].map(p => (
            <ellipse key={p} cx={cx+Math.cos(p*60*Math.PI/180)*4} cy={cy+Math.sin(p*60*Math.PI/180)*4}
              rx="3.5" ry="2.2" fill={yc}
              transform={`rotate(${p*60},${cx+Math.cos(p*60*Math.PI/180)*4},${cy+Math.sin(p*60*Math.PI/180)*4})`}/>
          ))}
          <circle cx={cx} cy={cy} r="2" fill="#fff176"/>
        </g>
      );
    }
    case 3: { // 桜
      const pc = i%3===0 ? '#ffb7c5' : i%3===1 ? '#ff8fab' : '#ffc8d3';
      return (
        <g key={i}>
          {[0,1,2,3,4].map(p => (
            <ellipse key={p} cx={cx+Math.cos(p*72*Math.PI/180)*4} cy={cy+Math.sin(p*72*Math.PI/180)*4}
              rx="3.2" ry="2.2" fill={pc}
              transform={`rotate(${p*72+36},${cx+Math.cos(p*72*Math.PI/180)*4},${cy+Math.sin(p*72*Math.PI/180)*4})`}/>
          ))}
          <circle cx={cx} cy={cy} r="1.5" fill="#fff5f7"/>
          <circle cx={cx} cy={cy} r="0.8" fill="#ffb7c5"/>
        </g>
      );
    }
    case 4: { // りんごの花
      return (
        <g key={i}>
          {[0,1,2,3,4].map(p => (
            <ellipse key={p} cx={cx+Math.cos(p*72*Math.PI/180)*4.5} cy={cy+Math.sin(p*72*Math.PI/180)*4.5}
              rx="3.5" ry="2.5" fill="white" stroke="#f8bbd0" strokeWidth="0.5"
              transform={`rotate(${p*72+36},${cx+Math.cos(p*72*Math.PI/180)*4.5},${cy+Math.sin(p*72*Math.PI/180)*4.5})`}/>
          ))}
          <circle cx={cx} cy={cy} r="2.2" fill="#a5d6a7"/>
        </g>
      );
    }
    case 5: { // 藤
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy-3} rx="5" ry="3" fill="#ce93d8"/>
          <ellipse cx={cx-2.5} cy={cy+1.5} rx="3.5" ry="2.5" fill="#ba68c8"/>
          <ellipse cx={cx+2.5} cy={cy+1.5} rx="3.5" ry="2.5" fill="#ab47bc"/>
          <ellipse cx={cx} cy={cy+6} rx="3" ry="2" fill="#9c27b0"/>
          <ellipse cx={cx} cy={cy+10} rx="2" ry="1.5" fill="#7b1fa2"/>
        </g>
      );
    }
    case 6: { // 紫陽花
      const bc = ['#64b5f6','#42a5f5','#90caf9','#1e88e5'];
      return (
        <g key={i}>
          {[[-4,-4],[4,-4],[-4,4],[4,4]].map(([dx,dy],p) => (
            <g key={p}>
              <circle cx={cx+dx} cy={cy+dy} r="4.5" fill={bc[p]}/>
              <circle cx={cx+dx} cy={cy+dy} r="1.5" fill="white" opacity="0.8"/>
            </g>
          ))}
        </g>
      );
    }
    case 7: { // 百日紅
      const rc = i%2===0 ? '#f06292' : '#ec407a';
      return (
        <g key={i}>
          {[0,1,2,3,4].map(p => {
            const a = p*72*Math.PI/180;
            return (
              <g key={p}>
                <circle cx={cx+Math.cos(a)*5} cy={cy+Math.sin(a)*5} r="3.8" fill={rc}/>
                <circle cx={cx+Math.cos(a+0.6)*3} cy={cy+Math.sin(a+0.6)*3} r="2" fill={rc}/>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="2.5" fill="#fff176"/>
        </g>
      );
    }
    case 8: { // 桃
      const col = i%3===0 ? '#ffb347' : i%3===1 ? '#ff8c69' : '#ffa07a';
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy+1} rx="7.5" ry="8" fill={col}/>
          <ellipse cx={cx} cy={cy-5.5} rx="2.2" ry="2.2" fill={col}/>
          <ellipse cx={cx-2.5} cy={cy-1} rx="2.5" ry="3.5" fill="rgba(255,255,255,0.3)"/>
          <path d={`M${cx} ${cy-7} Q${cx+3} ${cy-11} ${cx+4.5} ${cy-12}`} stroke="#6d4c41" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <ellipse cx={cx+4.5} cy={cy-11} rx="3" ry="1.5" fill="#66bb6a" transform={`rotate(-30,${cx+4.5},${cy-11})`}/>
        </g>
      );
    }
    case 9: { // 金木犀
      const oc = i%2===0 ? '#ff8f00' : '#ffa726';
      return (
        <g key={i}>
          {[0,1,2,3].map(p => (
            <ellipse key={p} cx={cx+Math.cos(p*90*Math.PI/180)*3.5} cy={cy+Math.sin(p*90*Math.PI/180)*3.5}
              rx="3" ry="1.8" fill={oc}
              transform={`rotate(${p*90},${cx+Math.cos(p*90*Math.PI/180)*3.5},${cy+Math.sin(p*90*Math.PI/180)*3.5})`}/>
          ))}
          <circle cx={cx} cy={cy} r="1.8" fill="#ffcc02"/>
        </g>
      );
    }
    case 10: { // 柿
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy+1} rx="7" ry="7.5" fill="#ff8c00"/>
          <ellipse cx={cx} cy={cy} rx="7" ry="6.5" fill="#ffa726"/>
          <ellipse cx={cx-2} cy={cy-2} rx="2" ry="2.5" fill="rgba(255,255,255,0.3)"/>
          {[0,1,2,3].map(p => (
            <ellipse key={p} cx={cx+Math.cos(p*90*Math.PI/180)*3.5} cy={cy-6.5+Math.sin(p*90*Math.PI/180)*1.5}
              rx="3.5" ry="1.5" fill="#4caf50"
              transform={`rotate(${p*90},${cx+Math.cos(p*90*Math.PI/180)*3.5},${cy-6.5+Math.sin(p*90*Math.PI/180)*1.5})`}/>
          ))}
          <path d={`M${cx} ${cy-8} L${cx} ${cy-11}`} stroke="#6d4c41" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      );
    }
    case 11: { // 紅葉
      const rc2 = i%3===0 ? '#e53935' : i%3===1 ? '#f57c00' : '#c62828';
      return (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <ellipse cx="0" cy="-6" rx="3.5" ry="6" fill={rc2}/>
          <ellipse cx="-5.5" cy="-2" rx="3" ry="5" fill={rc2} transform="rotate(-38,-5.5,-2)"/>
          <ellipse cx="-8.5" cy="2.5" rx="2.5" ry="4" fill={rc2} transform="rotate(-68,-8.5,2.5)"/>
          <ellipse cx="5.5" cy="-2" rx="3" ry="5" fill={rc2} transform="rotate(38,5.5,-2)"/>
          <ellipse cx="8.5" cy="2.5" rx="2.5" ry="4" fill={rc2} transform="rotate(68,8.5,2.5)"/>
          <path d="M0 5 L0 10" stroke="#795548" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      );
    }
    case 12: { // 南天
      return (
        <g key={i}>
          <circle cx={cx-3.5} cy={cy-3} r="4" fill="#e53935"/>
          <circle cx={cx+3.5} cy={cy-3} r="4" fill="#c62828"/>
          <circle cx={cx} cy={cy+3} r="4" fill="#ef5350"/>
          <circle cx={cx-4.2} cy={cy-4} r="1.2" fill="rgba(255,255,255,0.6)"/>
          <circle cx={cx+2.8} cy={cy-4} r="1.2" fill="rgba(255,255,255,0.6)"/>
          <circle cx={cx-0.8} cy={cy+2} r="1.2" fill="rgba(255,255,255,0.6)"/>
          <path d={`M${cx} ${cy-9} L${cx-3.5} ${cy-6} M${cx} ${cy-9} L${cx+3.5} ${cy-6} M${cx} ${cy-9} L${cx} ${cy-2}`} stroke="#4caf50" strokeWidth="1.2" fill="none"/>
        </g>
      );
    }
    default: return null;
  }
}

function SeasonalTree({ month, count }: { month: number; count: number }) {
  const cfg = MONTH_CONFIG[month - 1];
  const MAX = cfg.maxItems;
  const displayCount = Math.min(count, MAX);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    if (displayCount === 0) return;
    let n = 0;
    const iv = setInterval(() => {
      n++;
      setVisible(n);
      if (n >= displayCount) clearInterval(iv);
    }, 45);
    return () => clearInterval(iv);
  }, [displayCount, month]);

  const positions = useMemo(() =>
    Array.from({ length: MAX }, (_, i) => {
      const angle = (i / MAX) * Math.PI * 8 + i * 0.72;
      const r = 35 + (i % 6) * 11 + Math.sin(i * 1.5) * 10;
      const cx = 140 + Math.cos(angle) * r;
      const cy = 98 + Math.sin(angle) * r * 0.6 - i * 0.28;
      return { cx: Math.max(22, Math.min(258, cx)), cy: Math.max(14, Math.min(178, cy)) };
    }), [MAX]);

  const hasLeaves = cfg.leafColor !== 'transparent';
  const isSnow = month === 12;

  return (
    <svg viewBox="0 0 280 300" className="w-full" style={{ maxHeight: 380 }}>
      {/* 雪 (12月) */}
      {isSnow && [
        [40,20],[90,10],[160,18],[220,8],[250,25],[70,40],[190,35],[130,5],
      ].map(([sx,sy],k) => (
        <circle key={k} cx={sx} cy={sy} r={k%2===0?3:2} fill="white" opacity="0.8"/>
      ))}

      {/* 葉のキャノピー */}
      {hasLeaves && <>
        <ellipse cx="140" cy="98" rx="85" ry="58" fill={cfg.leafColor} opacity="0.55"/>
        <ellipse cx="82" cy="132" rx="40" ry="27" fill={cfg.leafColor} opacity="0.45"/>
        <ellipse cx="198" cy="124" rx="37" ry="25" fill={cfg.leafColor} opacity="0.45"/>
        <ellipse cx="140" cy="74" rx="48" ry="35" fill={cfg.leafColor} opacity="0.4"/>
      </>}

      {/* 幹 */}
      <ellipse cx="140" cy="295" rx="26" ry="7" fill="#c4a882" opacity="0.55"/>
      <path d="M133 295 Q130 268 128 244 Q125 220 128 200 Q130 183 133 170" stroke="#8B6347" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M147 295 Q150 268 152 244 Q155 220 152 200 Q150 183 147 170" stroke="#8B6347" strokeWidth="9" fill="none" strokeLinecap="round"/>

      {/* 枝 */}
      <path d="M133 182 Q108 165 80 150" stroke="#9B7050" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
      <path d="M147 174 Q172 158 200 146" stroke="#9B7050" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
      <path d="M138 178 Q133 150 129 126" stroke="#a07858" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M142 172 Q148 144 153 120" stroke="#a07858" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M106 166 Q94 148 88 132" stroke="#b08868" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M174 158 Q186 140 192 124" stroke="#b08868" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M130 132 Q127 118 125 106" stroke="#b08868" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M152 125 Q156 112 158 100" stroke="#b08868" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M140 174 Q138 145 137 118" stroke="#b08868" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* 花・実・葉 */}
      {positions.map((pos, i) => {
        const isVis = i < visible;
        return (
          <g key={i} style={{
            opacity: isVis ? 1 : 0,
            transform: isVis ? 'scale(1)' : 'scale(0)',
            transformOrigin: `${pos.cx}px ${pos.cy}px`,
            transition: `opacity 0.3s ease ${i*0.025}s, transform 0.3s ease ${i*0.025}s`,
          }}>
            {renderDecoration(month, pos.cx, pos.cy, i)}
          </g>
        );
      })}
    </svg>
  );
}

export default function StaffPage() {
  const { session, loading, logout } = useAuth();
  const router = useRouter();
  const [nav, setNav] = useState<NavItem>('home');
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [sentDate, setSentDate] = useState(getTodayString());
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [sentMessages, setSentMessages] = useState<ThanksWithNames[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<ThanksWithNames[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [treeData, setTreeData] = useState<Record<string, number>>({});
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
    if (!loading && session?.role === 'admin') router.push('/admin/dashboard');
  }, [session, loading, router]);

  const fetchTreeData = useCallback(async () => {
    try {
      const year = new Date().getFullYear();
      const res = await fetch(`/api/tree?year=${year}`);
      if (res.ok) {
        const { data } = await res.json();
        setTreeData(data || {});
      }
    } catch {}
  }, []);

  const fetchData = useCallback(async () => {
    const [staffRes, sentRes, receivedRes] = await Promise.all([
      fetch('/api/users'),
      fetch('/api/thanks?type=sent'),
      fetch('/api/thanks?type=received'),
    ]);
    if (staffRes.ok) setStaffList((await staffRes.json()).data || []);
    if (sentRes.ok) setSentMessages((await sentRes.json()).data || []);
    if (receivedRes.ok) setReceivedMessages((await receivedRes.json()).data || []);
    // 統計（管理者でなくても取れる簡易版）
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const { data } = await statsRes.json();
        setTotalCount(data?.total_count || 0);
      }
    } catch {}
  }, []);

  useEffect(() => { if (session) { fetchData(); fetchTreeData(); } }, [session, fetchData, fetchTreeData]);

  const handleSend = async () => {
    if (!receiverId) { toast.error('送り先を選択してください'); return; }
    if (!message.trim()) { toast.error('メッセージを入力してください'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/thanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: receiverId, message, sent_date: sentDate }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error); return; }
      setJustSent(true);
      setTimeout(() => setJustSent(false), 1500);
      toast.success('ありがとうを送りました！🌸');
      setReceiverId(''); setMessage(''); setSentDate(getTodayString());
      setTotalCount(c => c + 1);
      fetchData();
      fetchTreeData();
    } catch { toast.error('送信に失敗しました'); }
    finally { setSending(false); }
  };

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff5f8' }}>
      <div className="text-pink-300 animate-pulse text-sm">読み込み中...</div>
    </div>;
  }

  const navItems: { key: NavItem; icon: string; label: string }[] = [
    { key: 'home',     icon: '🏠', label: 'ホーム' },
    { key: 'send',     icon: '✈️', label: 'ありがとうを送る' },
    { key: 'received', icon: '💗', label: 'もらったありがとう' },
    { key: 'sent',     icon: '✈️', label: '送ったありがとう' },
    { key: 'tree',     icon: '🌳', label: '感謝の木' },
    { key: 'mypage',   icon: '👤', label: 'マイページ' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#fff5f8', fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sentPop { 0%{transform:scale(0.8) rotate(-5deg);opacity:0} 50%{transform:scale(1.2) rotate(3deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes petalDrift { 0%{transform:translateY(0) rotate(0) translateX(0);opacity:0.9} 100%{transform:translateY(50px) rotate(180deg) translateX(20px);opacity:0} }
        .float-anim{animation:floatUp 3s ease-in-out infinite}
        .float-slow{animation:floatUp 3.8s ease-in-out infinite 0.5s}
        .sent-pop{animation:sentPop 0.5s ease-out both}
        .fade-slide{animation:fadeSlideIn 0.35s ease-out both}
        .petal1{animation:petalDrift 2.5s ease-in infinite 0s}
        .petal2{animation:petalDrift 3s ease-in infinite 1s}
        .petal3{animation:petalDrift 2.8s ease-in infinite 0.5s}
        .nav-active{background:linear-gradient(135deg,#ffb7c5,#ff8fab);color:white !important}
        select,input,textarea{outline:none}
        select:focus,input:focus,textarea:focus{border-color:#ffb7c5 !important}
      `}</style>

      {/* ===== サイドバー (デスクトップ) ===== */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 bg-white border-r border-pink-100"
             style={{ boxShadow: '2px 0 12px rgba(255,182,193,0.12)' }}>
        <div className="px-4 pt-5 pb-3 border-b border-pink-50 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
               style={{ background: 'linear-gradient(135deg, #ff8fab, #ffb7c5)' }}>💗</div>
          <div>
            <p className="text-xs font-bold text-gray-700">ありがとう</p>
            <p className="text-[10px] text-pink-300">感謝のきもちを伝えよう</p>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setNav(item.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all
                               ${nav === item.key ? 'nav-active' : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        {/* 桜の木 */}
        <div className="border-t border-pink-50 relative overflow-hidden">
          {/* 舞う花びら */}
          {totalCount > 0 && <>
            <div className="absolute top-2 left-8 w-2 h-1.5 rounded-full bg-pink-200 petal1" style={{ transform: 'rotate(30deg)' }}/>
            <div className="absolute top-4 left-20 w-2 h-1.5 rounded-full bg-pink-300 petal2" style={{ transform: 'rotate(-20deg)' }}/>
            <div className="absolute top-1 right-10 w-2 h-1.5 rounded-full bg-pink-100 petal3" style={{ transform: 'rotate(45deg)' }}/>
          </>}
          <SakuraTree totalCount={totalCount} />
        </div>

        <div className="p-3 border-t border-pink-50">
          <p className="text-[10px] text-gray-300 mb-1">{session.name}さん</p>
          <button onClick={logout}
                  className="w-full text-xs text-gray-400 hover:text-pink-400 py-1.5 rounded-lg hover:bg-pink-50 transition-colors">
            ログアウト
          </button>
        </div>
      </aside>

      {/* ===== メインコンテンツ ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* デスクトップ ユーザーバー */}
        <div className="hidden md:flex items-center justify-end px-6 py-3 bg-white border-b border-pink-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BunnyChar className="w-7 h-7"/>
            <span className="font-medium">{session.name} さん</span>
            <span className="text-pink-200">▾</span>
          </div>
        </div>

        {/* モバイルヘッダー */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-pink-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>💗</span>
            <p className="text-sm font-bold text-gray-700">ありがとう</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BunnyChar className="w-6 h-6"/>
            {session.name}さん
            <button onClick={logout} className="text-gray-300 ml-1">ログアウト</button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">

          {/* ホーム */}
          {nav === 'home' && (
            <div className="max-w-2xl mx-auto space-y-4 fade-slide">
              {/* ウェルカム */}
              <div className="relative overflow-hidden rounded-2xl p-5"
                   style={{ background: 'linear-gradient(135deg, #ffecf1 0%, #fff8fa 60%, #f5f0ff 100%)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-pink-400 font-medium">こんにちは ✨</p>
                    <h1 className="text-lg font-bold text-gray-700 mt-0.5">{session.name}さん</h1>
                    <p className="text-xs text-gray-400 mt-1">今日も感謝の気持ちを伝えましょう！</p>
                    <button onClick={() => setNav('send')}
                            className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #ff8fab, #ff6b9d)' }}>
                      ✈️ ありがとうを送る
                    </button>
                  </div>
                  <div className="flex items-end gap-1 ml-2">
                    <BunnyChar className="w-16 h-16 float-anim"/>
                    <BearChar className="w-13 h-13 float-slow" style={{width:'52px',height:'52px'}}/>
                  </div>
                </div>
                {/* 吹き出し */}
                <div className="absolute top-3 right-4 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 text-[10px] text-pink-400 font-bold leading-snug shadow-sm"
                     style={{ transform: 'rotate(-2deg)' }}>
                  いつも<br/>ありがとう<br/>ございます！
                </div>
              </div>

              {/* 統計 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 12px rgba(255,143,171,0.12)' }}>
                  <p className="text-xs text-gray-400 mb-1">もらったありがとう</p>
                  <p className="text-2xl font-bold text-pink-500">💗 {receivedMessages.length}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">件</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 12px rgba(107,197,255,0.12)' }}>
                  <p className="text-xs text-gray-400 mb-1">送ったありがとう</p>
                  <p className="text-2xl font-bold text-blue-400">✈️ {sentMessages.length}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">件</p>
                </div>
              </div>

              {receivedMessages.slice(0, 3).length > 0 && (
                <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(255,143,171,0.1)' }}>
                  <h3 className="text-xs font-bold text-gray-500 mb-3">💗 最近もらったありがとう</h3>
                  <div className="space-y-2">
                    {receivedMessages.slice(0, 3).map(m => (
                      <div key={m.id} className="flex items-start gap-2 text-xs">
                        <span className="text-gray-300 shrink-0 w-12">{m.sent_date.substring(5).replace('-','/')}</span>
                        <span className="font-medium text-gray-600 shrink-0 w-16 truncate">{m.sender_name}さん</span>
                        <span className="text-gray-400 truncate">{m.message}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setNav('received')} className="text-xs text-pink-400 mt-2 hover:text-pink-600">
                    もっと見る →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ありがとうを送る */}
          {nav === 'send' && (
            <div className="max-w-lg mx-auto fade-slide">
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(255,143,171,0.13)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={justSent ? 'sent-pop text-2xl' : 'text-2xl'}>💗</span>
                  <h2 className="font-bold text-gray-700">ありがとうを送る</h2>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-400 block mb-1.5">日付</label>
                  <input type="date" value={sentDate} onChange={e => setSentDate(e.target.value)}
                         className="w-full px-4 py-3 rounded-xl text-sm text-gray-700 border-2 border-pink-100 bg-pink-50"/>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-400 block mb-1.5">ありがとうを送る人</label>
                  <select value={receiverId} onChange={e => setReceiverId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-gray-700 border-2 border-pink-100 bg-pink-50">
                    <option value="">選択してください</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}{s.departments?.name ? ` (${s.departments.name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-400 block mb-1.5">ありがとうメッセージ</label>
                  <div className="relative">
                    <textarea value={message} onChange={e => setMessage(e.target.value.slice(0,500))}
                              placeholder="ありがとうの気持ちを自由に書いてください♪"
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl text-sm text-gray-700 border-2 border-pink-100 bg-pink-50 resize-none"/>
                    <span className="absolute bottom-2 right-3 text-[10px] text-gray-300">{message.length}/500</span>
                  </div>
                </div>

                <button onClick={handleSend} disabled={sending}
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #ff8fab, #ff6b9d)', boxShadow: '0 4px 16px rgba(255,107,157,0.35)' }}>
                  {sending ? '送信中...' : '✈️ ありがとうを送る'}
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <BearChar className="w-20 h-20 float-slow"/>
              </div>
            </div>
          )}

          {/* もらったありがとう */}
          {nav === 'received' && (
            <div className="max-w-lg mx-auto space-y-3 fade-slide">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-gray-700">もらったありがとう</h2>
                <span className="text-xs bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full font-semibold">{receivedMessages.length}件</span>
              </div>
              {receivedMessages.length === 0
                ? <div className="text-center py-12 text-gray-300"><div className="text-4xl mb-3">💗</div><p className="text-sm">まだもらったメッセージはありません</p></div>
                : receivedMessages.map((m,i) => (
                  <div key={m.id} className="bg-white rounded-2xl p-4 fade-slide" style={{ boxShadow:'0 2px 12px rgba(255,143,171,0.1)', animationDelay: `${i*0.05}s` }}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-pink-500">{m.sender_name}</span>さんから
                      </p>
                      <span className="text-[10px] text-gray-300">{formatDate(m.sent_date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed bg-pink-50 rounded-xl px-3 py-2.5">{m.message}</p>
                  </div>
                ))}
            </div>
          )}

          {/* 送ったありがとう */}
          {nav === 'sent' && (
            <div className="max-w-lg mx-auto space-y-3 fade-slide">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-gray-700">送ったありがとう</h2>
                <span className="text-xs bg-blue-100 text-blue-400 px-2 py-0.5 rounded-full font-semibold">{sentMessages.length}件</span>
              </div>
              {sentMessages.length === 0
                ? <div className="text-center py-12 text-gray-300"><div className="text-4xl mb-3">✈️</div><p className="text-sm">まだ送信したメッセージはありません</p></div>
                : sentMessages.map((m,i) => (
                  <div key={m.id} className="bg-white rounded-2xl p-4 fade-slide" style={{ boxShadow:'0 2px 12px rgba(107,197,255,0.1)', animationDelay:`${i*0.05}s` }}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs text-gray-400">
                        → <span className="font-semibold text-blue-400">{m.receiver_name}</span>さんへ
                      </p>
                      <span className="text-[10px] text-gray-300">{formatDate(m.sent_date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-xl px-3 py-2.5">{m.message}</p>
                  </div>
                ))}
            </div>
          )}

          {/* 感謝の木 */}
          {nav === 'tree' && (() => {
            const mm = String(selectedMonth).padStart(2, '0');
            const count = treeData[mm] || 0;
            const cfg = MONTH_CONFIG[selectedMonth - 1];
            const year = new Date().getFullYear();
            return (
              <div className="max-w-lg mx-auto fade-slide">
                {/* タイトル */}
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-gray-700">みんなの感謝の木 🌳</h2>
                  <p className="text-xs text-gray-400 mt-0.5">ありがとうの数だけ花や実がなります</p>
                </div>

                {/* 月セレクター */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <button key={m} onClick={() => setSelectedMonth(m)}
                            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all active:scale-95
                              ${m === selectedMonth
                                ? 'text-white shadow-md'
                                : 'bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-500 shadow-sm'}`}
                            style={m === selectedMonth ? { background: 'linear-gradient(135deg,#ff8fab,#ff6b9d)' } : {}}>
                      {m}月
                    </button>
                  ))}
                </div>

                {/* 木カード */}
                <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background: cfg.bg }}>
                  {/* カードヘッダー */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{year}年 {selectedMonth}月</p>
                      <p className="text-xl font-bold text-gray-700">{cfg.name}の木</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">ありがとう</p>
                      <p className="text-3xl font-black" style={{ color: '#ff6b9d', lineHeight: 1 }}>{count}</p>
                      <p className="text-xs text-gray-400">{cfg.label}</p>
                    </div>
                  </div>

                  {/* 木SVG */}
                  <div className="px-4 pb-4">
                    <SeasonalTree month={selectedMonth} count={count} />
                  </div>

                  {/* フッター */}
                  <div className="px-5 pb-4 text-center">
                    {count === 0
                      ? <p className="text-xs text-gray-400">まだ「ありがとう」がありません。最初の一言を送ってみましょう！🌱</p>
                      : count < 5
                      ? <p className="text-xs text-gray-400">芽吹いてきました！もっと感謝を送り合いましょう 🌿</p>
                      : count < 20
                      ? <p className="text-xs text-gray-400">ぐんぐん育っています！素敵なチームですね 🌸</p>
                      : <p className="text-xs text-gray-400">満開です！みなさんの感謝があふれています ✨</p>
                    }
                  </div>
                </div>

                {/* 全月サマリー */}
                <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-3">📅 {year}年 月別ありがとう件数</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                      const key = String(m).padStart(2, '0');
                      const c = treeData[key] || 0;
                      const maxC = Math.max(...Object.values(treeData || {}), 1);
                      const h = Math.round((c / maxC) * 36) + 4;
                      return (
                        <button key={m} onClick={() => setSelectedMonth(m)}
                                className="flex flex-col items-center gap-0.5">
                          <div className="w-full flex items-end justify-center" style={{ height: 40 }}>
                            <div className="w-full rounded-t-sm transition-all"
                                 style={{ height: h, background: m === selectedMonth ? 'linear-gradient(180deg,#ff8fab,#ff6b9d)' : 'linear-gradient(180deg,#ffd6e0,#ffb7c5)', minHeight: 4 }}/>
                          </div>
                          <span className="text-[9px] text-gray-400">{m}月</span>
                          <span className="text-[9px] font-bold text-gray-500">{c}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* マイページ */}
          {nav === 'mypage' && (
            <div className="max-w-2xl mx-auto fade-slide">
              <h2 className="font-bold text-gray-700 mb-4">マイページ</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button onClick={() => setNav('received')}
                        className="bg-white rounded-2xl p-4 text-center hover:bg-pink-50 transition-colors"
                        style={{ boxShadow:'0 2px 12px rgba(255,143,171,0.12)' }}>
                  <p className="text-xs text-gray-400 mb-1">もらったありがとう</p>
                  <p className="text-3xl font-bold text-pink-500">💗 {receivedMessages.length}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">件</p>
                </button>
                <button onClick={() => setNav('sent')}
                        className="bg-white rounded-2xl p-4 text-center hover:bg-blue-50 transition-colors"
                        style={{ boxShadow:'0 2px 12px rgba(107,197,255,0.1)' }}>
                  <p className="text-xs text-gray-400 mb-1">送ったありがとう</p>
                  <p className="text-3xl font-bold text-blue-400">✈️ {sentMessages.length}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">件</p>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 text-center mb-4" style={{ boxShadow:'0 2px 12px rgba(255,143,171,0.12)' }}>
                <div className="flex justify-center gap-4">
                  <BunnyChar className="w-16 h-16 float-anim"/>
                  <BearChar className="w-14 h-14 float-slow" style={{width:'56px',height:'56px'}}/>
                </div>
                <p className="text-sm font-bold text-pink-400 mt-2">感謝のきもちでつながろう♪</p>
                <p className="text-xs text-gray-400 mt-1">あなたの「ありがとう」が職場を明るくします</p>
              </div>

              <div className="bg-white rounded-2xl p-4" style={{ boxShadow:'0 2px 12px rgba(255,143,171,0.1)' }}>
                <div className="flex gap-4 border-b border-pink-50 pb-2 mb-3">
                  <span className="text-xs font-bold text-pink-500 border-b-2 border-pink-400 pb-1">もらったありがとう一覧</span>
                  <button onClick={() => setNav('sent')} className="text-xs text-gray-400 hover:text-blue-400 transition-colors pb-1">送ったありがとう一覧</button>
                </div>
                {receivedMessages.length === 0
                  ? <p className="text-xs text-gray-300 text-center py-4">まだありません</p>
                  : <>
                    <div className="grid grid-cols-[64px_72px_1fr] gap-x-2 text-[10px] text-gray-300 font-semibold mb-1">
                      <span>日付</span><span>送ってくれた人</span><span>メッセージ</span>
                    </div>
                    {receivedMessages.slice(0,5).map(m => (
                      <div key={m.id} className="grid grid-cols-[64px_72px_1fr] gap-x-2 text-xs py-1.5 border-b border-pink-50 last:border-0">
                        <span className="text-gray-300">{m.sent_date.substring(5).replace('-','/')}</span>
                        <span className="text-gray-600 font-medium truncate">{m.sender_name}さん</span>
                        <span className="text-gray-400 truncate">{m.message}</span>
                      </div>
                    ))}
                    {receivedMessages.length > 5 && (
                      <button onClick={() => setNav('received')} className="text-xs text-pink-400 mt-2 hover:text-pink-600">もっと見る →</button>
                    )}
                  </>
                }
              </div>
            </div>
          )}
        </main>

        {/* モバイルボトムナビ */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 flex"
             style={{ boxShadow: '0 -2px 12px rgba(255,182,193,0.15)' }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setNav(item.key)}
                    className={`flex-1 flex flex-col items-center py-2 text-[10px] font-medium transition-colors
                               ${nav === item.key ? 'text-pink-500' : 'text-gray-400'}`}>
              <span className="text-base">{item.icon}</span>
              <span className="mt-0.5 leading-tight">{item.label.replace('ありがとう','').replace('もらった','受信').replace('送った','送信')}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
