"use client";

import { useMemo } from 'react';
import { calculatePMT, calculateInterestOnly, calculateCreditCardInterest } from '../utils/calculations';

export default function Step5Expenses({ data, assets, liabilities, updateData }) {

  const autoCalculated = useMemo(() => {
    let mortgage = 0;
    let carLoan = 0;
    let personalLoan = 0;
    let creditCard = 0;
    let otherLoan = 0;

    // 房貸
    assets.properties.forEach(prop => {
      if (prop.hasLoan && prop.loans) {
        prop.loans.forEach(loan => {
          if (loan.loanType === '本息攤還') {
            mortgage += calculatePMT(loan.amount, loan.rate, loan.years);
          } else {
            mortgage += calculateInterestOnly(loan.amount, loan.rate);
          }
        });
      }
    });

    // 車貸
    assets.vehicles.forEach(veh => {
      if (veh.hasLoan && veh.loan) {
        carLoan += calculatePMT(veh.loan.amount, veh.loan.rate, veh.loan.years);
      }
    });

    // 信貸
    liabilities.personalLoans.forEach(loan => {
      personalLoan += calculatePMT(loan.amount, loan.rate, loan.years);
    });

    // 信用卡
    liabilities.creditCards.forEach(card => {
      if (card.hasDebt) {
        if (card.installmentsPayment) creditCard += parseFloat(card.installmentsPayment);
        if (card.zeroIntPayment) creditCard += parseFloat(card.zeroIntPayment);
        if (card.hasCirculating && card.minPayment) creditCard += parseFloat(card.minPayment);
        if (card.hasCirculating) {
           creditCard += calculateCreditCardInterest(card.circulatingAmount, card.minPayment);
        }
      }
    });

    // 其他貸款
    liabilities.other.forEach(loan => {
      otherLoan += calculatePMT(loan.amount, loan.rate, loan.years);
    });

    const subTotal = mortgage + carLoan + personalLoan + creditCard + otherLoan;

    return { mortgage, carLoan, personalLoan, creditCard, otherLoan, subTotal };
  }, [assets, liabilities]);

  return (
    <div className="fade-in">
      <h2>月支出</h2>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        這裡總結了您每月的既有貸款支出，並請您填寫一般生活支出。
      </p>

      {/* 5.1 既有月付 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>5.1 既有月付 (系統試算)</h3>
      <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '32px', background: 'var(--white)' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span>房貸月付：</span>
            <strong>{autoCalculated.mortgage.toFixed(4)} 萬</strong>
          </li>
          <li className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span>車貸月付：</span>
            <strong>{autoCalculated.carLoan.toFixed(4)} 萬</strong>
          </li>
          <li className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span>信貸月付：</span>
            <strong>{autoCalculated.personalLoan.toFixed(4)} 萬</strong>
          </li>
          <li className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span>信用卡月付：</span>
            <strong>{autoCalculated.creditCard.toFixed(4)} 萬</strong>
          </li>
          <li className="flex justify-between" style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}>
            <span>其他貸款月付：</span>
            <strong>{autoCalculated.otherLoan.toFixed(4)} 萬</strong>
          </li>
          <li className="flex justify-between" style={{ fontSize: '18px', color: 'var(--primary-dark)' }}>
            <strong>小計：</strong>
            <strong>{autoCalculated.subTotal.toFixed(4)} 萬/月</strong>
          </li>
        </ul>
      </div>

      {/* 5.2 生活支出 */}
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>5.2 生活支出</h3>
      <div className="form-group" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#faf9f6' }}>
        <label className="form-label">食、住、行、娛樂等費用總和</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px' }}>
          <input 
            type="number" 
            className="form-input" 
            placeholder="0" 
            value={data.living}
            onChange={(e) => updateData('living', e.target.value)}
          />
          <span>萬 / 月</span>
        </div>
      </div>
      
    </div>
  );
}
