from pathlib import Path

root = Path(__file__).resolve().parents[1]

# index page MasterPage import
for rel in [
    "app/pages/index.vue",
    "app/views/page/IndexPage.vue",
]:
    p = root / rel
    if not p.exists():
        print("missing", rel)
        continue
    t = p.read_text(encoding="utf-8")
    old = 'import MasterPage from "./layouts/MasterPage.vue";'
    new = 'import MasterPage from "@/views/page/layouts/MasterPage.vue";'
    if old in t:
        p.write_text(t.replace(old, new), encoding="utf-8")
        print("fixed MasterPage", rel)
    else:
        print("MasterPage ok/skip", rel)

# easymde css
p = root / "app/views/components/editor/EditorComponent.vue"
t = p.read_text(encoding="utf-8")
old = '@import "~easymde/dist/easymde.min.css";'
new = '@import "easymde/dist/easymde.min.css";'
if old in t:
    p.write_text(t.replace(old, new), encoding="utf-8")
    print("fixed easymde css")
else:
    print("easymde css skip", "~easymde" in t)

# verify no dual script setup remain
pages = root / "app/pages"
for p in pages.rglob("*.vue"):
    n = p.read_text(encoding="utf-8").count("<script setup>")
    if n > 1:
        print("DUAL SETUP", p.relative_to(root), n)
print("done")
