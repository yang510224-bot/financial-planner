"use client";

import { useMemo } from 'react';
import { calculatePMT, calculateInterestOnly } from '../utils/calculations';
import { generateFinancialReport } from '../utils/reportGenerator';

export default function Dashboard({ data, startSimulation }) {
  
  const report = useMemo(() => generateFinancialReport(data), [data]);

  const dateObj = new Date();
  const yearMonth = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月`;

  return (
    <div className="fade-in" style={{ padding: '0 10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>📊 現況儀表板</h2>
      <p className="text-aux" style={{ textAlign: 'center', marginBottom: '32px' }}>
        📅 你的現在狀態 ({yearMonth})
      </p>

      {/* Asset and Liability Cards */}
      <div className="flex gap-4" style={{ flexWrap: 'wrap', marginBottom: '24px' }}>
        
        {/* Asset */}
        <div style={{ flex: '1 1 45%', background: '#E8F5E9', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--success-color)', borderBottom: '1px solid currentColor', paddingBottom: '8px' }}>
            【資產面】總額: {report.assetTotal.toFixed(2)} 萬
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>├─ 現金/活存: {report.cashStr.toFixed(2)} 萬</li>
            <li>├─ 定期存款: {report.savingsStr.toFixed(2)} 萬</li>
            {data.assets.properties.map((p, idx) => (
              <li key={idx}>├─ {p.name || '房產'}: {parseFloat(p.value||0).toFixed(2)} 萬</li>
            ))}
            {data.assets.vehicles.map((v, idx) => (
              <li key={idx}>├─ {v.name || '車子'}: {parseFloat(v.value||0).toFixed(2)} 萬</li>
            ))}
            {data.assets.insurance?.hasInsurance && <li>├─ 保單現值: {parseFloat(data.assets.insurance.amount || 0).toFixed(2)} 萬</li>}
            {data.assets.investments?.hasInvestments && <li>├─ 投資部位: {parseFloat(data.assets.investments.amount || 0).toFixed(2)} 萬</li>}
            {data.assets.otherAssets?.hasOtherAssets && <li>├─ 其他資產: {parseFloat(data.assets.otherAssets.amount || 0).toFixed(2)} 萬 {data.assets.otherAssets.description ? `(${data.assets.otherAssets.description})` : ''}</li>}
          </ul>
        </div>

        {/* Liability */}
        <div style={{ flex: '1 1 45%', background: '#FFEBEE', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--danger-color)', borderBottom: '1px solid currentColor', paddingBottom: '8px' }}>
            【負債面】總額: {report.liabilityTotal.toFixed(2)} 萬
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.assets.properties.map((p, idx) => {
               if(!p.hasLoan || !p.loans) return null;
               const loanSum = p.loans.reduce((acc, curr) => acc + parseFloat(curr.amount||0), 0);
               return <li key={idx}>├─ 房貸({p.name}): {loanSum.toFixed(2)} 萬</li>;
            })}
            {data.assets.vehicles.map((v, idx) => {
               if(!v.hasLoan || !v.loan) return null;
               return <li key={idx}>├─ 車貸({v.name}): {parseFloat(v.loan.amount||0).toFixed(2)} 萬</li>;
            })}

            <li>├─ 信貸: {data.liabilities.personalLoans.reduce((acc, curr) => acc + parseFloat(curr.amount||0), 0).toFixed(2)} 萬</li>
            <li>├─ 信用卡: {report.creditCardDebtStr.toFixed(2)} 萬</li>
            <li>├─ 其他: {data.liabilities.other.reduce((acc, curr) => acc + parseFloat(curr.amount||0), 0).toFixed(2)} 萬</li>
          </ul>
        </div>

      </div>

      {/* Net Worth */}
      <div style={{ background: 'var(--primary-color)', color: 'var(--white)', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: 'var(--white)' }}>【淨資產】</h3>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
          {report.netAsset.toFixed(2)} 萬
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '2px dashed var(--border-color)', margin: '40px 0' }} />

      {/* Cash Flow Section */}
      <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)', marginBottom: '24px' }}>【月現金流】</h2>
      
      <div className="flex gap-4" style={{ flexWrap: 'wrap', marginBottom: '32px' }}>
        <div style={{ flex: '1 1 45%', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--white)' }}>
          <h3 style={{ color: 'var(--success-color)' }}>💰 月收入</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>├─ 主動收入: {parseFloat(data.income.active || 0).toFixed(2)} 萬</li>
            <li>└─ 被動收入: {parseFloat(data.income.passive || 0).toFixed(2)} 萬</li>
            <li style={{ borderTop: '1px solid #eee', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
              月總收入: {report.incomeTotal.toFixed(2)} 萬
            </li>
          </ul>
        </div>

        <div style={{ flex: '1 1 45%', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--white)' }}>
          <h3 style={{ color: 'var(--danger-color)' }}>💸 月支出</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.assets.properties.map((p, idx) => {
               if(!p.hasLoan || !p.loans) return null;
               let monthly = 0;
               p.loans.forEach(loan => {
                 monthly += loan.loanType === '本息攤還' ? calculatePMT(loan.amount, loan.rate, loan.years, loan.months) : calculateInterestOnly(loan.amount, loan.rate);
               });
               return <li key={idx}>├─ 房貸({p.name}): -{monthly.toFixed(2)} 萬</li>;
            })}
            
            {data.assets.vehicles.map((v, idx) => {
               if(!v.hasLoan || !v.loan) return null;
               return <li key={idx}>├─ 車貸({v.name}): -{calculatePMT(v.loan.amount, v.loan.rate, v.loan.years, v.loan.months).toFixed(2)} 萬</li>;
            })}

            <li>├─ 信貸: -{data.liabilities.personalLoans.reduce((acc, curr) => acc + calculatePMT(curr.amount, curr.rate, curr.years, curr.months), 0).toFixed(2)} 萬</li>
            <li>├─ 生活支出: -{parseFloat(data.expenses.living || 0).toFixed(2)} 萬</li>
            
            <li style={{ borderTop: '1px solid #eee', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
              月總支出: -{report.expenseTotal.toFixed(2)} 萬
            </li>
          </ul>
        </div>
      </div>

      <div style={{ background: report.netCashFlow >= 0 ? '#E8F5E9' : '#FFEBEE', padding: '24px', borderRadius: '12px', textAlign: 'center', border: `2px solid ${report.netCashFlow >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}` }}>
        <h3 style={{ margin: '0 0 12px 0', color: report.netCashFlow >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
          🎯 月淨現金流: {report.netCashFlow > 0 ? '+' : ''}{report.netCashFlow.toFixed(2)} 萬
        </h3>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: report.netCashFlow >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
          📈 年淨現金流: {report.netCashFlow > 0 ? '+' : ''}{(report.netCashFlow * 12).toFixed(2)} 萬
        </div>
      </div>

      {startSimulation && (
        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
          <button className="btn" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={startSimulation}>
            立刻進行未來規劃模擬 🚀
          </button>
        </div>
      )}

    </div>
  );
}
