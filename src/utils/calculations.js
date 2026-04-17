// 計算月付金額 (本息攤還)
export const calculatePMT = (principalLakh, annualRatePercent, years) => {
  if (!principalLakh || !annualRatePercent || !years) return 0;
  
  const P = parseFloat(principalLakh); // 萬元
  const annualRate = parseFloat(annualRatePercent);
  const n = parseInt(years) * 12; // 總期數(月)
  
  if (annualRate === 0) return P / n;
  
  const r = annualRate / 100 / 12; // 月利率
  
  // PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
  const pmt = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return pmt; // 萬元
};

// 計算只繳息的月息 (理財型)
export const calculateInterestOnly = (principalLakh, annualRatePercent) => {
  if (!principalLakh || !annualRatePercent) return 0;
  const P = parseFloat(principalLakh);
  const r = parseFloat(annualRatePercent) / 100 / 12;
  return P * r; // 萬元
};

// 計算信用卡循環利息 (月利率預設1.5%)
export const calculateCreditCardInterest = (outstandingLakh, monthlyPaymentLakh, monthlyRatePercent = 1.5) => {
  if (!outstandingLakh) return 0;
  const out = parseFloat(outstandingLakh);
  const pay = monthlyPaymentLakh ? parseFloat(monthlyPaymentLakh) : 0;
  
  if (out <= pay) return 0; // 全額繳清無利息
  
  const r = parseFloat(monthlyRatePercent) / 100;
  return (out - pay) * r; // 萬元
};
