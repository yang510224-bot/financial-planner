import { calculatePMT, calculateInterestOnly, calculateCreditCardInterest } from './calculations';

export function generateFinancialReport(data) {
  const r = {
    assetTotal: 0,
    liabilityTotal: 0,
    netAsset: 0,
    incomeTotal: 0,
    expenseTotal: 0,
    netCashFlow: 0,
    
    cashStr: 0,
    savingsStr: 0,
    otherAssetStr: 0,
    
    creditCardDebtStr: 0,
  };

  // --- Assets ---
  r.cashStr = parseFloat(data.assets.cash || 0);
  r.assetTotal += r.cashStr;

  r.savingsStr = parseFloat(data.assets.savings?.amount || 0);
  r.assetTotal += r.savingsStr;

  data.assets.properties.forEach(p => {
    r.assetTotal += parseFloat(p.value || 0);
  });

  data.assets.vehicles.forEach(v => {
    r.assetTotal += parseFloat(v.value || 0);
  });

  if (data.assets.insurance?.hasInsurance) {
    r.assetTotal += parseFloat(data.assets.insurance.amount || 0);
  }
  
  if (data.assets.investments?.hasInvestments) {
    r.assetTotal += parseFloat(data.assets.investments.amount || 0);
  }

  if (data.assets.otherAssets?.hasOtherAssets) {
    r.assetTotal += parseFloat(data.assets.otherAssets.amount || 0);
  }

  // --- Liabilities ---
  let mortgageExpenseTotal = 0;
  data.assets.properties.forEach(p => {
    if (p.hasLoan && p.loans) {
      let loanAmount = 0;
      p.loans.forEach(loan => {
        loanAmount += parseFloat(loan.amount || 0);
        if (loan.loanType === '本息攤還') {
          mortgageExpenseTotal += calculatePMT(loan.amount, loan.rate, loan.years);
        } else {
          mortgageExpenseTotal += calculateInterestOnly(loan.amount, loan.rate);
        }
      });
      r.liabilityTotal += loanAmount;
    }
  });

  let vehicleExpenseTotal = 0;
  data.assets.vehicles.forEach(v => {
    if (v.hasLoan && v.loan) {
      r.liabilityTotal += parseFloat(v.loan.amount || 0);
      vehicleExpenseTotal += calculatePMT(v.loan.amount, v.loan.rate, v.loan.years);
    }
  });

  let personalLoanExpenseTotal = 0;
  data.liabilities.personalLoans.forEach(l => {
    r.liabilityTotal += parseFloat(l.amount || 0);
    personalLoanExpenseTotal += calculatePMT(l.amount, l.rate, l.years);
  });

  let ccExpenseTotal = 0;
  data.liabilities.creditCards.forEach(c => {
    if (c.hasDebt) {
      let ccDebt = 0;
      if (c.installmentsAmount) ccDebt += parseFloat(c.installmentsAmount);
      if (c.zeroIntAmount) ccDebt += parseFloat(c.zeroIntAmount);
      if (c.hasCirculating && c.circulatingAmount) ccDebt += parseFloat(c.circulatingAmount);
      r.creditCardDebtStr += ccDebt;
      r.liabilityTotal += ccDebt;

      if (c.installmentsPayment) ccExpenseTotal += parseFloat(c.installmentsPayment);
      if (c.zeroIntPayment) ccExpenseTotal += parseFloat(c.zeroIntPayment);
      if (c.hasCirculating && c.minPayment) ccExpenseTotal += parseFloat(c.minPayment);
      if (c.hasCirculating) {
         ccExpenseTotal += calculateCreditCardInterest(c.circulatingAmount, c.minPayment);
      }
    }
  });

  let otherLoanExpenseTotal = 0;
  data.liabilities.other.forEach(l => {
    r.liabilityTotal += parseFloat(l.amount || 0);
    otherLoanExpenseTotal += calculatePMT(l.amount, l.rate, l.years);
  });

  r.netAsset = r.assetTotal - r.liabilityTotal;

  // --- Cash Flows ---
  const active = parseFloat(data.income.active || 0);
  const passive = parseFloat(data.income.passive || 0);
  r.incomeTotal = active + passive;

  const living = parseFloat(data.expenses.living || 0);
  r.expenseTotal = mortgageExpenseTotal + vehicleExpenseTotal + personalLoanExpenseTotal + ccExpenseTotal + otherLoanExpenseTotal + living;

  r.netCashFlow = r.incomeTotal - r.expenseTotal;

  return r;
}
