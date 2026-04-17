"use client";

import { useMemo } from 'react';

export default function Step1BasicInfo({ data, updateData }) {
  
  const age = useMemo(() => {
    if (!data.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(data.birthDate);
    let a = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      a--;
    }
    return a;
  }, [data.birthDate]);

  return (
    <div className="fade-in">
      <h2>基本資訊</h2>
      <p className="text-aux" style={{ marginBottom: '24px' }}>讓我們從認識您開始，這會幫助我們打造專屬的財務報告。</p>

      <div className="form-group">
        <label className="form-label">名字</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="請輸入您的名字或稱呼" 
          value={data.name}
          onChange={(e) => updateData(null, 'name', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">生日</label>
        <div className="flex gap-2 align-center">
          <input 
            type="date" 
            className="form-input" 
            value={data.birthDate}
            onChange={(e) => updateData(null, 'birthDate', e.target.value)}
            style={{ flex: 1 }}
          />
          {age !== null && (
            <span style={{ whiteSpace: 'nowrap', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
              {age} 歲
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">性別</label>
        <div className="flex gap-4">
          {['男', '女', '其他'].map(g => (
            <label key={g} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="radio" 
                name="gender" 
                value={g} 
                checked={data.gender === g}
                onChange={(e) => updateData(null, 'gender', e.target.value)}
              />
              {g}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
