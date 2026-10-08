import re
from pathlib import Path

root = Path(r"c:/zanburak/zanburak-nuxt")
nm = root / "node_modules"
app = root / "app"
pkgs = set()
pat = re.compile(r"""from\s+['\"]([^'\"]+)['\"]|require\(\s*['\"]([^'\"]+)['\"]\s*\)""")
for p in list(app.rglob("*.vue")) + list(app.rglob("*.js")) + list(app.rglob("*.ts")):
    try:
        t = p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    for m in pat.finditer(t):
        spec = m.group(1) or m.group(2)
        if not spec or spec.startswith((".", "~", "#", "@/", "virtual:", "\0")):
            continue
        if spec.startswith("@"):
            parts = spec.split("/")
            name = "/".join(parts[:2]) if len(parts) > 1 else spec
        else:
            name = spec.split("/")[0]
        pkgs.add(name)

missing = []
for name in sorted(pkgs):
    if not (nm / name).exists():
        missing.append(name)
print("MISSING", len(missing))
for m in missing:
    print(m)
print("TOTAL_IMPORTS", len(pkgs))
