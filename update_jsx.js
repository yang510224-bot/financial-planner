const fs = require('fs');

let content = fs.readFileSync('src/components/Step7FuturePlanning.jsx', 'utf8');

// Replacements in state and calculate usage
content = content.replace(/(lumpSumAmount: "")/g, 'ownFundAmount: "",\n    borrowedFundAmount: "",\n    borrowedRate: "3"');
content = content.replace(/calculateLumpSumPlan\(params\.lumpSumAmount, params\.dividendRate, currentAge\)/g, "calculateLumpSumPlan(params.ownFundAmount, params.borrowedFundAmount, params.borrowedRate, params.dividendRate, currentAge)");
content = content.replace(/calculateCombinedPlan\(params\.monthlyPremium, params\.investmentPeriod, params\.annualRate, params\.lumpSumAmount, params\.dividendRate, currentAge, gender\)/g, "calculateCombinedPlan(params.monthlyPremium, params.investmentPeriod, params.annualRate, params.ownFundAmount, params.borrowedFundAmount, params.borrowedRate, params.dividendRate, currentAge, gender)");

// Replace terminologies
content = content.replace(/【每月投保規劃】/g, "【每月規劃投入】");
content = content.replace(/投保期限/g, "規劃期限");
content = content.replace(/【每月投保設定】/g, "【每月投入設定】");
content = content.replace(/月投保支出：/g, "月投入支出：");
content = content.replace(/月投保累積/g, "月定期累積");
content = content.replace(/每月定期投保/g, "每月定期規劃");
content = content.replace(/每月投保：/g, "每月投入：");

// Replace lumpSum headers and variables in JSX
content = content.replace(/一次投入：\{params\.lumpSumAmount \|\| 0\} 萬元/g, "總投入：{Number(params.ownFundAmount||0) + Number(params.borrowedFundAmount||0)} 萬元 (自有 {params.ownFundAmount||0} 萬, 增貸 {params.borrowedFundAmount||0} 萬)");
content = content.replace(/躉繳投資：\{params\.lumpSumAmount \|\| 0\} 萬元/g, "躉繳總投入：{Number(params.ownFundAmount||0) + Number(params.borrowedFundAmount||0)} 萬元");

// Update JSX for lumpSum Form Inputs
const oldLumpSumInputs = `<div className="form-group" style={{ flex: '1 1 45%' }}>
                <label className="form-label">一次性投入金額 (萬元)</label>
                <input type="number" className="form-input" placeholder="例如：200" value={params.lumpSumAmount} onChange={e => updateParam('lumpSumAmount', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '1 1 45%' }}>
                <label className="form-label">預估年配息率 (%)</label>
                <select className="form-input" value={params.dividendRate} onChange={e => updateParam('dividendRate', e.target.value)}>`;

const newLumpSumInputs = `<div className="form-group" style={{ flex: '1 1 30%' }}>
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
                <select className="form-input" value={params.dividendRate} onChange={e => updateParam('dividendRate', e.target.value)}>`;
content = content.replace(oldLumpSumInputs, newLumpSumInputs);

// Update Result UI block for Lump Sum
const oldImmediateLumpSum = `<strong>⭐ 立即效果</strong>
            <div style={{ marginTop: '8px' }}>每月配息收入：<span style={{color: 'var(--success-color)', fontWeight: 'bold'}}>+{Math.round(results.immediate.monthlyDividend).toLocaleString()}元</span></div>
            <div>身故保障：<span style={{fontWeight: 'bold'}}>+{results.immediate.deathBenefit.toFixed(2)}萬元</span></div>
            <div style={{ fontSize: '13px', color: 'var(--aux-color)' }}>本金狀況：長期持平或微幅向上</div>
            <hr style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
            <div>原月現金流：{currentNetCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow).toLocaleString()}元</div>
            <div style={{ fontWeight: 'bold' }}>規劃後月現金流：{currentNetCashFlow + results.immediate.monthlyDividend > 0 ? '+' : ''}{Math.round(currentNetCashFlow + results.immediate.monthlyDividend).toLocaleString()}元</div>`;

const newImmediateLumpSum = `<strong>⭐ 立即效果</strong>
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
            <div style={{ fontWeight: 'bold' }}>規劃後月現金流：{currentNetCashFlow + results.immediate.netMonthlyCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow + results.immediate.netMonthlyCashFlow).toLocaleString()}元</div>`;

content = content.replace(oldImmediateLumpSum, newImmediateLumpSum);

// Update Result UI block for Combined
const oldImmediateCombined = `<strong>⭐ 立即效果</strong>
            <div style={{ marginTop: '8px' }}>月配息收入：<span style={{color: 'var(--success-color)'}}>+{Math.round(results.immediate.monthlyDividend).toLocaleString()}元</span></div>
            <div>月投入支出：<span style={{color: 'var(--danger-color)'}}>-{Math.round(results.immediate.monthlyPremiumExpense).toLocaleString()}元</span></div>
            <hr style={{ borderTop: '1px solid #ccc', margin: '8px 0' }} />
            <div style={{fontWeight: 'bold'}}>淨月現金流變化：{results.immediate.netCashFlowChange > 0 ? '+' : ''}{Math.round(results.immediate.netCashFlowChange).toLocaleString()}元</div>
            <div style={{ marginTop: '8px', fontSize: '13px' }}>原月現金流：{currentNetCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow).toLocaleString()}元</div>
            <div style={{ fontWeight: 'bold' }}>規劃後月現金流：{currentNetCashFlow + results.immediate.netCashFlowChange > 0 ? '+' : ''}{Math.round(currentNetCashFlow + results.immediate.netCashFlowChange).toLocaleString()}元</div>
            <div style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>身故保障：+{results.immediate.deathBenefit.toFixed(2)}萬元</div>`;

const newImmediateCombined = `<strong>⭐ 立即效果</strong>
            <div style={{ marginTop: '8px' }}>月配息收入：<span style={{color: 'var(--success-color)'}}>+{Math.round(results.immediate.monthlyDividend).toLocaleString()}元</span></div>
            {results.immediate.monthlyDebtInterest > 0 && (
              <div>月增貸利息：<span style={{color: 'var(--danger-color)'}}>-{Math.round(results.immediate.monthlyDebtInterest).toLocaleString()}元</span></div>
            )}
            <div>月投入支出：<span style={{color: 'var(--danger-color)'}}>-{Math.round(results.immediate.monthlyPremiumExpense).toLocaleString()}元</span></div>
            <hr style={{ borderTop: '1px solid #ccc', margin: '8px 0' }} />
            <div style={{fontWeight: 'bold'}}>綜合淨現金流：<span style={{color: results.immediate.netCashFlowChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}}>{results.immediate.netCashFlowChange >= 0 ? '+' : ''}{Math.round(results.immediate.netCashFlowChange).toLocaleString()}元</span></div>
            <div style={{ marginTop: '8px', fontSize: '13px' }}>原月現金流：{currentNetCashFlow > 0 ? '+' : ''}{Math.round(currentNetCashFlow).toLocaleString()}元</div>
            <div style={{ fontWeight: 'bold' }}>規劃後月現金流：{currentNetCashFlow + results.immediate.netCashFlowChange > 0 ? '+' : ''}{Math.round(currentNetCashFlow + results.immediate.netCashFlowChange).toLocaleString()}元</div>
            <div style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>身故保障：+{results.immediate.deathBenefit.toFixed(2)}萬元</div>`;

content = content.replace(oldImmediateCombined, newImmediateCombined);

fs.writeFileSync('src/components/Step7FuturePlanning.jsx', content);
console.log('JSX update complete');
