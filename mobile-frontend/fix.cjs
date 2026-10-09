const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Fix Icons.jsx
const iconsPath = path.join(srcDir, 'components', 'ui', 'Icons.jsx');
if (fs.existsSync(iconsPath)) {
    let iconsContent = fs.readFileSync(iconsPath, 'utf-8');
    iconsContent = iconsContent.replace('export // ─── SVG Icons ───', '// ─── SVG Icons ───');
    fs.writeFileSync(iconsPath, iconsContent);
}

// Fix AdminTab.jsx
const adminTabPath = path.join(srcDir, 'components', 'tabs', 'AdminTab.jsx');
if (fs.existsSync(adminTabPath)) {
    let adminContent = fs.readFileSync(adminTabPath, 'utf-8');
    adminContent = adminContent.replace('import { CorporatePerformanceChart } from "./App";', 'import { CorporatePerformanceChart } from "../ui/UIComponents";');
    fs.writeFileSync(adminTabPath, adminContent);
}

console.log("Fixed compile errors!");
