import { getInsuranceCostPerTenThousand, getFeeRate, getRefundRate } from './src/utils/calculations.js';

const moPremium = 5000;
const period = 10;
const annualRate = 0.08;
let currentAge = 34;
const gender = "M";

const faceAmountLakh = (moPremium * 500) / 10000; // 萬元 = 250
let currentFund = 0;

console.log("| 年度 | 實際年齡 | 年繳保費 | 年度前置費用 | 年度危險保費 | 年度帳管費 | 年度加值返還 | 當年真正入帳金額 | 當年所生利息 | 年末資產總值 |");
console.log("|---|---|---|---|---|---|---|---|---|---|");

for (let year = 1; year <= 10; year++) {
  const ageForYear = currentAge + year - 1;
  const costPer10k = getInsuranceCostPerTenThousand(ageForYear, gender);
  let feeRate = year <= period ? getFeeRate(year) : 0;
  const actualPayAmount = year <= period ? moPremium : 0;
  
  const moRefundRate = (period === 10 && year >= 6 && year <= 10) ? getRefundRate(year) : 0;
  const moRefund = moPremium * moRefundRate;
  
  let yearTotalPay = 0;
  let yearTotalFee = 0;
  let yearTotalCost = 0;
  let yearTotalAdmin = 0;
  let yearTotalRefund = 0;
  let yearTotalIn = 0;
  let fundAtStartOfYear = currentFund;

  for (let month = 1; month <= 12; month++) {
    const moFee = actualPayAmount * feeRate;

    let narOriginal = faceAmountLakh - (currentFund / 10000);
    let nar = narOriginal > 0 ? narOriginal : 0;
    const moCost = nar * costPer10k;
    
    // accounting
    yearTotalPay += actualPayAmount;
    yearTotalFee += moFee;
    yearTotalCost += moCost;
    yearTotalAdmin += 100;
    yearTotalRefund += moRefund;
    
    const netDailyPremium = actualPayAmount - moFee + moRefund - 100 - moCost;
    yearTotalIn += netDailyPremium;
    
    currentFund = currentFund * (1 + annualRate / 12) + netDailyPremium;
    if (currentFund < 0) currentFund = 0; 
  }
  
  const yearInterest = currentFund - fundAtStartOfYear - yearTotalIn;
  
  console.log(`| 第${year}年 | ${ageForYear}歲 | ${yearTotalPay.toLocaleString()} | -${yearTotalFee.toLocaleString()} | -${Math.round(yearTotalCost).toLocaleString()} | -${yearTotalAdmin.toLocaleString()} | +${Math.round(yearTotalRefund).toLocaleString()} | ${Math.round(yearTotalIn).toLocaleString()} | +${Math.round(yearInterest).toLocaleString()} | **${Math.round(currentFund).toLocaleString()}** |`);
}
