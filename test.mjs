import { calculateMonthlyPremiumPlan } from './src/utils/calculations.js';

const res = calculateMonthlyPremiumPlan("5000", "10", "5", 34, "男");
console.log("=== 計算結果 (定期定額 10年期) ===");
console.log("總投入 (10年):", 5000 * 12 * 10, "元");
console.log("5年後累積資產 (萬):", res[5].assetAccumulation.toFixed(4));
console.log("10年後累積資產 (萬):", res[10].assetAccumulation.toFixed(4));
console.log("5年後身故保障 (萬):", res[5].deathBenefit.toFixed(4));
console.log("10年後身故保障 (萬):", res[10].deathBenefit.toFixed(4));

const res5 = calculateMonthlyPremiumPlan("5000", "5", "5", 34, "男");
console.log("\n=== 計算結果 (定期定額 5年期) ===");
console.log("總投入 (5年):", 5000 * 12 * 5, "元");
console.log("5年後累積資產 (萬):", res5[5].assetAccumulation.toFixed(4));
console.log("10年後累積資產 (萬):", res5[10].assetAccumulation.toFixed(4));
console.log("5年後身故保障 (萬):", res5[5].deathBenefit.toFixed(4));
console.log("10年後身故保障 (萬):", res5[10].deathBenefit.toFixed(4));
