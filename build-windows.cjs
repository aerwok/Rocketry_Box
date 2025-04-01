// build-windows.cjs - Special build script for Windows environments
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure the UI components directory has an index.js file
const uiComponentsDir = path.join(__dirname, 'src', 'components', 'ui');
const indexFilePath = path.join(uiComponentsDir, 'index.ts');

// Check if the directory exists
if (!fs.existsSync(uiComponentsDir)) {
  console.error(`Components directory doesn't exist: ${uiComponentsDir}`);
  process.exit(1);
}

// Make sure index.ts exists
if (!fs.existsSync(indexFilePath)) {
  console.log('Creating UI components index file...');
  
  // Get all TypeScript files in the UI directory
  const files = fs.readdirSync(uiComponentsDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
    .filter(file => file !== 'index.ts')
    .map(file => file.replace(/\.[^/.]+$/, '')); // Remove extension
  
  // Create export statements
  const exportStatements = files.map(file => `export * from './${file}'`).join('\n');
  const indexContent = `// Export all UI components\n${exportStatements}`;
  
  // Write the index file
  fs.writeFileSync(indexFilePath, indexContent);
  console.log('UI components index file created successfully!');
}

console.log('Running TypeScript compiler...');
const tsc = spawn('npx', ['tsc', '-b', '--force'], { stdio: 'inherit', shell: true });

tsc.on('close', (code) => {
  if (code !== 0) {
    console.error(`TypeScript compilation failed with code ${code}`);
    process.exit(code);
  }
  
  console.log('Running Vite build...');
  const vite = spawn('npx', ['vite', 'build'], { stdio: 'inherit', shell: true });
  
  vite.on('close', (code) => {
    if (code !== 0) {
      console.error(`Vite build failed with code ${code}`);
      process.exit(code);
    }
    
    console.log('Build completed successfully!');
  });
}); 