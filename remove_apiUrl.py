import re
import glob

files = glob.glob('frontend/src/pages/**/*.jsx', recursive=True)

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # If the file uses api.get or api.post but also defines apiUrl, we can remove it.
    if ('api.get' in content or 'api.post' in content or 'api.delete' in content) and ('const apiUrl =' in content):
        # Only remove if it's not used in fetch or other places
        if 'fetch(' not in content:
            content = re.sub(r'^\s*const apiUrl = import\.meta\.env\.VITE_API_URL \|\| \'\';\n', '', content, flags=re.MULTILINE)
            content = re.sub(r'^\s*// Determine API URL.*?\n', '', content, flags=re.MULTILINE)
            
            with open(file_path, 'w') as f:
                f.write(content)

