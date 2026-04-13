const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<script>') + 8;
const end = content.indexOf('</script>', start);
const script = content.substring(start, end);

fs.writeFileSync('/tmp/test-script.js', script);
