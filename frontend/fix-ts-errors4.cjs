const fs = require('fs');

const files = [
  'src/routes/admin/payments/data.ts',
  'src/routes/admin/reminders/data.ts',
  'src/routes/admin/tenants/data.ts',
  'src/routes/admin/units/data.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/try \{[\s\S]*?\} catch \(err\) \{[\s\S]*?if \(!import\.meta\.env\.DEV\) throw err[\s\S]*?\}/g, (match) => {
    // Extract the content inside the try block
    const tryBlockMatch = match.match(/try \{\s*([\s\S]*?)\s*\} catch/);
    if (tryBlockMatch && tryBlockMatch[1]) {
      return tryBlockMatch[1];
    }
    return match;
  });
  fs.writeFileSync(file, content);
});

console.log('Fixed try/catch blocks');
