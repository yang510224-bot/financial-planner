// 計算月付金額 (本息攤還)
export const calculatePMT = (principalLakh, annualRatePercent, years, months = 0) => {
  if (!principalLakh || !annualRatePercent || (!years && !months)) return 0;
  
  const P = parseFloat(principalLakh); // 萬元
  const annualRate = parseFloat(annualRatePercent);
  const n = (parseInt(years || 0) * 12) + parseInt(months || 0); // 總期數(月)
  
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
  const maleRates = {
    15: 0.6267,
    16: 0.8467,
    17: 1.0500,
    18: 1.0733,
    19: 1.0875,
    20: 1.0942,
    21: 1.0958,
    22: 1.0933,
    23: 1.0892,
    24: 1.0842,
    25: 1.0817,
    26: 1.0825,
    27: 1.0892,
    28: 1.1025,
    29: 1.1258,
    30: 1.1608,
    31: 1.2100,
    32: 1.2750,
    33: 1.3583,
    34: 1.4583,
    35: 1.5717,
    36: 1.6975,
    37: 1.8342,
    38: 1.9783,
    39: 2.1333,
    40: 2.3008,
    41: 2.4833,
    42: 2.6833,
    43: 2.9033,
    44: 3.1425,
    45: 3.4033,
    46: 3.6842,
    47: 3.9867,
    48: 4.3125,
    49: 4.6642,
    50: 5.0467,
    51: 5.4650,
    52: 5.9233,
    53: 6.4275,
    54: 6.9833,
    55: 7.5983,
    56: 8.2792,
    57: 9.0325,
    58: 9.8667,
    59: 10.7867,
    60: 11.7983,
    61: 12.9067,
    62: 14.1183,
    63: 15.4400,
    64: 16.8842,
    65: 18.4642,
    66: 20.1942,
    67: 22.0875,
    68: 24.1600,
    69: 26.4292,
    70: 28.9150,
    71: 31.6358,
    72: 34.6125,
    73: 37.8633,
    74: 41.4175,
    75: 45.3025,
    76: 49.5475,
    77: 54.1800,
    78: 59.2308,
    79: 64.7383,
    80: 70.7408,
    81: 77.2783,
    82: 84.3900,
    83: 92.1183,
    84: 100.5092,
    85: 109.6133,
    86: 119.4792,
    87: 130.1567,
    88: 141.6942,
    89: 154.1417,
    90: 167.5458,
    91: 181.9567,
    92: 197.4225,
    93: 213.9858,
    94: 231.6692,
    95: 250.4908,
    96: 270.4658,
    97: 291.6133,
    98: 313.9308,
    99: 337.3458,
    100: 361.7658,
    101: 387.1000,
    102: 413.2567,
    103: 440.1458,
    104: 467.6875,
    105: 495.8058,
    106: 524.4225,
    107: 553.4600,
    108: 581.7317,
    109: 609.4867,
    110: 833.3333,
  };
  const femaleRates = {
    15: 0.2867,
    16: 0.3267,
    17: 0.3608,
    18: 0.4008,
    19: 0.4275,
    20: 0.4417,
    21: 0.4467,
    22: 0.4442,
    23: 0.4375,
    24: 0.4292,
    25: 0.4225,
    26: 0.4200,
    27: 0.4250,
    28: 0.4392,
    29: 0.4633,
    30: 0.4942,
    31: 0.5317,
    32: 0.5733,
    33: 0.6192,
    34: 0.6683,
    35: 0.7208,
    36: 0.7758,
    37: 0.8342,
    38: 0.8950,
    39: 0.9608,
    40: 1.0333,
    41: 1.1133,
    42: 1.2042,
    43: 1.3058,
    44: 1.4225,
    45: 1.5558,
    46: 1.7075,
    47: 1.8808,
    48: 2.0758,
    49: 2.2892,
    50: 2.5142,
    51: 2.7450,
    52: 2.9767,
    53: 3.2067,
    54: 3.4500,
    55: 3.7242,
    56: 4.0483,
    57: 4.4392,
    58: 4.9125,
    59: 5.4617,
    60: 6.0775,
    61: 6.7508,
    62: 7.4717,
    63: 8.2350,
    64: 9.0558,
    65: 9.9517,
    66: 10.9417,
    67: 12.0442,
    68: 13.2783,
    69: 14.6567,
    70: 16.1925,
    71: 17.8983,
    72: 19.7875,
    73: 21.8733,
    74: 24.1800,
    75: 26.7325,
    76: 29.5550,
    77: 32.6733,
    78: 36.1142,
    79: 39.9133,
    80: 44.1100,
    81: 48.7408,
    82: 53.8450,
    83: 59.4633,
    84: 65.6483,
    85: 72.4550,
    86: 79.9375,
    87: 88.1525,
    88: 97.1558,
    89: 107.0158,
    90: 117.8008,
    91: 129.5808,
    92: 142.4242,
    93: 156.4008,
    94: 171.5708,
    95: 187.9967,
    96: 205.7392,
    97: 224.8583,
    98: 245.4000,
    99: 267.3408,
    100: 290.6425,
    101: 315.2658,
    102: 341.1717,
    103: 368.3225,
    104: 396.6917,
    105: 426.2508,
    106: 456.9758,
    107: 488.8392,
    108: 520.4650,
    109: 552.1567,
    110: 833.3333,
  };

  const rates = isMale ? maleRates : femaleRates;
  if(age < 15) return rates[15];
  if(age > 110) return rates[110];
  return rates[age] || rates[15];
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
  if (year === 6) return 0.10;
  if (year === 7) return 0.20;
  if (year === 8) return 0.20;
  if (year === 9) return 0.40;
  if (year === 10) return 0.60;
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
    
    let feeRate = year <= period ? getFeeRate(year) : 0;
    const actualPayAmount = year <= period ? moPremium : 0;
    
    const moRefundRate = (period === 10 && year >= 6 && year <= 10) ? getRefundRate(year) : 0;
    const moRefund = moPremium * moRefundRate;

    for (let month = 1; month <= 12; month++) {
      let narOriginal = faceAmountLakh - (currentFund / 10000);
      let nar = narOriginal > 0 ? narOriginal : 0;
      const moCost = nar * costPer10k;

      const netDailyPremium = actualPayAmount * (1 - feeRate) + moRefund - 100 - moCost;
      currentFund = currentFund * (1 + annualRate / 12) + netDailyPremium;
      if (currentFund < 0) currentFund = 0; 
    }

    if (year === 5) {
      result[5].assetAccumulation = currentFund / 10000;
      result[5].deathBenefit = Math.max(faceAmountLakh, currentFund / 10000); 
    }
    if (year === 10) {
      result[10].assetAccumulation = currentFund / 10000;
      result[10].deathBenefit = Math.max(faceAmountLakh, currentFund / 10000);
    }
    if (year === 20) {
      result[20].assetAccumulation = currentFund / 10000;
      result[20].deathBenefit = Math.max(faceAmountLakh, currentFund / 10000);
    }
  }

  return result;
};

export const calculateLumpSumPlan = (ownFundLakhStr, borrowedFundLakhStr, borrowedRateStr, dividendRateStr, currentAge) => {
  const ownFundLakh = parseFloat(ownFundLakhStr) || 0;
  const borrowedFundLakh = parseFloat(borrowedFundLakhStr) || 0;
  const borrowedRate = (parseFloat(borrowedRateStr) || 0) / 100;
  const dividendRate = (parseFloat(dividendRateStr) || 0) / 100;
  
  const lumpAmountLakh = ownFundLakh + borrowedFundLakh;
  
  const leverage = getLumpSumLeverage(currentAge);
  const deathBenefit = lumpAmountLakh * leverage;
  
  const lumpAmount = lumpAmountLakh * 10000;
  const borrowedAmount = borrowedFundLakh * 10000;
  
  const moDividend = (lumpAmount * dividendRate) / 12; // 元
  const moDebtInterest = (borrowedAmount * borrowedRate) / 12; // 元
  const netMoCashFlow = moDividend - moDebtInterest; // 元
  
  const netMoCashFlowLakh = netMoCashFlow / 10000;
  
  return {
    immediate: {
      monthlyDividend: moDividend, // 元
      monthlyDebtInterest: moDebtInterest, // 元
      netMonthlyCashFlow: netMoCashFlow, // 元
      deathBenefit: deathBenefit // 萬
    },
    5: {
      accumulatedDividend: netMoCashFlowLakh * 12 * 5, // 萬
      capitalChange: 0,
      totalAssetIncrease: netMoCashFlowLakh * 12 * 5
    },
    10: {
      accumulatedDividend: netMoCashFlowLakh * 12 * 10,
      capitalChange: 0,
      totalAssetIncrease: netMoCashFlowLakh * 12 * 10
    },
    20: {
      accumulatedDividend: netMoCashFlowLakh * 12 * 20,
      capitalChange: 0,
      totalAssetIncrease: netMoCashFlowLakh * 12 * 20
    }
  };
};

export const calculateCombinedPlan = (monthlyPremiumStr, periodStr, annualRateStr, ownFundLakhStr, borrowedFundLakhStr, borrowedRateStr, dividendRateStr, currentAge, gender) => {
  const monthlyRes = calculateMonthlyPremiumPlan(monthlyPremiumStr, periodStr, annualRateStr, currentAge, gender);
  const lumpRes = calculateLumpSumPlan(ownFundLakhStr, borrowedFundLakhStr, borrowedRateStr, dividendRateStr, currentAge);
  
  const moPremium = parseFloat(monthlyPremiumStr) || 0;
  
  return {
    immediate: {
      monthlyDividend: lumpRes.immediate.monthlyDividend,
      monthlyDebtInterest: lumpRes.immediate.monthlyDebtInterest,
      monthlyPremiumExpense: moPremium,
      netCashFlowChange: lumpRes.immediate.netMonthlyCashFlow - moPremium,
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
