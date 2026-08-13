const fs = require('fs');
const path = require('path');

const adminDir = './src/routes/admin';
const servicesDir = './src/lib/services';

const adminFiles = ['units/data.ts', 'tenants/data.ts', 'payments/data.ts', 'maintenance/data.ts', 'calendar/data.ts', 'reminders/data.ts'].map(f => path.join(adminDir, f));
const serviceFiles = ['paymentService.ts', 'maintenanceService.ts', 'announcementService.ts', 'notificationService.ts', 'profileService.ts'].map(f => path.join(servicesDir, f));

[...adminFiles, ...serviceFiles].forEach(p => {
  if (fs.existsSync(p)) {
    let text = fs.readFileSync(p, 'utf8');
    
    // Remove mockData imports
    text = text.replace(/import\s+\{.*\}\s+from\s+['"].*mockData['"]\n?/g, '');
    
    // Remove mock functions (mockGetUnits, etc)
    text = text.replace(/function\s+mock[A-Z]\w*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{.*?\n\}\n\n?/gs, '');
    
    // Remove try-catch blocks returning mock data
    text = text.replace(/try\s*\{\s*(return\s+await\s+api\.[^\n]+)\s*\}\s*catch\s*\([^)]*\)\s*\{\s*if\s*\(!import\.meta\.env\.DEV\)\s*throw\s*err.*?\n\s*\}/gs, '');
    
    fs.writeFileSync(p, text);
  }
});
