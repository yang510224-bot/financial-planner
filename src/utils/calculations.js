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

// ====== Section B: Future Planning Utils ======

export const calculateAge = (birthDateString) => {
  if (!birthDateString) return 30; // Default
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getLumpSumLeverage = (age) => {
  if (age >= 15 && age <= 30) return 1.90;
  if (age >= 31 && age <= 40) return 1.60;
  if (age >= 41 && age <= 50) return 1.40;
  if (age >= 51 && age <= 60) return 1.20;
  if (age >= 61 && age <= 70) return 1.10;
  if (age >= 71 && age <= 90) return 1.02;
  if (age > 90) return 1.00;
  return 1.90; 
};

export const getInsuranceCostPerTenThousand = (age, gender) => {
  const isMale = gender === 'M' || gender === '男';
  if (age <= 20) return isMale ? 1.0942 : 0.4417;
  if (age <= 30) return isMale ? 1.1608 : 0.4942; 
  if (age <= 40) return isMale ? 2.3008 : 1.0333;
  if (age <= 50) return isMale ? 5.0467 : 2.5142;
  if (age <= 60) return isMale ? 11.7983 : 6.0775;
  if (age <= 70) return isMale ? 28.9150 : 16.1925;
  return isMale ? 28.9150 : 16.1925; 
};

export const getFeeRate = (year) => {
  if (year === 1) return 0.60;
  if (year === 2) return 0.40;
  if (year === 3) return 0.20;
  if (year === 4) return 0.20;
  if (year === 5) return 0.20;
  return 0;
};

export const getRefundRate = (year) => {
  if (year === 6) return 0.60 * 0.10;
  if (year === 7) return 0.40 * 0.20;
  if (year === 8) return 0.20 * 0.20;
  if (year === 9) return 0.20 * 0.40;
  if (year === 10) return 0.20 * 0.60;
  return 0;
};

export const calculateMonthlyPremiumPlan = (monthlyPremiumStr, periodStr, annualRatePercentStr, currentAge, gender) => {
  const moPremium = parseFloat(monthlyPremiumStr) || 0;
  const period = parseInt(periodStr) || 10;
  const annualRate = (parseFloat(annualRatePercentStr) || 0) / 100;
  
  // 保額係數: 月投 × 500 (根據使用者指示：月投5000 -> 保額250萬)
  const faceAmountLakh = (moPremium * 500) / 10000; // 萬元

  const result = {
    faceAmountLakh: faceAmountLakh,
    5: { assetAccumulation: 0, deathBenefit: faceAmountLakh },
    10: { assetAccumulation: 0, deathBenefit: faceAmountLakh },
    20: { assetAccumulation: 0, deathBenefit: faceAmountLakh }
  };

  if (moPremium <= 0) return result;

  let currentFund = 0;
  
  for (let year = 1; year <= 20; year++) {
    const ageForYear = currentAge + year - 1;
    const costPer10k = getInsuranceCostPerTenThousand(ageForYear, gender);
    const moCost = faceAmountLakh * costPer10k;
    
    let feeRate = year <= period ? getFeeRate(year) : 0;
    const actualPayAmount = year <= period ? moPremium : 0;
    const refundAmount = (period === 10 && year >= 6 && year <= 10) ? (moPremium * getRefundRate(year)) : 0;

    for (let month = 1; month <= 12; month++) {
      const moRefund = refundAmount / 12;
      const netDailyPremium = actualPayAmount * (1 - feeRate) + moRefund - 100 - moCost;
      currentFund = currentFund * (1 + annualRate / 12) + netDailyPremium;
      if (currentFund < 0) currentFund = 0; 
    }

    if (year === 5) {
      result[5].assetAccumulation = currentFund / 10000;
      result[5].deathBenefit = faceAmountLakh + (currentFund / 10000); 
    }
    if (year === 10) {
      result[10].assetAccumulation = currentFund / 10000;
      result[10].deathBenefit = faceAmountLakh + (currentFund / 10000);
    }
    if (year === 20) {
      result[20].assetAccumulation = currentFund / 10000;
      result[20].deathBenefit = faceAmountLakh + (currentFund / 10000);
    }
  }

  return result;
};

export const calculateLumpSumPlan = (lumpAmountLakhStr, dividendRateStr, currentAge) => {
  const lumpAmountLakh = parseFloat(lumpAmountLakhStr) || 0;
  const dividendRate = (parseFloat(dividendRateStr) || 0) / 100;
  
  const leverage = getLumpSumLeverage(currentAge);
  const deathBenefit = lumpAmountLakh * leverage;
  
  const lumpAmount = lumpAmountLakh * 10000;
  const moDividend = (lumpAmount * dividendRate) / 12;
  const moDividendLakh = moDividend / 10000;
  
  return {
    immediate: {
      monthlyDividend: moDividend, // 元
      deathBenefit: deathBenefit // 萬
    },
    5: {
      accumulatedDividend: moDividendLakh * 12 * 5, // 萬
      capitalChange: 0,
      totalAssetIncrease: moDividendLakh * 12 * 5
    },
    10: {
      accumulatedDividend: moDividendLakh * 12 * 10,
      capitalChange: 0,
      totalAssetIncrease: moDividendLakh * 12 * 10
    },
    20: {
      accumulatedDividend: moDividendLakh * 12 * 20,
      capitalChange: 0,
      totalAssetIncrease: moDividendLakh * 12 * 20
    }
  };
};

export const calculateCombinedPlan = (monthlyPremiumStr, periodStr, annualRateStr, lumpAmountStr, dividendRateStr, currentAge, gender) => {
  const monthlyRes = calculateMonthlyPremiumPlan(monthlyPremiumStr, periodStr, annualRateStr, currentAge, gender);
  const lumpRes = calculateLumpSumPlan(lumpAmountStr, dividendRateStr, currentAge);
  
  const moPremium = parseFloat(monthlyPremiumStr) || 0;
  
  return {
    immediate: {
      monthlyDividend: lumpRes.immediate.monthlyDividend,
      monthlyPremiumExpense: moPremium,
      netCashFlowChange: lumpRes.immediate.monthlyDividend - moPremium,
      deathBenefit: monthlyRes.faceAmountLakh + lumpRes.immediate.deathBenefit
    },
    5: {
      accumulatedDividend: lumpRes[5].accumulatedDividend,
      assetAccumulation: monthlyRes[5].assetAccumulation,
      totalAssetIncrease: lumpRes[5].accumulatedDividend + monthlyRes[5].assetAccumulation,
      deathBenefit: monthlyRes[5].deathBenefit + lumpRes.immediate.deathBenefit
    },
    10: {
      accumulatedDividend: lumpRes[10].accumulatedDividend,
      assetAccumulation: monthlyRes[10].assetAccumulation,
      totalAssetIncrease: lumpRes[10].accumulatedDividend + monthlyRes[10].assetAccumulation,
      deathBenefit: monthlyRes[10].deathBenefit + lumpRes.immediate.deathBenefit
    },
    20: {
      accumulatedDividend: lumpRes[20].accumulatedDividend,
      assetAccumulation: monthlyRes[20].assetAccumulation,
      totalAssetIncrease: lumpRes[20].accumulatedDividend + monthlyRes[20].assetAccumulation,
      deathBenefit: monthlyRes[20].deathBenefit + lumpRes.immediate.deathBenefit
    }
  };
};
