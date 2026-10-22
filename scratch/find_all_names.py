import os

src_dir = r"mobile-frontend/src"
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.jsx', '.js')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fp:
                content = fp.read()
                lines = content.split('\n')
                for idx, line in enumerate(lines):
                    if 'Welcome' in line or 'preferredName' in line or 'displayName' in line:
                        print(f"{p}:{idx+1} {line.strip()[:100]}")
