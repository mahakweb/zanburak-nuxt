const fs = require('fs');
const path = '/var/www/zanburak-nuxt/.output/server/node_modules/pinia/dist/pinia.js';
let content = fs.readFileSync(path, 'utf8');
const idx = 44813;
console.log(content.substring(idx - 150, idx + 400));
