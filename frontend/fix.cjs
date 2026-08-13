const fs = require('fs');
const path = require('path');
const adminDir = path.join('src', 'routes', 'admin');
const dirs = fs.readdirSync(adminDir).filter(d => fs.statSync(path.join(adminDir, d)).isDirectory());
for (const dir of dirs) {
  const file = path.join(adminDir, dir, 'data.ts');
  if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    
    // Fix getList functions
    text = text.replace(/query\.set\('pageSize', String\(pageSize\)\)\n\n\s*\}/g, "query.set('pageSize', String(pageSize))\n\n  return await api.get(/" + dir + "? + query.toString())\n}");
    
    // Fix getSingle functions
    text = text.replace(/export async function get([A-Z]\w+)\((\w+)Id: string\): Promise<([^>]+) \| undefined> \{\s*\n\s*\}/g, (match, p1, p2, p3) => {
      return "export async function get" + p1 + "(" + p2 + "Id: string): Promise<" + p3 + " | undefined> {\n  return await api.get(/" + dir + "/)\n}";
    });

    // Fix updateSingle functions
    text = text.replace(/export async function update([A-Z]\w+)\((\w+)Id: string, updates: ([^)]+)\): Promise<([^>]+) \| undefined> \{\s*\n\s*\}/g, (match, p1, p2, p3, p4) => {
      return "export async function update" + p1 + "(" + p2 + "Id: string, updates: " + p3 + "): Promise<" + p4 + " | undefined> {\n  return await api.patch(/" + dir + "/, updates)\n}";
    });

    fs.writeFileSync(file, text);
  }
}
