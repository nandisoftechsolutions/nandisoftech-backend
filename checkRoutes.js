const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');

function findInvalidRoutePaths(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const routePathRegex = /router\.(get|post|put|delete|patch)\(\s*(['"`])([^'"`]+)\2/gm;

  let match;
  const invalids = [];

  while ((match = routePathRegex.exec(content)) !== null) {
    const routePath = match[3];

    // Check if routePath looks like a URL or has invalid param syntax
    if (/https?:\/\//.test(routePath)) {
      invalids.push({ routePath, reason: 'Contains URL' });
    } else if (/:$/.test(routePath)) {
      invalids.push({ routePath, reason: 'Ends with colon (missing param name)' });
    } else if (/\/:[^\/]*[^a-zA-Z0-9_]/.test(routePath)) {
      invalids.push({ routePath, reason: 'Invalid param name' });
    } else if (/\/:$/.test(routePath)) {
      invalids.push({ routePath, reason: 'Ends with colon (missing param name)' });
    }
  }
  return invalids;
}

fs.readdirSync(routesDir).forEach(file => {
  const fullPath = path.join(routesDir, file);
  if (fs.lstatSync(fullPath).isFile() && file.endsWith('.js')) {
    const invalids = findInvalidRoutePaths(fullPath);
    if (invalids.length) {
      console.log(`\nFound invalid route paths in ${file}:`);
      invalids.forEach(({ routePath, reason }) => {
        console.log(` - ${routePath}  (${reason})`);
      });
    }
  }
});
