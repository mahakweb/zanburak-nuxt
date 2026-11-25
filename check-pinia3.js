const fs = require('fs');
const path = '/var/www/zanburak-nuxt/.output/server/node_modules/pinia/dist/pinia.js';
let content = fs.readFileSync(path, 'utf8');
const target = 'if (process.env.NODE_ENV !== " production\ && !activePinia)';
const idx = content.indexOf(target);
console.log('TARGET_START_INDEX:', idx);
if (idx !== -1) {
 // Print 1000 characters starting from this index
 console.log(content.substring(idx - 100, idx + 400));
}
