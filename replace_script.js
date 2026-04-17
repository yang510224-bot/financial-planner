const fs = require('fs');

let content = fs.readFileSync('src/utils/calculations.js', 'utf8');
const newFee = fs.readFileSync('../feeout.js', 'utf8');

const regex = /export const getInsuranceCostPerTenThousand = [\s\S]*?};\r?\n/;

if (regex.test(content)) {
    content = content.replace(regex, newFee + '\n');
    fs.writeFileSync('src/utils/calculations.js', content);
    console.log('Successfully replaced getInsuranceCostPerTenThousand');
} else {
    console.log('Regex did not match');
}
