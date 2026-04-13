const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<script>') + 8;
const end = content.indexOf('</script>', start);
const script = content.substring(start, end);

// Check for broken color values
const lines = script.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (/#[0-9a-fA-F]{6}[a-zA-Z]/.test(line)) {
    console.log('Broken color at line ' + (i+1) + ': ' + line.trim().substring(0, 120));
  }
}

// Also look for standalone 're' that's not inside a string
// by searching for patterns like `: re,` or `= re;` or `(re,` etc
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Skip lines that are mostly string content (have quotes)
  if (/[,=\(]\s*re\s*[,\);]/.test(line)) {
    console.log('Possible re error at line ' + (i+1) + ': ' + line.trim().substring(0, 120));
  }
}
