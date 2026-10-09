const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Create pages directory
fs.mkdirSync(path.join(srcDir, 'components', 'pages'), { recursive: true });

// Move AdminTab
if (fs.existsSync(path.join(srcDir, 'AdminTab.jsx'))) {
    fs.renameSync(path.join(srcDir, 'AdminTab.jsx'), path.join(srcDir, 'components', 'tabs', 'AdminTab.jsx'));
}

// Move LoginPage
if (fs.existsSync(path.join(srcDir, 'LoginPage.jsx'))) {
    fs.renameSync(path.join(srcDir, 'LoginPage.jsx'), path.join(srcDir, 'components', 'pages', 'LoginPage.jsx'));
}

// Update App.jsx imports
let appContent = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf-8');
appContent = appContent.replace("import AdminTab from './AdminTab';", "import AdminTab from './components/tabs/AdminTab';");
appContent = appContent.replace("import LoginPage from './LoginPage';", "import LoginPage from './components/pages/LoginPage';");
fs.writeFileSync(path.join(srcDir, 'App.jsx'), appContent);

// Move mockData if it exists
if (fs.existsSync(path.join(srcDir, 'mockData.js'))) {
    fs.renameSync(path.join(srcDir, 'mockData.js'), path.join(srcDir, 'utils', 'mockData.js'));
    let appContent = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf-8');
    appContent = appContent.replace("import { mockGlossary } from './mockData.js';", "import { mockGlossary } from './utils/mockData.js';");
    fs.writeFileSync(path.join(srcDir, 'App.jsx'), appContent);
}

console.log("Rearranged loose files!");
