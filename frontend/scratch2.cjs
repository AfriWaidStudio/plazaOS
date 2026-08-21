const fs = require('fs');
const path = require('path');

const adminDir = './src/routes/admin';
const servicesDir = './src/lib/services';

const adminFiles = ['units/data.ts', 'tenants/data.ts', 'payments/data.ts', 'maintenance/data.ts', 'calendar/data.ts', 'reminders/data.ts'].map(f => path.join(adminDir, f));
const serviceFiles = ['paymentService.ts', 'maintenanceService.ts', 'announcementService.ts', 'notificationService.ts', 'profileService.ts'].map(f => path.join(servicesDir, f));

[...adminFiles, ...serviceFiles].forEach(p => {
  if (fs.existsSync(p)) {
    let text = fs.readFileSync(p, 'utf8');
    
    // Replace if (!import.meta.env.DEV) throw err; return mock... with throw err
    text = text.replace(/if\s*\(!import\.meta\.env\.DEV\)\s*throw\s*err[^}]*(\n\s*\})/gs, 'throw err');
    
    fs.writeFileSync(p, text);
  }
});
