from pathlib import Path
import re

p = Path(r"c:/zanburak/zanburak-nuxt/app/utils/routeMeta.js")
t = p.read_text(encoding="utf-8")

# These public routes were incorrectly marked requiresAuth by the generator
false_positives = [
    "discuss-index",
    "articles-index",
    "what-is-vip",
    "NotFound",
]

for name in false_positives:
    pattern = rf'"{name}":\s*\{{\s*"requiresAuth":\s*true\s*\}}'
    repl = f'"{name}": {{\n    "requiresAuth": false\n  }}'
    t2, n = re.subn(pattern, repl, t)
    print(name, "replacements", n)
    t = t2

p.write_text(t, encoding="utf-8")
print("done")
