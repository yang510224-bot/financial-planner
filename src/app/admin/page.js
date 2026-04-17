"use client";

import { useEffect, useState } from 'react';

// Helper component for styled text
const InfoRow = ({ label, value, unit = "萬", highlight = false, color = "inherit" }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #eee' }}>
    <span style={{ color: '#666' }}>{label}</span>
    <span style={{ fontWeight: highlight ? 'bold' : 'normal', color }}>
      {value ? `${parseFloat(value).toFixed(2)} ${unit}` : `-`}
    </span>
  </div>
);

export default function AdminPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetch('/api/records')
      .then(res => res.json())
      .then(data => {
        if (data.records) setRecords(data.records);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch records", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style>{`
        .admin-page { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7f9fc; min-height: 100vh;}
        .admin-layout { display: flex; gap: 24px; align-items: flex-start; flex-direction: column; }
        .admin-table-container { 
          width: 100%; background: #fff; border-radius: 12px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 16px; overflow-x: auto; 
        }
        .admin-detail-panel { 
          width: 100%; background: #fff; border-radius: 12px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px;
        }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th, td { padding: 14px 12px; border-bottom: 1px solid #eaeaea; white-space: nowrap; font-size: 14px; }
        th { background: #f8fafc; color: #334155; font-weight: 600; }
        tr:hover { background-color: #f1f5f9; }
        
        .section-box {
          background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }
        .section-title {
          font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        
        @media (min-width: 900px) {
          .admin-page { padding: 40px 20px; }
          .admin-layout { flex-direction: row; }
          .admin-table-container { flex: 1; }
          .admin-detail-panel { flex: 0 0 420px; position: sticky; top: 20px; }
        }
      `}</style>
      
      <div className="admin-page">
        <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#1e293b' }}>👑 後台管理系統 - 客戶財富名單</h1>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>載入中...</p>
        ) : records.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>目前尚無任何資料。</p>
        ) : (
          <div className="admin-layout">
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>填寫時間</th>
                    <th>姓名</th>
                    <th>淨資產</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={i} style={{ backgroundColor: selectedRecord?.id === r.id ? '#e0f2fe' : 'transparent' }}>
                      <td style={{ color: '#64748b' }}>{new Date(r.timestamp).toLocaleDateString()} {new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td style={{ fontWeight: '500' }}>{r.name || '未填寫'}</td>
                      <td style={{ fontWeight: 'bold', color: r.reportSummary?.netAsset >= 0 ? '#16a34a' : '#dc2626' }}>
                        {parseFloat(r.reportSummary?.netAsset || 0).toFixed(2)} 萬
                      </td>
                      <td>
                        <button 
                          onClick={() => {
                            setSelectedRecord(r);
                            setTimeout(() => {
                              document.getElementById('detail-panel')?.scrollIntoView({ behavior: 'smooth' });
                            }, 50);
                          }}
                          style={{ padding: '8px 16px', cursor: 'pointer', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', transition: 'all 0.2s' }}
                        >
                          檢視詳情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedRecord && (
              <div id="detail-panel" className="admin-detail-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>客戶詳細財報</h2>
                  <button onClick={() => setSelectedRecord(null)} style={{ cursor: 'pointer', background: '#f1f5f9', border: 'none', fontSize: '18px', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems:'center', justifyContent:'center', color: '#64748b' }}>✖</button>
                </div>
                
                <div style={{ maxHeight: '65vh', overflowY: 'auto', fontSize: '14px', lineHeight: '1.6', paddingRight: '8px' }}>
                  
                  {/* 基本資料 */}
                  <div className="section-box" style={{ background: '#fefce8', borderColor: '#fef08a' }}>
                    <h3 className="section-title">👤 基本資料</h3>
                    <InfoRow label="姓名" value={selectedRecord.name || '未填寫'} unit="" />
                    <InfoRow label="生日" value={selectedRecord.birthDate || '無'} unit="" />
                    <InfoRow label="性別" value={selectedRecord.gender || '無'} unit="" />
                    <InfoRow 
                      label="★ 總淨資產" 
                      value={selectedRecord.reportSummary?.netAsset} 
                      highlight={true} 
                      color={selectedRecord.reportSummary?.netAsset >= 0 ? '#16a34a' : '#dc2626'} 
                    />
                    <InfoRow 
                      label="★ 月淨現金流" 
                      value={selectedRecord.reportSummary?.netCashFlow} 
                      highlight={true} 
                      color={selectedRecord.reportSummary?.netCashFlow >= 0 ? '#16a34a' : '#dc2626'} 
                    />
                  </div>

                  {/* 資產明細 */}
                  {selectedRecord.assets && (
                  <div className="section-box">
                    <h3 className="section-title" style={{ color: '#0369a1' }}>💰 資產清單</h3>
                    <InfoRow label="活存現金" value={selectedRecord.assets.cash} />
                    <InfoRow label="儲蓄存款" value={selectedRecord.assets.savings?.amount} />
                    {selectedRecord.assets.properties?.map((p, i) => (
                      <InfoRow key={i} label={`房產: ${p.name || `項目${i+1}`}`} value={p.value} />
                    ))}
                    {selectedRecord.assets.vehicles?.map((v, i) => (
                      <InfoRow key={i} label={`車輛: ${v.name || `項目${i+1}`}`} value={v.value} />
                    ))}
                    {selectedRecord.assets.insurance?.hasInsurance && <InfoRow label="保單現值" value={selectedRecord.assets.insurance.amount} />}
                    {selectedRecord.assets.investments?.hasInvestments && <InfoRow label="投資部位" value={selectedRecord.assets.investments.amount} />}
                    {selectedRecord.assets.otherAssets?.hasOtherAssets && <InfoRow label={`其他 (${selectedRecord.assets.otherAssets.description || '未命名'})`} value={selectedRecord.assets.otherAssets.amount} />}
                  </div>
                  )}
                  
                  {/* 負債明細 */}
                  {selectedRecord.liabilities && (
                  <div className="section-box">
                    <h3 className="section-title" style={{ color: '#be123c' }}>📉 負債清單</h3>
                    {selectedRecord.assets?.properties?.map((p, i) => {
                       if(!p.hasLoan || !p.loans) return null;
                       const loanSum = p.loans.reduce((acc, curr) => acc + parseFloat(curr.amount||0), 0);
                       return <InfoRow key={i} label={`房貸: ${p.name || `項目${i+1}`}`} value={loanSum} />;
                    })}
                    {selectedRecord.assets?.vehicles?.map((v, i) => {
                       if(!v.hasLoan || !v.loan) return null;
                       return <InfoRow key={i} label={`車貸: ${v.name || `項目${i+1}`}`} value={v.loan.amount} />;
                    })}
                    {selectedRecord.liabilities.personalLoans?.map((L, i) => (
                      <InfoRow key={i} label={`信貸 ${i+1}`} value={L.amount} />
                    ))}
                    {selectedRecord.liabilities.creditCards?.map((C, i) => (
                      <InfoRow key={i} label={`信用卡債 ${i+1}`} value={C.amount} />
                    ))}
                    {selectedRecord.liabilities.other?.map((O, i) => (
                      <InfoRow key={i} label={`其他負債 ${i+1}`} value={O.amount} />
                    ))}
                  </div>
                  )}

                  {/* 收支明細 */}
                  <div className="section-box" style={{ marginBottom: 0 }}>
                    <h3 className="section-title" style={{ color: '#047857' }}>⚖️ 收支明細 (月)</h3>
                    {selectedRecord.income && (
                      <>
                        <InfoRow label="主動收入" value={selectedRecord.income.active} />
                        <InfoRow label="被動收入" value={selectedRecord.income.passive} />
                      </>
                    )}
                    {selectedRecord.expenses && (
                      <InfoRow label="生活支出" value={selectedRecord.expenses.living} />
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
