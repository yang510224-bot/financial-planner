"use client";

import { useState, useMemo } from 'react';
import { 
  calculateAge, 
  calculateMonthlyPremiumPlan, 
  calculateLumpSumPlan, 
  calculateCombinedPlan 
} from '../utils/calculations';
import { generateFinancialReport } from '../utils/reportGenerator';

export default function Step7FuturePlanning({ data }) {
  const [params, setParams] = useState({
    planType: 'combined', // 'monthly', 'lumpSum', 'combined'
    monthlyPremium: "",
    investmentPeriod: 10,
    annualRate: "5", // 預設 5% 基金報酬率
    ownFundAmount: "",
    borrowedFundAmount: "",
    borrowedRate: "3",
    dividendRate: "7", // 7% 配息
    timeframes: { 5: false, 10: false, 20: true }
  });

  const report = useMemo(() => generateFinancialReport(data), [data]);
  const currentNetCashFlow = report.netCashFlow * 10000; // 元
  const currentAge = calculateAge(data.birthDate);
  const gender = data.gender;

  const updateParam = (field, value) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const toggleTimeframe = (years) => {
    setParams(prev => ({
      ...prev,
      timeframes: { ...prev.timeframes, [years]: !prev.timeframes[years] }
    }));
  };

  const results = useMemo(() => {
    if (params.planType === 'monthly') {
      return calculateMonthlyPremiumPlan(params.monthlyPremium, params.investmentPeriod, params.annualRate, currentAge, gender);
    } else if (params.planType === 'lumpSum') {
      return calculateLumpSumPlan(params.ownFundAmount, params.borrowedFundAmount, params.borrowedRate, params.dividendRate, currentAge);
    } else if (params.planType === 'combined') {
      return calculateCombinedPlan(params.monthlyPremium, params.investmentPeriod, params.annualRate, params.ownFundAmount, params.borrowedFundAmount, params.borrowedRate, params.dividendRate, currentAge, gender);
    }
    return null;
  }, [params, currentAge, gender]);

  const renderResultTable = () => {
    if (!results) return null;
    const selectedYears = [5, 10, 20].filter(y => params.timeframes[y]);

    if (params.planType === 'monthly') {
      return (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', color: 'var(--primary-dark)' }}>【每月規劃投入】</h3>
          <p>📝 每月投入：{params.monthlyPremium || 0} 元 | 規劃期限：{params.investmentPeriod} 年期 | 假設基金年化：{params.annualRate}%</p>
          
          <div className="flex gap-4" style={{ flexWrap: 'wrap', marginTop: '16px' }}>
            {selectedYears.map(year => (
              <div key={year} style={{ flex: '1 1 30%', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--white)', padding: '16px' }}>
                <div style={{ textAlign: 'center', background: 'var(--primary-color)', color: 'white', padding: '4px', borderRadius: '4px', marginBottom: '16px', fontWeight: 'bold' }}>{year}年後</div>
                <div>累積資產: <strong style={{color: 'var(--success-color)'}}>+{results[year].assetAccumulation.toFixed(2)}萬元</strong></div>
                <div>身故保障: <strong>+{results[year].deathBenefit.toFixed(2)}萬元</strong></div>
                <div style={{color: 'var(--danger-color)', margin: '8px 0'}}>月現金流變化: -{params.monthlyPremium || 0}元</div>
                <hr style={{ borderTop: '1px dashed #eee' }} />
                <div style={{fontSize: '12px', color: 'var(--aux-color)', marginTop: '8px'}}>原月現金流: {currentNetCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow)}元</div>
                <div style={{fontWeight: 'bold', marginTop: '4px'}}>
                  規劃後現金流: {currentNetCashFlow - (parseFloat(params.monthlyPremium)||0) > 0 ? '+' : ''}{Math.round(currentNetCashFlow - (parseFloat(params.monthlyPremium)||0))}元
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (params.planType === 'lumpSum') {
      return (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', color: 'var(--primary-dark)' }}>【躉繳配息規劃】</h3>
          <p>📝 總投入：{Number(params.ownFundAmount||0) + Number(params.borrowedFundAmount||0)} 萬元 (自有 {params.ownFundAmount||0} 萬, 增貸 {params.borrowedFundAmount||0} 萬) | 年配息率：{params.dividendRate}%</p>
          
          <div style={{ background: '#E8F5E9', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--success-color)' }}>
            <strong>⭐ 立即效果</strong>
            <div style={{ marginTop: '8px' }}>每月配息收入：<span style={{color: 'var(--success-color)', fontWeight: 'bold'}}>+{Math.round(results.immediate.monthlyDividend).toLocaleString()}元</span></div>
            {results.immediate.monthlyDebtInterest > 0 && (
              <div>每月增貸利息：<span style={{color: 'var(--danger-color)'}}>-{Math.round(results.immediate.monthlyDebtInterest).toLocaleString()}元</span></div>
            )}
            <hr style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
            <div style={{fontWeight: 'bold', fontSize: '16px'}}>真實淨現金流：<span style={{color: results.immediate.netMonthlyCashFlow >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}}>{results.immediate.netMonthlyCashFlow >= 0 ? '+' : ''}{Math.round(results.immediate.netMonthlyCashFlow).toLocaleString()}元</span></div>
            <div style={{ marginTop: '8px' }}>身故保障：<span style={{fontWeight: 'bold'}}>+{results.immediate.deathBenefit.toFixed(2)}萬元</span></div>
            <div style={{ fontSize: '13px', color: 'var(--aux-color)' }}>本金狀況：長期持平或微幅向上</div>
            <hr style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
            <div>原月現金流：{currentNetCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow).toLocaleString()}元</div>
            <div style={{ fontWeight: 'bold' }}>規劃後月現金流：{currentNetCashFlow + results.immediate.netMonthlyCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow + results.immediate.netMonthlyCashFlow).toLocaleString()}元</div>
          </div>

          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            {selectedYears.map(year => (
              <div key={year} style={{ flex: '1 1 30%', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--white)', padding: '16px' }}>
                <div style={{ textAlign: 'center', background: 'var(--primary-color)', color: 'white', padding: '4px', borderRadius: '4px', marginBottom: '16px', fontWeight: 'bold' }}>{year}年後</div>
                <div>配息累積現金: <strong style={{color: 'var(--success-color)'}}>+{results[year].accumulatedDividend.toFixed(2)}萬元</strong></div>
                <div style={{margin: '8px 0'}}>本金變化: ±0 (持平)</div>
                <div style={{fontWeight: 'bold'}}>總資產增加: +{results[year].totalAssetIncrease.toFixed(2)}萬元</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (params.planType === 'combined') {
      return (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', color: 'var(--primary-dark)' }}>【組合規劃方案（⭐ 推薦）】</h3>
          <p>📝 躉繳總投入：{Number(params.ownFundAmount||0) + Number(params.borrowedFundAmount||0)} 萬元 | 每月投入：{params.monthlyPremium || 0} 元 ({params.investmentPeriod}年) | 年配息率：{params.dividendRate}%</p>
          
          <div style={{ background: '#FFF8E1', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #FFC107' }}>
            <strong>⭐ 立即效果</strong>
            <div style={{ marginTop: '8px' }}>月配息收入：<span style={{color: 'var(--success-color)'}}>+{Math.round(results.immediate.monthlyDividend).toLocaleString()}元</span></div>
            {results.immediate.monthlyDebtInterest > 0 && (
              <div>月增貸利息：<span style={{color: 'var(--danger-color)'}}>-{Math.round(results.immediate.monthlyDebtInterest).toLocaleString()}元</span></div>
            )}
            <div>月投入支出：<span style={{color: 'var(--danger-color)'}}>-{Math.round(results.immediate.monthlyPremiumExpense).toLocaleString()}元</span></div>
            <hr style={{ borderTop: '1px solid #ccc', margin: '8px 0' }} />
            <div style={{fontWeight: 'bold'}}>綜合淨現金流：<span style={{color: results.immediate.netCashFlowChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}}>{results.immediate.netCashFlowChange >= 0 ? '+' : ''}{Math.round(results.immediate.netCashFlowChange).toLocaleString()}元</span></div>
            <div style={{ marginTop: '8px', fontSize: '13px' }}>原月現金流：{currentNetCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow).toLocaleString()}元</div>
            <div style={{ fontWeight: 'bold' }}>規劃後月現金流：{currentNetCashFlow + results.immediate.netCashFlowChange > 0 ? '+' : ''}{Math.round(currentNetCashFlow + results.immediate.netCashFlowChange).toLocaleString()}元</div>
            <div style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>身故保障：+{results.immediate.deathBenefit.toFixed(2)}萬元</div>
          </div>

          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            {selectedYears.map(year => (
              <div key={year} style={{ flex: '1 1 30%', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--white)', padding: '16px' }}>
                <div style={{ textAlign: 'center', background: 'var(--primary-color)', color: 'white', padding: '4px', borderRadius: '4px', marginBottom: '16px', fontWeight: 'bold' }}>{year}年後</div>
                <div>躉繳配息累積: <span style={{color: 'var(--success-color)'}}>+{results[year].accumulatedDividend.toFixed(2)}萬</span></div>
                <div>月定期累積: <span style={{color: 'var(--success-color)'}}>+{results[year].assetAccumulation.toFixed(2)}萬</span></div>
                <hr style={{ borderTop: '1px solid #ccc', margin: '8px 0' }} />
                <div style={{fontWeight: 'bold'}}>總資產增加: +{results[year].totalAssetIncrease.toFixed(2)}萬元</div>
                <div style={{ marginTop: '8px', color: 'var(--primary-dark)' }}>身故保障: +{results[year].deathBenefit.toFixed(2)}萬元</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>🔮 規劃情景模擬器</h2>
      <p className="text-aux" style={{ textAlign: 'center', marginBottom: '32px' }}>
        如果用多出來的現金流做這些規劃，5年/10年/20年後會發生什麼改變？
      </p>

      {/* 步驟 1 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>步驟 1：你想怎麼規劃你的資產？</h3>
      <div className="flex gap-4" style={{ flexWrap: 'wrap', marginBottom: '32px' }}>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label style={{ display: 'block', padding: '12px', border: `1px solid ${params.planType === 'monthly' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: '8px', background: params.planType === 'monthly' ? '#F5F5F5' : 'transparent', cursor: 'pointer' }}>
            <input type="radio" checked={params.planType === 'monthly'} onChange={() => updateParam('planType', 'monthly')} style={{ marginRight: '8px' }} />
            每月定期規劃（月投入 + 累積保障）
          </label>
        </div>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label style={{ display: 'block', padding: '12px', border: `1px solid ${params.planType === 'lumpSum' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: '8px', background: params.planType === 'lumpSum' ? '#F5F5F5' : 'transparent', cursor: 'pointer' }}>
            <input type="radio" checked={params.planType === 'lumpSum'} onChange={() => updateParam('planType', 'lumpSum')} style={{ marginRight: '8px' }} />
            一次大額投入（躉繳配息）
          </label>
        </div>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label style={{ display: 'block', padding: '12px', border: `2px solid ${params.planType === 'combined' ? '#FFC107' : 'var(--border-color)'}`, borderRadius: '8px', background: params.planType === 'combined' ? '#FFF8E1' : 'transparent', cursor: 'pointer' }}>
            <input type="radio" checked={params.planType === 'combined'} onChange={() => updateParam('planType', 'combined')} style={{ marginRight: '8px' }} />
            ⭐ 兩者結合（推薦！）
          </label>
        </div>
      </div>

      {/* 步驟 2 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>步驟 2：參數設定</h3>
      <div style={{ background: '#faf9f6', padding: '16px', borderRadius: '8px', marginBottom: '32px', border: '1px solid var(--border-color)' }}>
        {(params.planType === 'monthly' || params.planType === 'combined') && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0' }}>【每月投入設定】</h4>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 30%' }}>
                <label className="form-label">每月投入金額 (元)</label>
                <input type="number" className="form-input" placeholder="例如：5000" value={params.monthlyPremium} onChange={e => updateParam('monthlyPremium', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '1 1 30%' }}>
                <label className="form-label">規劃期限 (年)</label>
                <select className="form-input" value={params.investmentPeriod} onChange={e => updateParam('investmentPeriod', e.target.value)}>
                  <option value="5">5 年期</option>
                  <option value="10">10 年期</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: '1 1 30%' }}>
                <label className="form-label">預估年化報酬率 (%)</label>
                <input type="number" className="form-input" placeholder="例如：5" value={params.annualRate} onChange={e => updateParam('annualRate', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {(params.planType === 'lumpSum' || params.planType === 'combined') && (
          <div>
            <h4 style={{ margin: '0 0 12px 0' }}>【躉繳配息設定】</h4>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 30%' }}>
                <label className="form-label">自有資金 (萬元)</label>
                <input type="number" className="form-input" placeholder="例如：200" value={params.ownFundAmount} onChange={e => updateParam('ownFundAmount', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '1 1 30%' }}>
                <label className="form-label">增貸資金 (萬元)</label>
                <input type="number" className="form-input" placeholder="例如：100" value={params.borrowedFundAmount} onChange={e => updateParam('borrowedFundAmount', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '1 1 30%' }}>
                <label className="form-label">增貸借款年利 (%)</label>
                <input type="number" className="form-input" placeholder="例如：3" value={params.borrowedRate} onChange={e => updateParam('borrowedRate', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '1 1 30%' }}>
                <label className="form-label">預估年配息率 (%)</label>
                <select className="form-input" value={params.dividendRate} onChange={e => updateParam('dividendRate', e.target.value)}>
                  <option value="5">5%</option>
                  <option value="6">6%</option>
                  <option value="7">7%</option>
                  <option value="8">8%</option>
                  <option value="9">9%</option>
                  <option value="10">10%</option>
                  <option value="11">11%</option>
                  <option value="12">12%</option>
                  <option value="13">13%</option>
                  <option value="14">14%</option>
                  <option value="15">15%</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 步驟 3 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>步驟 3：你想看幾年後的情景？</h3>
      <div className="flex gap-4" style={{ marginBottom: '32px' }}>
        <label><input type="checkbox" checked={params.timeframes[5]} onChange={() => toggleTimeframe(5)} /> 5年後</label>
        <label><input type="checkbox" checked={params.timeframes[10]} onChange={() => toggleTimeframe(10)} /> 10年後</label>
        <label><input type="checkbox" checked={params.timeframes[20]} onChange={() => toggleTimeframe(20)} /> 20年後</label>
      </div>

      {/* 圖表結果 */}
      {renderResultTable()}
      
    </div>
  );
}
