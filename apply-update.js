const fs = require('fs');
const { execSync } = require('child_process');

console.log('EXTRACTING ZIP...');
execSync('python3 -c "import zipfile; zipfile.ZipFile(\'/tmp/zanburak-nuxt-output.zip\').extractall(\'/var/www/zanburak-nuxt/.output\')"');
execSync('rm -f /tmp/zanburak-nuxt-output.zip');
console.log('ZIP EXTRACTED.');

console.log('PATCHING PINIA...');
execSync('node /tmp/patch-pinia-clean.js');

console.log('CHOWN AND RESTART...');
execSync('chown -R www-data:www-data /var/www/zanburak-nuxt');
execSync('systemctl restart zanburak-nuxt');
console.log('DONE!');
