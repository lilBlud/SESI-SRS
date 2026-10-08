const { execSync } = require('child_process');

try {
  console.log('Generating migration...');
  execSync('dotnet ef migrations add AddChartDataToGlossary', { 
    cwd: 'c:\\Users\\User\\OneDrive\\Desktop\\SESI SRS\\mobile-backend',
    stdio: 'inherit'
  });
  console.log('Migration generated.');
  
  console.log('Updating database...');
  execSync('dotnet ef database update', {
    cwd: 'c:\\Users\\User\\OneDrive\\Desktop\\SESI SRS\\mobile-backend',
    stdio: 'inherit'
  });
  console.log('Database updated.');
} catch (e) {
  console.error(e.message);
}
