const fs = require('fs');
const path = '/var/www/zanburak-nuxt/.output/server/node_modules/pinia/dist/pinia.js';
if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    const target = 'if (process.env.NODE_ENV !== " production\ && !activePinia) throw new Error(\[??]: \\\getActivePinia()\\\ was called but there was no active Pinia. Are you trying to use a store before calling \\\app.use(pinia)\\\?\\nSee https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.\\nThis will fail in production.\);';
 if (content.includes(target)) {
 console.log('TARGET_FOUND');
 } else {
 console.log('TARGET_NOT_FOUND_EXACT');
 }
} else {
 console.log('FILE_NOT_FOUND');
}
