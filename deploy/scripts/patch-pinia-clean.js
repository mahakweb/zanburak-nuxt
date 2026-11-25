const fs = require('fs');
const path = '/var/www/zanburak-nuxt/.output/server/node_modules/pinia/dist/pinia.js';

if (!fs.existsSync(path)) {
    console.log('Pinia path not found, skipping patch:', path);
    process.exit(0);
}

let content = fs.readFileSync(path, 'utf8');

const needle = 'if (process.env.NODE_ENV !== "production" && !activePinia)';
const idx = content.indexOf(needle);

if (idx !== -1) {
    const endNeedle = 'pinia = activePinia;';
    const endIdx = content.indexOf(endNeedle, idx);
    if (endIdx !== -1) {
        const fullToReplace = content.substring(idx, endIdx + endNeedle.length);
        const safeCode = 'if (!activePinia) { setActivePinia(createPinia()); }\n\t\tpinia = activePinia;';
        content = content.replace(fullToReplace, safeCode);
        fs.writeFileSync(path, content, 'utf8');
        console.log('SUCCESSFULLY_PATCHED_PINIA');
    } else {
        console.log('END_NEEDLE_NOT_FOUND');
    }
} else {
    console.log('NEEDLE_NOT_FOUND_OR_ALREADY_PATCHED');
}
