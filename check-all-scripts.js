const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find all non-module script blocks
let pos = 0;
let scriptNum = 0;
while (true) {
  const startTag = content.indexOf('<script>', pos);
  if (startTag === -1) break;
  const start = startTag + 8;
  const end = content.indexOf('</script>', start);
  if (end === -1) break;
  const script = content.substring(start, end);
  scriptNum++;
  
  try {
    new Function(script);
    console.log(`Script ${scriptNum}: OK (${script.length} chars)`);
  } catch(e) {
    console.log(`Script ${scriptNum}: ERROR - ${e.message}`);
    // Find line number
    const lines = script.split('\n');
    const errLine = parseInt((e.stack.match(/<anonymous>:(\d+)/) || [])[1] || 0);
    if (errLine > 0) {
      for (let i = Math.max(0, errLine - 3); i <= Math.min(lines.length - 1, errLine + 1); i++) {
        console.log(`  Line ${i+1}: ${lines[i].substring(0, 100)}`);
      }
    }
  }
  pos = end + 9;
}
