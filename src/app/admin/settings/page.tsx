'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Department {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDept, setNewDept] = useState('');
  const [deptLoading, setDeptLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/departments')
      .then(r => r.json())
      .then(({ data }) => setDepartments(data || []));
  }, []);

  const addDept = async () => {
    if (!newDept.trim()) return;
    setDeptLoading(true);
    const res = await fetch('/api/admin/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newDept.trim() }),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error); }
    else {
      setDepartments(d => [...d, json.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewDept('');
      toast.success('部署を追加しました');
    }
    setDeptLoading(false);
  };

  const deleteDept = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    const res = await fetch(`/api/admin/departments/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error); }
    else {
      setDepartments(d => d.filter(dep => dep.id !== id));
      toast.success('部署を削除しました');
    }
  };

  const handlePwChange = async () => {
    if (!pwForm.current) { toast.error('現在のパスワードを入力してください'); return; }
    if (!pwForm.next || pwForm.next.length < 4) { toast.error('新しいパスワードは4文字以上で入力してください'); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error('パスワードが一致しません'); return; }
    setPwSaving(true);
    const res = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error); }
    else {
      toast.success('パスワードを変更しました');
      setPwForm({ current: '', next: '', confirm: '' });
    }
    setPwSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">⚙️ 設定</h1>
        <p className="text-sm text-gray-400 mt-0.5">管理者パスワードと部署の管理</p>
      </div>

      {/* パスワード変更 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-700">🔑 管理者パスワード変更</h2>
        </div>
        <div className="p-5 space-y-3">
          {(['current', 'next', 'confirm'] as const).map((key) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">
                {key === 'current' ? '現在のパスワード' : key === 'next' ? '新しいパスワード' : '新しいパスワード（確認）'}
              </label>
              <input
                type="password"
                value={pwForm[key]}
                onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                           focus:outline-none focus:border-green-300 transition-colors"
              />
            </div>
          ))}
          <button
            onClick={handlePwChange}
            disabled={pwSaving}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7cc377, #5aad55)' }}
          >
            {pwSaving ? '変更中...' : 'パスワードを変更する'}
          </button>
        </div>
      </div>

      {/* 部署管理 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-700">🏥 部署管理</h2>
        </div>
        <div className="p-5 space-y-4">
          {/* 追加フォーム */}
          <div className="flex gap-2">
            <input
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDept()}
              placeholder="新しい部署名"
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                         focus:outline-none focus:border-green-300 transition-colors"
            />
            <button
              onClick={addDept}
              disabled={deptLoading || !newDept.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7cc377, #5aad55)' }}
            >
              追加
            </button>
          </div>

          {/* 部署一覧 */}
          {departments.length === 0 ? (
            <p className="text-xs text-gray-300 text-center py-4">部署が登録されていません</p>
          ) : (
            <div className="space-y-2">
              {departments.map(dept => (
                <div key={dept.id}
                     className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-700">{dept.name}</span>
                  <button
                    onClick={() => deleteDept(dept.id, dept.name)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
