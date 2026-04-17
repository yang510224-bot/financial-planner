"use client";

import { useState } from 'react';
import { calculatePMT, calculateCreditCardInterest } from '../utils/calculations';

export default function Step3Liabilities({ data, updateData }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const addPersonalLoan = () => {
    updateData('personalLoans', [
      ...data.personalLoans,
      { id: Date.now(), title: `信貸${data.personalLoans.length + 1}`, amount: "", rate: "", years: "", months: "", startDate: "" }
    ]);
  };

  const updatePersonalLoan = (index, field, value) => {
    const newLoans = [...data.personalLoans];
    newLoans[index] = { ...newLoans[index], [field]: value };
    updateData('personalLoans', newLoans);
  };

  const removePersonalLoan = (index) => {
    const newLoans = [...data.personalLoans];
    newLoans.splice(index, 1);
    updateData('personalLoans', newLoans);
  };

  const addCreditCard = () => {
    updateData('creditCards', [
      ...data.creditCards,
      { 
        id: Date.now(), 
        name: `信用卡${data.creditCards.length + 1}`,
        hasDebt: false,
        installmentsAmount: "",
        installmentsPayment: "",
        zeroIntAmount: "",
        zeroIntPayment: "",
        hasCirculating: false,
        circulatingAmount: "",
        minPayment: ""
      }
    ]);
  };

  const updateCreditCard = (index, field, value) => {
    const newCards = [...data.creditCards];
    newCards[index] = { ...newCards[index], [field]: value };
    updateData('creditCards', newCards);
  };

  const removeCreditCard = (index) => {
    const newCards = [...data.creditCards];
    newCards.splice(index, 1);
    updateData('creditCards', newCards);
  };

  const addOtherLoan = () => {
    updateData('other', [
      ...data.other,
      { id: Date.now(), type: "親友借款", amount: "", rate: "", years: "", months: "", startDate: "" }
    ]);
  };

  const updateOtherLoan = (index, field, value) => {
    const newLoans = [...data.other];
    newLoans[index] = { ...newLoans[index], [field]: value };
    updateData('other', newLoans);
  };

  const removeOtherLoan = (index) => {
    const newLoans = [...data.other];
    newLoans.splice(index, 1);
    updateData('other', newLoans);
  };

  return (
    <div className="fade-in">
      <h2>負債清單</h2>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        這裡填寫房貸、車貸以外的其他負債（如信貸、信用卡分期）。
      </p>

      {/* 3.1 信貸 */}
      <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>3.1 信貸</h3>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={addPersonalLoan}>+ 新增信貸</button>
      </div>

      {data.personalLoans.map((loan, idx) => (
        <div key={loan.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
          <div className="flex justify-between align-center mb-2">
            <strong>{loan.title}</strong>
            <button className="btn-secondary" style={{ border: 'none', background: 'transparent' }} onClick={() => removePersonalLoan(idx)}>🗑️</button>
          </div>
          
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ fontSize: '12px' }}>金額(萬)</label>
              <input type="number" className="form-input" style={{ padding: '8px' }} value={loan.amount} onChange={e => updatePersonalLoan(idx, 'amount', e.target.value)} />
            </div>
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ fontSize: '12px' }}>利率(%)</label>
              <input type="number" className="form-input" style={{ padding: '8px' }} value={loan.rate} onChange={e => updatePersonalLoan(idx, 'rate', e.target.value)} />
            </div>
            <div className="flex gap-1" style={{ flex: '1 1 30%' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px' }}>還款年數</label>
                <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="年" value={loan.years} onChange={e => updatePersonalLoan(idx, 'years', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px' }}>剩餘月數</label>
                <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="月" value={loan.months || ''} onChange={e => updatePersonalLoan(idx, 'months', e.target.value)} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px', color: 'var(--danger-color)', fontWeight: 'bold' }}>
            月付: {calculatePMT(loan.amount, loan.rate, loan.years, loan.months).toFixed(4)} 萬
          </div>
        </div>
      ))}
      {data.personalLoans.length === 0 && <p className="text-aux" style={{ fontSize: '14px', marginBottom: '32px' }}>目前無信貸</p>}

      {/* 3.2 信用卡 */}
      <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>3.2 信用卡</h3>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={addCreditCard}>+ 新增信用卡</button>
      </div>

      {data.creditCards.map((card, idx) => {
        let totalMonthly = 0;
        if (card.installmentsPayment) totalMonthly += parseFloat(card.installmentsPayment);
        if (card.zeroIntPayment) totalMonthly += parseFloat(card.zeroIntPayment);
        if (card.hasCirculating && card.minPayment) totalMonthly += parseFloat(card.minPayment);
        if (card.hasCirculating) {
           totalMonthly += calculateCreditCardInterest(card.circulatingAmount, card.minPayment);
        }

        return (
          <div key={card.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
            <div className="flex justify-between align-center" style={{ cursor: 'pointer' }} onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}>
              <h4 style={{ margin: 0 }}>{card.name || `信用卡 ${idx + 1}`}</h4>
              <div className="flex gap-2">
                <button className="btn-secondary" style={{ border: 'none', background: 'transparent' }} onClick={(e) => { e.stopPropagation(); removeCreditCard(idx); }}>🗑️</button>
                <span>{expandedCard === card.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {(expandedCard === card.id || !card.name) && (
              <div style={{ marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label">卡片名稱</label>
                  <input type="text" className="form-input" value={card.name} onChange={e => updateCreditCard(idx, 'name', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">是否有信用卡債務(分期/循環)？</label>
                  <div className="flex gap-4">
                    <label><input type="radio" checked={!card.hasDebt} onChange={() => updateCreditCard(idx, 'hasDebt', false)} /> 無</label>
                    <label><input type="radio" checked={card.hasDebt} onChange={() => updateCreditCard(idx, 'hasDebt', true)} /> 有</label>
                  </div>
                </div>

                {card.hasDebt && (
                  <div style={{ padding: '12px', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '8px' }}>
                    <div style={{ marginBottom: '16px', borderBottom: '1px dashed #ccc', paddingBottom: '12px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>A. 帳單分期</strong>
                      <div className="flex gap-2">
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '12px' }}>總金額(萬)</label>
                          <input type="number" className="form-input" style={{ padding: '8px' }} value={card.installmentsAmount} onChange={e => updateCreditCard(idx, 'installmentsAmount', e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '12px' }}>每月月付額(萬)</label>
                          <input type="number" className="form-input" style={{ padding: '8px' }} value={card.installmentsPayment} onChange={e => updateCreditCard(idx, 'installmentsPayment', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px', borderBottom: '1px dashed #ccc', paddingBottom: '12px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>B. 商品分期 (零利率)</strong>
                      <div className="flex gap-2">
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '12px' }}>總金額(萬)</label>
                          <input type="number" className="form-input" style={{ padding: '8px' }} value={card.zeroIntAmount} onChange={e => updateCreditCard(idx, 'zeroIntAmount', e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '12px' }}>每月月付額(萬)</label>
                          <input type="number" className="form-input" style={{ padding: '8px' }} value={card.zeroIntPayment} onChange={e => updateCreditCard(idx, 'zeroIntPayment', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>C. 循環利息</strong>
                      <div className="flex gap-4 mb-2">
                        <label><input type="radio" checked={!card.hasCirculating} onChange={() => updateCreditCard(idx, 'hasCirculating', false)} /> 無 (全額繳清)</label>
                        <label><input type="radio" checked={card.hasCirculating} onChange={() => updateCreditCard(idx, 'hasCirculating', true)} /> 有 (只繳最低)</label>
                      </div>
                      
                      {card.hasCirculating && (
                        <div className="flex gap-2 mt-2">
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px' }}>帳單未清金額(萬)</label>
                            <input type="number" className="form-input" style={{ padding: '8px' }} value={card.circulatingAmount} onChange={e => updateCreditCard(idx, 'circulatingAmount', e.target.value)} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px' }}>每月最低繳款(萬)</label>
                            <input type="number" className="form-input" style={{ padding: '8px' }} value={card.minPayment} onChange={e => updateCreditCard(idx, 'minPayment', e.target.value)} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '16px', color: 'var(--danger-color)', fontWeight: 'bold', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                      該卡月支付(含循環利息): {totalMonthly.toFixed(4)} 萬
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 3.3 其他貸款 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '32px' }}>3.3 其他貸款</h3>
      
      {data.other.map((loan, idx) => (
        <div key={loan.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: '#faf9f6' }}>
          <div className="flex justify-between align-center mb-2">
            <input type="text" className="form-input" style={{ width: '200px' }} placeholder="自訂貸款名稱" value={loan.type} onChange={e => updateOtherLoan(idx, 'type', e.target.value)} />
            <button className="btn-secondary" style={{ border: 'none', background: 'transparent' }} onClick={() => removeOtherLoan(idx)}>🗑️</button>
          </div>
          
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ fontSize: '12px' }}>金額(萬)</label>
              <input type="number" className="form-input" style={{ padding: '8px' }} value={loan.amount} onChange={e => updateOtherLoan(idx, 'amount', e.target.value)} />
            </div>
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ fontSize: '12px' }}>利率(%)</label>
              <input type="number" className="form-input" style={{ padding: '8px' }} value={loan.rate} onChange={e => updateOtherLoan(idx, 'rate', e.target.value)} />
            </div>
            <div className="flex gap-1" style={{ flex: '1 1 30%' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px' }}>還款年數</label>
                <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="年" value={loan.years} onChange={e => updateOtherLoan(idx, 'years', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px' }}>剩餘月數</label>
                <input type="number" className="form-input" style={{ padding: '8px' }} placeholder="月" value={loan.months || ''} onChange={e => updateOtherLoan(idx, 'months', e.target.value)} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px', color: 'var(--danger-color)', fontWeight: 'bold' }}>
            月付: {calculatePMT(loan.amount, loan.rate, loan.years, loan.months).toFixed(4)} 萬
          </div>
        </div>
      ))}
      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={addOtherLoan}>+ 新增其他貸款</button>
      
    </div>
  );
}
