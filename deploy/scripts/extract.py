import zipfile
import os
import sys

zip_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/zanburak-nuxt-output.zip'
dest_dir = sys.argv[2] if len(sys.argv) > 2 else '/var/www/zanburak-nuxt/.output'

print(f"Extracting {zip_path} -> {dest_dir}")
os.makedirs(dest_dir, exist_ok=True)

with zipfile.ZipFile(zip_path, 'r') as z:
    count = 0
    for m in z.infolist():
        rel = m.filename.replace('\\', '/').lstrip('/')
        if not rel:
            continue
        dest = os.path.join(dest_dir, rel)
        if m.is_dir() or rel.endswith('/'):
            os.makedirs(dest, exist_ok=True)
        else:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, 'wb') as f:
                f.write(z.read(m.filename))
            count += 1

print(f"Successfully extracted {count} files to {dest_dir}")
