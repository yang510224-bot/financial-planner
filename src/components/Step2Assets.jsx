"use client";

import { useState } from 'react';
import { calculatePMT, calculateInterestOnly } from '../utils/calculations';

export default function Step2Assets({ data, updateData }) {
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [expandedVehicle, setExpandedVehicle] = useState(null);

  const addProperty = () => {
    updateData('properties', [
      ...data.properties, 
      { id: Date.now(), name: `房屋${data.properties.length + 1}`, value: "", date: "", hasLoan: false, loans: [] }
    ]);
  };

  const updateProperty = (index, field, value) => {
    const newProps = [...data.properties];
    newProps[index] = { ...newProps[index], [field]: value };
    updateData('properties', newProps);
  };

  const removeProperty = (index) => {
    const newProps = [...data.properties];
    newProps.splice(index, 1);
    updateData('properties', newProps);
  };

  const addPropertyLoan = (propIndex) => {
    const newProps = [...data.properties];
    newProps[propIndex].loans.push({ 
      id: Date.now(), type: 'original', amount: "", rate: "", years: "", months: "", loanType: "本息攤還", startDate: "" 
    });
    updateData('properties', newProps);
  };

  const updatePropertyLoan = (propIndex, loanIndex, field, value) => {
    const newProps = [...data.properties];
    newProps[propIndex].loans[loanIndex] = { ...newProps[propIndex].loans[loanIndex], [field]: value };
    updateData('properties', newProps);
  };

  const removePropertyLoan = (propIndex, loanIndex) => {
    const newProps = [...data.properties];
    newProps[propIndex].loans.splice(loanIndex, 1);
    updateData('properties', newProps);
  };

  const addVehicle = () => {
    updateData('vehicles', [
      ...data.vehicles, 
      { id: Date.now(), name: `車子${data.vehicles.length + 1}`, value: "", date: "", hasLoan: false, loan: { amount: "", rate: "", years: "", months: "", startDate: "" } }
    ]);
  };

  const updateVehicle = (index, field, value) => {
    const newVehicles = [...data.vehicles];
    newVehicles[index] = { ...newVehicles[index], [field]: value };
    updateData('vehicles', newVehicles);
  };

  const removeVehicle = (index) => {
    const newVehicles = [...data.vehicles];
    newVehicles.splice(index, 1);
    updateData('vehicles', newVehicles);
  };

  const updateVehicleLoan = (index, field, value) => {
    const newVehicles = [...data.vehicles];
    newVehicles[index].loan = { ...newVehicles[index].loan, [field]: value };
    updateData('vehicles', newVehicles);
  };

  return (
    <div className="fade-in">
      <h2>資產清單</h2>
      <p className="text-aux" style={{ marginBottom: '24px' }}>請輸入您目前擁有的各種資產，我們會自動幫您試算相關的房貸或車貸。</p>

      {/* 2.1 現金/活存 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>2.1 現金/活存</h3>
      <div className="form-group flex gap-4 align-center">
        <label className="form-label" style={{ width: '100px', marginBottom: 0 }}>總金額</label>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="number" 
            className="form-input" 
            placeholder="0" 
            value={data.cash}
            onChange={(e) => updateData('cash', e.target.value)}
          />
          <span>萬元</span>
        </div>
      </div>

      {/* 2.2 定期存款/理財產品 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px' }}>2.2 定期存款/理財產品</h3>
      <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: '1 1 100%' }}>
          <label className="form-label">金額 (萬元)</label>
          <input 
            type="number" 
            className="form-input" 
            value={data.savings?.amount || ""}
            onChange={(e) => updateData('savings', { ...data.savings, amount: e.target.value })}
          />
        </div>
      </div>

      {/* 2.3 房產 */}
      <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>2.3 房產</h3>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={addProperty}>+ 新增房產</button>
      </div>
      
      {data.properties.map((prop, propIndex) => (
        <div key={prop.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
          <div className="flex justify-between align-center" style={{ cursor: 'pointer' }} onClick={() => setExpandedProperty(expandedProperty === prop.id ? null : prop.id)}>
            <h4 style={{ margin: 0 }}>{prop.name || `房屋 ${propIndex + 1}`}</h4>
            <div className="flex gap-2">
              <button className="btn-secondary" style={{ border: 'none', background: 'transparent' }} onClick={(e) => { e.stopPropagation(); removeProperty(propIndex); }}>🗑️</button>
              <span>{expandedProperty === prop.id ? '▲' : '▼'}</span>
            </div>
          </div>
          
          {(expandedProperty === prop.id || !prop.name) && (
             <div style={{ marginTop: '16px' }}>
               <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: '1 1 45%' }}>
                    <label className="form-label">房屋名稱</label>
                    <input type="text" className="form-input" value={prop.name} onChange={e => updateProperty(propIndex, 'name', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ flex: '1 1 45%' }}>
                    <label className="form-label">市場價值 (萬元)</label>
                    <input type="number" className="form-input" value={prop.value} onChange={e => updateProperty(propIndex, 'value', e.target.value)} />
                  </div>
               </div>

               <div className="form-group">
                 <label className="form-label">是否有貸款？</label>
                 <div className="flex gap-4">
                   <label><input type="radio" checked={!prop.hasLoan} onChange={() => updateProperty(propIndex, 'hasLoan', false)} /> 無</label>
                   <label><input type="radio" checked={prop.hasLoan} onChange={() => updateProperty(propIndex, 'hasLoan', true)} /> 有</label>
                 </div>
               </div>

               {prop.hasLoan && (
                 <div style={{ padding: '12px', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '8px' }}>
                    <div className="flex justify-between align-center mb-2">
                      <strong>房貸詳情</strong>
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => addPropertyLoan(propIndex)}>+ 新增房貸</button>
                    </div>
                    
                    {prop.loans.map((loan, loanIndex) => {
                      const pmt = loan.loanType === '本息攤還' ? calculatePMT(loan.amount, loan.rate, loan.years, loan.months) : calculateInterestOnly(loan.amount, loan.rate);
                      
                      return (
                        <div key={loan.id} style={{ borderBottom: loanIndex < prop.loans.length - 1 ? '1px dashed #ccc' : 'none', padding: '12px 0' }}>
                          <div className="flex justify-between">
                            <select className="form-input" style={{ width: 'auto', marginBottom: '8px', padding: '4px 8px' }} value={loan.loanType} onChange={e => updatePropertyLoan(propIndex, loanIndex, 'loanType', e.target.value)}>
                              <option>本息攤還</option>
                              <option>理財型房貸(只還息)</option>
                            </select>
                            <button className="btn-secondary" style={{ border: 'none', padding: 0 }} onClick={() => removePropertyLoan(propIndex, loanIndex)}>✕</button>
                          </div>
                          
                          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 20%' }}>
                              <label style={{ fontSize: '12px' }}>金額(萬)</label>
                              <input type="number" className="form-input" style={{ padding: '8px' }} value={loan.amount} onChange={e => updatePropertyLoan(propIndex, loanIndex, 'amount', e.target.value)} />
                            </div>
                            <div style={{ flex: '1 1 20%' }}>
                              <label style={{ fontSize: '12px' }}>利率(%)</label>
                              <input type="number" className="form-input" style={{ padding: '8px' }} value={loan.rate} onChange={e => updatePropertyLoan(propIndex, loanIndex, 'rate', e.target.value)} />
                            </div>
                            {loan.loanType === '本息攤還' && (
                              <div className="flex gap-1" style={{ flex: '1 1 30%' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ fontSize: '12px' }}>還款年數</label>
                                  <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="年" value={loan.years} onChange={e => updatePropertyLoan(propIndex, loanIndex, 'years', e.target.value)} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ fontSize: '12px' }}>剩餘月數</label>
                                  <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="月" value={loan.months || ''} onChange={e => updatePropertyLoan(propIndex, loanIndex, 'months', e.target.value)} />
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ marginTop: '8px', color: 'var(--danger-color)', fontWeight: 'bold' }}>
                            {loan.loanType === '本息攤還' ? '月付: ' : '月息: '} 
                            {pmt > 0 ? pmt.toFixed(4) : 0} 萬
                          </div>
                        </div>
                      )
                    })}
                    {prop.loans.length === 0 && <p className="text-aux" style={{ fontSize: '14px' }}>請新增一筆房貸</p>}
                 </div>
               )}
             </div>
          )}
        </div>
      ))}

      {/* 2.4 車子 */}
      <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>2.4 車子</h3>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={addVehicle}>+ 新增車子</button>
      </div>

      {data.vehicles.map((veh, idx) => (
        <div key={veh.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
          <div className="flex justify-between align-center" style={{ cursor: 'pointer' }} onClick={() => setExpandedVehicle(expandedVehicle === veh.id ? null : veh.id)}>
            <h4 style={{ margin: 0 }}>{veh.name || `車子 ${idx + 1}`}</h4>
            <div className="flex gap-2">
              <button className="btn-secondary" style={{ border: 'none', background: 'transparent' }} onClick={(e) => { e.stopPropagation(); removeVehicle(idx); }}>🗑️</button>
              <span>{expandedVehicle === veh.id ? '▲' : '▼'}</span>
            </div>
          </div>

          {(expandedVehicle === veh.id || !veh.name) && (
             <div style={{ marginTop: '16px' }}>
               <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: '1 1 45%' }}>
                    <label className="form-label">車子名稱</label>
                    <input type="text" className="form-input" value={veh.name} onChange={e => updateVehicle(idx, 'name', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ flex: '1 1 45%' }}>
                    <label className="form-label">市場價值 (萬元)</label>
                    <input type="number" className="form-input" value={veh.value} onChange={e => updateVehicle(idx, 'value', e.target.value)} />
                  </div>
               </div>

               <div className="form-group">
                 <label className="form-label">是否有貸款？</label>
                 <div className="flex gap-4">
                   <label><input type="radio" checked={!veh.hasLoan} onChange={() => updateVehicle(idx, 'hasLoan', false)} /> 無</label>
                   <label><input type="radio" checked={veh.hasLoan} onChange={() => updateVehicle(idx, 'hasLoan', true)} /> 有</label>
                 </div>
               </div>

               {veh.hasLoan && (
                 <div style={{ padding: '12px', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '8px' }}>
                    <strong>車貸詳情</strong>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: '8px' }}>
                      <div style={{ flex: '1 1 30%' }}>
                        <label style={{ fontSize: '12px' }}>金額(萬)</label>
                        <input type="number" className="form-input" style={{ padding: '8px' }} value={veh.loan.amount} onChange={e => updateVehicleLoan(idx, 'amount', e.target.value)} />
                      </div>
                      <div style={{ flex: '1 1 30%' }}>
                        <label style={{ fontSize: '12px' }}>利率(%)</label>
                        <input type="number" className="form-input" style={{ padding: '8px' }} value={veh.loan.rate} onChange={e => updateVehicleLoan(idx, 'rate', e.target.value)} />
                      </div>
                      <div className="flex gap-1" style={{ flex: '1 1 30%' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '12px' }}>還款年數</label>
                          <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="年" value={veh.loan.years} onChange={e => updateVehicleLoan(idx, 'years', e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '12px' }}>剩餘月數</label>
                          <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="月" value={veh.loan.months || ''} onChange={e => updateVehicleLoan(idx, 'months', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '8px', color: 'var(--danger-color)', fontWeight: 'bold' }}>
                      月付: {calculatePMT(veh.loan.amount, veh.loan.rate, veh.loan.years, veh.loan.months).toFixed(4)} 萬
                    </div>
                 </div>
               )}
             </div>
          )}
        </div>
      ))}
      {/* 新增項目 1: 保單現值 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px' }}>保單現值</h3>
      <p className="text-aux" style={{ fontSize: '13px', marginBottom: '16px' }}>包括你購買的壽險、醫療險、投資型保單等所有保單的當前現金價值（解約金）</p>
      
      <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
        <div className="form-group">
          <label className="form-label">是否有保單？</label>
          <div className="flex gap-4">
            <label><input type="radio" checked={!data.insurance?.hasInsurance} onChange={() => updateData('insurance', { ...data.insurance, hasInsurance: false })} /> 無</label>
            <label><input type="radio" checked={data.insurance?.hasInsurance} onChange={() => updateData('insurance', { ...data.insurance, hasInsurance: true })} /> 有</label>
          </div>
        </div>

        {data.insurance?.hasInsurance && (
          <div className="flex gap-4" style={{ flexWrap: 'wrap', marginTop: '16px' }}>
            <div className="form-group" style={{ flex: '1 1 100%' }}>
              <label className="form-label">保單現值總額 (萬元)</label>
              <input type="number" className="form-input" value={data.insurance.amount} onChange={e => updateData('insurance', { ...data.insurance, amount: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* 新增項目 2: 投資部位 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px' }}>投資部位</h3>
      <p className="text-aux" style={{ fontSize: '13px', marginBottom: '16px' }}>包括所有股票、基金、ETF、美股、加密等所有投資商品的當前總市值</p>

      <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
        <div className="form-group">
          <label className="form-label">是否有投資？（包括股票、基金、ETF、美股等）</label>
          <div className="flex gap-4">
            <label><input type="radio" checked={!data.investments?.hasInvestments} onChange={() => updateData('investments', { ...data.investments, hasInvestments: false })} /> 無</label>
            <label><input type="radio" checked={data.investments?.hasInvestments} onChange={() => updateData('investments', { ...data.investments, hasInvestments: true })} /> 有</label>
          </div>
        </div>

        {data.investments?.hasInvestments && (
          <div className="flex gap-4" style={{ flexWrap: 'wrap', marginTop: '16px' }}>
            <div className="form-group" style={{ flex: '1 1 100%' }}>
              <label className="form-label">投資部位總市值 (萬元)</label>
              <input type="number" className="form-input" value={data.investments.amount} onChange={e => updateData('investments', { ...data.investments, amount: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* 新增項目 3: 其他資產 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px' }}>其他資產</h3>
      <p className="text-aux" style={{ fontSize: '13px', marginBottom: '16px' }}>土地、機車、應收帳款、收藏品等任何其他資產的總額</p>

      <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
        <div className="form-group">
          <label className="form-label">是否有其他資產？（土地、機車、應收帳款、收藏品等）</label>
          <div className="flex gap-4">
            <label><input type="radio" checked={!data.otherAssets?.hasOtherAssets} onChange={() => updateData('otherAssets', { ...data.otherAssets, hasOtherAssets: false })} /> 無</label>
            <label><input type="radio" checked={data.otherAssets?.hasOtherAssets} onChange={() => updateData('otherAssets', { ...data.otherAssets, hasOtherAssets: true })} /> 有</label>
          </div>
        </div>

        {data.otherAssets?.hasOtherAssets && (
          <div style={{ marginTop: '16px' }}>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 45%' }}>
                <label className="form-label">資產總額 (萬元)</label>
                <input type="number" className="form-input" value={data.otherAssets.amount} onChange={e => updateData('otherAssets', { ...data.otherAssets, amount: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: '1 1 45%' }}>
                <label className="form-label">獲取時間</label>
                <input type="date" className="form-input" value={data.otherAssets.date} onChange={e => updateData('otherAssets', { ...data.otherAssets, date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">簡短說明（選填）</label>
              <input type="text" className="form-input" placeholder="例如：台中農地、應收客戶帳款" value={data.otherAssets.description} onChange={e => updateData('otherAssets', { ...data.otherAssets, description: e.target.value })} />
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
