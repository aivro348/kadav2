import re
import glob

files = [
    'frontend/src/pages/WaterConservationSurvey.jsx',
    'frontend/src/pages/NewIrrigationSurvey.jsx',
    'frontend/src/pages/SurveyList.jsx',
    'frontend/src/pages/IrrigationSurveyList.jsx',
    'frontend/src/pages/ViewSurvey.jsx',
    'frontend/src/pages/ViewIrrigationSurvey.jsx',
    'frontend/src/pages/IrrigationDashboard.jsx',
    'frontend/src/pages/WaterConservationSurveyList.jsx'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Replace single quotes containing template literals with backticks
    content = re.sub(r"await api\.get\('(/[^\']+?\$\{[^\']+?)'\)", r"await api.get(`\1`)", content)
    
    with open(file_path, 'w') as f:
        f.write(content)
