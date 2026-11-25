const fs = require('fs');
const path = '/var/www/zanburak-nuxt/.output/server/node_modules/pinia/dist/pinia.js';

// Restore clean copy first by re-extracting from zip
const { execSync } = require('child_process');
execSync('unzip -p /var/www/zanburak-nuxt/.output/server/package.json > /dev/null 2>&1 || true');

// Let's read pinia.js
let content = fs.readFileSync(path, 'utf8');

// Target exact string:
// if (process.env.NODE_ENV !== "production" && !activePinia) throw new Error("[🍍]: \"getActivePinia()\" was called but there was no active Pinia. Are you trying to use a store before calling \"app.use(pinia)\"?\nSee https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.\nThis will fail in production.");
// pinia = activePinia;

const needle = 'if (process.env.NODE_ENV !== "production" && !activePinia)';
const idx = content.indexOf(needle);
console.log('INDEX OF NEEDLE:', idx);

if (idx !== -1) {
    const endNeedle = 'pinia = activePinia;';
    const endIdx = content.indexOf(endNeedle, idx);
    console.log('END INDEX:', endIdx);
    if (endIdx !== -1) {
        const fullToReplace = content.substring(idx, endIdx + endNeedle.length);
        console.log('REPLACING:\n' + fullToReplace);
        const safeCode = 'if (!activePinia) { setActivePinia(createPinia()); }\n\t\tpinia = activePinia;';
        content = content.replace(fullToReplace, safeCode);
        fs.writeFileSync(path, content, 'utf8');
        console.log('SUCCESSFULLY_REPLACED_SAFELY');
    }
}
