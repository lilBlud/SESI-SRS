with open(r'mobile-frontend/src/components/tabs/HomeTab.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'USERNAME' in line or 'preferredName' in line or 'Welcome back' in line:
        print(f'{i+1}: {line.strip()}')
