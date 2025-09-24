/* eslint-disable no-console */

/**
 * Simple JavaScript minification for AEM project
 * This removes comments, extra whitespace, and console.log statements for production
 */
const fs = require('fs');
const path = require('path');

function minifyJS(content) {
  return content
    // Remove single-line comments
    .replace(/\/\/.*$/gm, '')
    // Remove multi-line comments (but preserve license comments)
    .replace(/\/\*(?!\*\/\s*eslint|!\s*\*\s*(stylelint|@|eslint))[\s\S]*?\*\//gm, '')
    // Remove console.log statements in production
    .replace(/console\.(log|debug|info|warn)\([^)]*\);?\s*/gm, '')
    // Remove excessive whitespace and newlines
    .replace(/\n\s*\n/gm, '\n')
    // Remove leading/trailing whitespace from lines
    .replace(/^\s+|\s+$/gm, (match, offset, string) => {
      // Keep indentation for readability, just trim excessive spaces
      const line = string.substring(string.lastIndexOf('\n', offset) + 1, string.indexOf('\n', offset));
      if (line.trim() === '') return '';
      return match.replace(/^\s+/, '  ').replace(/\s+$/, '');
    })
    // Compress multiple spaces to single space
    .replace(/\s{2,}/g, ' ')
    // Remove trailing semicolons before closing braces (optional optimization)
    .replace(/;\s*}/g, '}');
}

function minifyFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const minified = minifyJS(content);
    
    // Only write if content changed and size reduction is meaningful
    if (minified !== content && minified.length < content.length * 0.95) {
      const originalSize = Buffer.byteLength(content, 'utf8');
      const minifiedSize = Buffer.byteLength(minified, 'utf8');
      const savings = originalSize - minifiedSize;
      
      // Create backup
      const backupPath = `${filePath}.backup`;
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, content);
      }
      
      // Write minified version
      fs.writeFileSync(filePath, minified);
      console.log(`✓ Minified ${filePath}: ${originalSize} → ${minifiedSize} bytes (saved ${savings} bytes)`);
      
      return savings;
    }
    return 0;
  } catch (error) {
    console.error(`✗ Error minifying ${filePath}:`, error.message);
    return 0;
  }
}

function findJSFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir);
  
  // eslint-disable-next-line no-restricted-syntax
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      files.push(...findJSFiles(fullPath));
    } else if (stat.isFile() && entry.endsWith('.js') && !entry.endsWith('.min.js') && entry !== 'minify-js.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
if (require.main === module) {
  console.log('🔧 Starting JavaScript minification...\n');
  
  const startTime = Date.now();
  let totalSavings = 0;
  let filesProcessed = 0;
  
  // Find all JS files in the project
  const jsFiles = findJSFiles('.');
  
  console.log(`Found ${jsFiles.length} JavaScript files to process:\n`);
  
  // eslint-disable-next-line no-restricted-syntax
  for (const file of jsFiles) {
    const savings = minifyFile(file);
    totalSavings += savings;
    // eslint-disable-next-line no-plusplus
    if (savings > 0) filesProcessed++;
  }
  
  const duration = Date.now() - startTime;
  
  console.log(`\n📊 Minification complete:`);
  console.log(`   • Files processed: ${filesProcessed}/${jsFiles.length}`);
  console.log(`   • Total savings: ${totalSavings} bytes (${(totalSavings / 1024).toFixed(2)} KB)`);
  console.log(`   • Duration: ${duration}ms`);
  
  if (totalSavings > 0) {
    console.log(`\n✅ JavaScript minification successful!`);
    console.log(`💡 Tip: Run "git checkout -- scripts/ blocks/" to restore original files if needed`);
  } else {
    console.log(`\nℹ️  No significant minification opportunities found.`);
  }
}

module.exports = { minifyJS, minifyFile };