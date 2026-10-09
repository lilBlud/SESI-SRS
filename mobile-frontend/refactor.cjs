const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const content = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf-8');

const markers = {
    idxConstants: content.indexOf('const API_BASE'),
    idxIcons: content.indexOf('// ─── SVG Icons'),
    idxBookmarks: content.indexOf('function useBookmarks()'),
    idxSlider: content.indexOf('function PostImageSlider'),
    idxHome: content.indexOf('function HomeTab('),
    idxGlossary: content.indexOf('function GlossaryTab('),
    idxQuiz: content.indexOf('function QuizTab('),
    idxProfile: content.indexOf('function ProfileTab('),
    idxApp: content.indexOf('export default function App()'),
    idxAppAlt: content.indexOf('function App()')
};

for (const [key, val] of Object.entries(markers)) {
    if (val === -1 && key !== 'idxApp' && key !== 'idxAppAlt') console.error(`Failed to find marker: ${key}`);
}

const idxConstants = markers.idxConstants;
const idxIcons = markers.idxIcons;
const idxBookmarks = markers.idxBookmarks;
const idxSlider = markers.idxSlider;
const idxHome = markers.idxHome;
const idxGlossary = markers.idxGlossary;
const idxQuiz = markers.idxQuiz;
const idxProfile = markers.idxProfile;
const idxApp = markers.idxApp !== -1 ? markers.idxApp : markers.idxAppAlt;

if ([idxConstants, idxIcons, idxBookmarks, idxSlider, idxHome, idxGlossary, idxQuiz, idxProfile, idxApp].includes(-1)) {
    console.error("Failed to find one or more markers!");
    process.exit(1);
}

// 1. Extract pieces
const imports = content.substring(0, content.indexOf('// --- MOCK API'));
const mockApi = content.substring(content.indexOf('// --- MOCK API'), idxConstants);

const partConstants = content.substring(idxConstants, idxIcons);
const partIcons = content.substring(idxIcons, idxBookmarks);
const partHooks = content.substring(idxBookmarks, idxSlider);
const partUI = content.substring(idxSlider, idxHome);
const partHome = content.substring(idxHome, idxGlossary);
const partGlossary = content.substring(idxGlossary, idxQuiz);
const partQuiz = content.substring(idxQuiz, idxProfile);
const partProfile = content.substring(idxProfile, idxApp);
const partApp = content.substring(idxApp);

// 2. Create directories
['utils', 'hooks', 'components/ui', 'components/tabs'].forEach(dir => {
    fs.mkdirSync(path.join(srcDir, dir), { recursive: true });
});

// 3. Write individual files

// utils/constants.js
fs.writeFileSync(path.join(srcDir, 'utils', 'constants.js'), 
partConstants
    .replace('const API_BASE', 'export const API_BASE')
    .replace('const currentMonth', 'export const currentMonth')
    .replace('const CATEGORIES', 'export const CATEGORIES')
    .replace('const getCatMeta', 'export const getCatMeta')
    .replace('const CAT_COLORS', 'export const CAT_COLORS')
    .replace('const getColor', 'export const getColor')
);

// hooks/useBookmarks.js
fs.writeFileSync(path.join(srcDir, 'hooks', 'useBookmarks.js'), 
`import { useState } from 'react';\n\nexport ${partHooks.replace('function useBookmarks', 'function useBookmarks')}`);

// components/ui/Icons.jsx
fs.writeFileSync(path.join(srcDir, 'components', 'ui', 'Icons.jsx'), 
`import React from 'react';\n\nexport ${partIcons
    .replace(/const HomeIcon/g, 'export const HomeIcon')
    .replace(/const BookIcon/g, 'export const BookIcon')
    .replace(/const QuizIcon/g, 'export const QuizIcon')
    .replace(/const ProfileIcon/g, 'export const ProfileIcon')
    .replace(/function FloatingParticles/g, 'export function FloatingParticles')
    .replace(/async function saveImage/g, 'export async function saveImage')}`);

// components/ui/UIComponents.jsx (PostImageSlider, CorporatePerformanceChart)
fs.writeFileSync(path.join(srcDir, 'components', 'ui', 'UIComponents.jsx'), 
`import React, { useState } from 'react';\nimport { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';\n\nexport ${partUI}`);

// components/tabs/HomeTab.jsx
fs.writeFileSync(path.join(srcDir, 'components', 'tabs', 'HomeTab.jsx'), 
`import React, { useState, useEffect } from 'react';\nimport { CorporatePerformanceChart, PostImageSlider } from '../ui/UIComponents';\nimport { API_BASE, currentMonth, CATEGORIES, CAT_COLORS, getColor, getCatMeta } from '../../utils/constants';\nimport { saveImage } from '../ui/Icons';\n\nexport ${partHome}`);

// components/tabs/GlossaryTab.jsx
fs.writeFileSync(path.join(srcDir, 'components', 'tabs', 'GlossaryTab.jsx'), 
`import React, { useState } from 'react';\nimport { CATEGORIES, CAT_COLORS } from '../../utils/constants';\n\nexport ${partGlossary}`);

// components/tabs/QuizTab.jsx
fs.writeFileSync(path.join(srcDir, 'components', 'tabs', 'QuizTab.jsx'), 
`import React, { useState, useEffect } from 'react';\nimport { API_BASE, currentMonth } from '../../utils/constants';\n\nexport ${partQuiz}`);

// components/tabs/ProfileTab.jsx
fs.writeFileSync(path.join(srcDir, 'components', 'tabs', 'ProfileTab.jsx'), 
`import React, { useState, useEffect } from 'react';\nimport { API_BASE } from '../../utils/constants';\n\nexport ${partProfile}`);

// App.jsx (Main Layout)
const newAppJsx = 
`${imports}
import { HomeIcon, BookIcon, QuizIcon, ProfileIcon, FloatingParticles } from './components/ui/Icons';
import { useBookmarks } from './hooks/useBookmarks';
import HomeTab from './components/tabs/HomeTab';
import GlossaryTab from './components/tabs/GlossaryTab';
import QuizTab from './components/tabs/QuizTab';
import ProfileTab from './components/tabs/ProfileTab';

${mockApi}

${partApp}
`;
fs.writeFileSync(path.join(srcDir, 'App.jsx'), newAppJsx);

console.log("Refactoring complete!");
