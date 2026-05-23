'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserStats } from '@/types';

export default function StaffManagePage() {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<UserStats | null>(null);

  // フォーム状態
  const [form, setForm] = useState({ login_id: '', name: '', password: '', role: 'staff', department_id: '' });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const { data } = await res.json();
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => {
    setEditUser(null);
    setForm({ login_id: '', name: '', password: '', role: 'staff', department_id: '' });
    setShowModal(true);
  };

  const openEdit = (user: UserStats) => {
    setEditUser(user);
    setForm({ login_id: user.login_id, name: user.name, password: '', role: user.role, department_id: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('氏名は必須です'); return; }
    if (!editUser && (!form.login_id || !form.password)) { toast.error('ID・パスワードは必須です'); return; }
    setSaving(true);

    try {
      let res;
      if (editUser) {
        const body: Record<string, string> = { name: form.name, role: form.role };
        if (form.password) body.password = form.password;
        res = await fetch(`/api/admin/users/${editUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      const json = await res.json();
      if (!res.ok) { toast.error(json.error); return; }
      toast.success(editUser ? '更新しました' : 'スタッフを追加しました');
      setShowModal(false);
      fetchUsers();
    } catch {
      toast.error('エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (user: UserStats) => {
    if (!confirm(`「${user.name}」さんを無効にしますか？`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('無効にしました'); fetchUsers(); }
    else toast.error('エラーが発生しました');
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">スタッフ一覧</h1>
          <p className="text-sm text-gray-400">{users.length}名登録</p>
        </div>
        <button onClick={openAdd}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #e85d6a, #ff8c69)' }}>
          + スタッフ追加
        </button>
      </div>

      {loading
        ? <div className="text-center py-12 text-gray-400 animate-pulse">読み込み中...</div>
        : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs">
                    <th className="text-left px-4 py-3 font-semibold">氏名</th>
                    <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">ログインID</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">部署</th>
                    <th className="text-center px-3 py-3 font-semibold">送信</th>
                    <th className="text-center px-3 py-3 font-semibold">受信</th>
                    <th className="text-center px-3 py-3 font-semibold">権限</th>
                    <th className="text-center px-3 py-3 font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-gray-50 hover:bg-rose-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-700">{user.name}</td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{user.login_id}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{user.department_name || '—'}</td>
                      <td className="px-3 py-3 text-center font-semibold text-rose-500">{user.send_count}</td>
                      <td className="px-3 py-3 text-center font-semibold text-orange-400">{user.receive_count}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                          {user.role === 'admin' ? '管理者' : 'スタッフ'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(user)}
                                  className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                            編集
                          </button>
                          <button onClick={() => handleDeactivate(user)}
                                  className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                            無効
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up">
            <h2 className="font-bold text-gray-800 mb-4">{editUser ? 'スタッフ編集' : 'スタッフ追加'}</h2>
            <div className="space-y-3">
              {!editUser && (
                <InputField label="ログインID" value={form.login_id}
                            onChange={v => setForm(f => ({ ...f, login_id: v }))} placeholder="例: ueda001" />
              )}
              <InputField label="氏名" value={form.name}
                          onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="例: 上田 花子" />
              <InputField label={editUser ? 'パスワード（変更する場合のみ）' : 'パスワード'}
                          value={form.password} type="password"
                          onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="8文字以上推奨" />
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">権限</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-rose-300">
                  <option value="staff">スタッフ</option>
                  <option value="admin">管理者</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">
                キャンセル
              </button>
              <button onClick={handleSave} disabled={saving}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all active:scale-95 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #e85d6a, #ff8c69)' }}>
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
             className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                        focus:outline-none focus:border-rose-300 transition-colors" />
    </div>
  );
}
