from pathlib import Path

root = Path(r"c:/zanburak/zanburak-nuxt/app")
n = 0
replacements = [
    ('import { debounce } from "lodash";', 'import debounce from "lodash/debounce";'),
    ("import { debounce } from 'lodash';", "import debounce from 'lodash/debounce';"),
]
for p in list(root.rglob("*.vue")) + list(root.rglob("*.js")) + list(root.rglob("*.ts")):
    t = p.read_text(encoding="utf-8")
    t2 = t
    for a, b in replacements:
        t2 = t2.replace(a, b)
    if t2 != t:
        p.write_text(t2, encoding="utf-8")
        n += 1
print("updated", n)
