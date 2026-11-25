const fs = require('fs');
const path = '/var/www/zanburak-nuxt/.output/server/node_modules/pinia/dist/pinia.js';
let content = fs.readFileSync(path, 'utf8');
const idx = content.indexOf('was called but there was no active Pinia');
console.log('FOUND BAD STRING AT:', idx);
if (idx !== -1) {
    const toReplace = content.substring(idx - 62, idx + 269);
    console.log('REPLACING:', toReplace);
    const replacement = 'if (!activePinia) setActivePinia(createPinia());\n\t\tpinia = activePinia;';
    content = content.replace(toReplace, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log('SUCCESSFULLY_PATCHED_PINIA');
}
