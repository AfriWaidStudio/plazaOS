const fs = require('fs');

function replaceFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filePath, content);
}

replaceFile('src/routes/admin/calendar/data.ts', [
  { from: /mockCalendarEvents\.push\([^)]+\)/g, to: "" }
]);

replaceFile('src/routes/admin/maintenance/data.ts', [
  { from: /const priorityRank[\s\S]*?;\n/g, to: "" },
  { from: /const statusRank[\s\S]*?;\n/g, to: "" }
]);

replaceFile('src/routes/admin/payments/data.ts', [
  { from: /mockPayments\.unshift\([^)]+\)/g, to: "" }
]);

replaceFile('src/routes/admin/reminders/data.ts', [
  { from: /const statusRank[\s\S]*?;\n/g, to: "" },
  { from: /mockReminders\.unshift\([^)]+\)/g, to: "" }
]);

replaceFile('src/routes/admin/tenants/data.ts', [
  { from: /mockTenants\.unshift\([^)]+\)/g, to: "" },
  { from: /const idx = mockTenants\.findIndex\([\s\S]*?\)\s*if\s*\(idx\s*!==\s*-1\)\s*\{\s*mockTenants\[idx\]\s*=\s*updated\s*\}/g, to: "" },
  { from: /const idx = mockTenants\.findIndex\([\s\S]*?\)\s*if\s*\(idx\s*!==\s*-1\)\s*mockTenants\[idx\]\s*=\s*updated/g, to: "" }
]);

replaceFile('src/routes/admin/units/data.ts', [
  { from: /mockUnits\.unshift\([^)]+\)/g, to: "" },
  { from: /const idx = mockUnits\.findIndex\([\s\S]*?\)\s*if\s*\(idx\s*!==\s*-1\)\s*mockUnits\[idx\]\s*=\s*updated/g, to: "" }
]);

console.log('Fixed typescript errors part 2');
