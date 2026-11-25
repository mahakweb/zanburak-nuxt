const fs = require('fs');
const path = '/var/www/zanburak-nuxt/.output/server/node_modules/pinia/dist/pinia.js';
let content = fs.readFileSync(path, 'utf8');
const idx = content.indexOf('was called but there was no active Pinia');
console.log('INDEX:', idx);
if (idx !== -1) {
    console.log(content.substring(idx - 60, idx + 250));
}
