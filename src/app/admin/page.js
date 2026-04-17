"use client";

import { useEffect, useState } from 'react';

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
        .admin-page { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
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
        th, td { padding: 12px; border-bottom: 1px solid #eaeaea; white-space: nowrap; }
        @media (min-width: 900px) {
          .admin-page { padding: 40px 20px; }
          .admin-layout { flex-direction: row; }
          .admin-table-container { flex: 1; }
          .admin-detail-panel { flex: 0 0 400px; position: sticky; top: 20px; }
        }
        /* 若在手機上，點擊「檢視」會自動往下捲動到詳細資料區塊 */
      `}</style>
      
      <div className="admin-page">
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>後台管理系統 - 財務健檢名單</h1>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>載入中...</p>
        ) : records.length === 0 ? (
          <p style={{ textAlign: 'center' }}>目前尚無任何資料。</p>
        ) : (
          <div className="admin-layout">
            {/* 名單列表 */}
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eaeaea' }}>
                    <th>填寫時間</th>
                    <th>姓名</th>
                    <th>淨資產</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={i} style={{ backgroundColor: selectedRecord?.id === r.id ? '#f1f8ff' : 'transparent' }}>
                      <td>{new Date(r.timestamp).toLocaleDateString()} {new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td>{r.name || '未填寫'}</td>
                      <td style={{ color: r.reportSummary?.netAsset >= 0 ? '#2e7d32' : '#c62828' }}>
                        {parseFloat(r.reportSummary?.netAsset || 0).toFixed(2)} 萬
                      </td>
                      <td>
                        <button 
                          onClick={() => {
                            setSelectedRecord(r);
                            // Scroll to detail on mobile
                            setTimeout(() => {
                              document.getElementById('detail-panel')?.scrollIntoView({ behavior: 'smooth' });
                            }, 50);
                          }}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                          檢視詳情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 詳細資料 */}
            {selectedRecord && (
              <div id="detail-panel" className="admin-detail-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ margin: 0 }}>詳細資料</h2>
                  <button onClick={() => setSelectedRecord(null)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px' }}>✖</button>
                </div>
                
                <div style={{ maxHeight: '600px', overflowY: 'auto', fontSize: '14px', lineHeight: '1.6' }}>
                  <p><strong>姓名：</strong> {selectedRecord.name || '未填寫'}</p>
                  <p><strong>生日：</strong> {selectedRecord.birthDate || '無'}</p>
                  <p><strong>性別：</strong> {selectedRecord.gender || '無'}</p>
                  <p>
                    <strong>月淨現金流：</strong> 
                    <span style={{ color: selectedRecord.reportSummary?.netCashFlow >= 0 ? '#2e7d32' : '#c62828' }}>
                      {parseFloat(selectedRecord.reportSummary?.netCashFlow || 0).toFixed(2)} 萬
                    </span>
                  </p>
                  <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
                  
                  <h3 style={{ fontSize: '16px', color: '#2c3e50', marginBottom: '8px' }}>資產 (Assets)</h3>
                  <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                    {JSON.stringify(selectedRecord.assets, null, 2)}
                  </pre>
                  
                  <h3 style={{ fontSize: '16px', color: '#2c3e50', marginTop: '16px', marginBottom: '8px' }}>負債 (Liabilities)</h3>
                  <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                    {JSON.stringify(selectedRecord.liabilities, null, 2)}
                  </pre>

                  <h3 style={{ fontSize: '16px', color: '#2c3e50', marginTop: '16px', marginBottom: '8px' }}>收支 (Income/Expenses)</h3>
                  <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                    {JSON.stringify({ income: selectedRecord.income, expenses: selectedRecord.expenses }, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
