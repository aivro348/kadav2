const fs = require('fs');
const glob = require('glob');

const files = [
  'frontend/src/pages/NewSurvey.jsx',
  'frontend/src/pages/WaterConservationSurvey.jsx',
  'frontend/src/pages/NewIrrigationSurvey.jsx',
  'frontend/src/pages/SurveyList.jsx',
  'frontend/src/pages/IrrigationSurveyList.jsx',
  'frontend/src/pages/ViewSurvey.jsx',
  'frontend/src/pages/ViewIrrigationSurvey.jsx',
  'frontend/src/pages/IrrigationDashboard.jsx',
  'frontend/src/pages/WaterConservationSurveyList.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Ensure import { api } from '../lib/api'; exists
  if (!content.includes('import { api }')) {
    content = content.replace(/(import React.*?;\n)/, "$1import { api } from '../lib/api';\n");
    changed = true;
  }

  // Replace GET requests
  const getRegex = /const response = await fetch\(`\$\{apiUrl\}\/php-backend\/api\/(.+?)`\);/g;
  if (getRegex.test(content)) {
    content = content.replace(getRegex, "const response = await api.get('/$1');\n        const data = response; // mock response.json() if used\n");
    changed = true;
  }

  // Replace DELETE requests
  // ... this is getting complex because they check response.ok and call response.json()
  // Since api.get/post already throw on error and parse JSON, we need to completely rewrite the try/catch blocks.
});
