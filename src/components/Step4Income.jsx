"use client";

export default function Step4Income({ data, updateData }) {
  return (
    <div className="fade-in">
      <h2>月收入</h2>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        請填寫您每月固定的收入來源。
        <br />
        ⚠️ 系統不會自動幫您計算理財產品的現金流，請自行評估並填寫被動收入。
      </p>

      <div className="form-group" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>4.1 主動收入</h3>
        <p className="text-aux" style={{ fontSize: '13px', marginBottom: '12px' }}>💡 提示：先填寫這一欄</p>
        
        <label className="form-label" style={{ fontWeight: 'normal' }}>薪水 / 業務佣金 / 其他主動收入 (每月固定)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px' }}>
          <input 
            type="number" 
            className="form-input" 
            placeholder="0" 
            value={data.active}
            onChange={(e) => updateData('active', e.target.value)}
          />
          <span>萬元</span>
        </div>
      </div>

      <div className="form-group" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>4.2 被動收入</h3>
        <p className="text-aux" style={{ fontSize: '13px', marginBottom: '12px' }}>💡 提示：再填寫這一欄</p>
        
        <label className="form-label" style={{ fontWeight: 'normal' }}>配息收入 / 租金收入等被動收入 (每月固定)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px' }}>
          <input 
            type="number" 
            className="form-input" 
            placeholder="0" 
            value={data.passive}
            onChange={(e) => updateData('passive', e.target.value)}
          />
          <span>萬元</span>
        </div>
      </div>
      
    </div>
  );
}
