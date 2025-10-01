import esbuild from 'esbuild';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const isWatch = process.argv.includes('--watch');

async function getAllJsxFiles(dir) {
  const jsxFiles = [];

  async function scan(directory) {
    try {
      const entries = await readdir(directory);

      for (const entry of entries) {
        const fullPath = join(directory, entry);
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          await scan(fullPath);
        } else if (entry.endsWith('.jsx') && !entry.endsWith('.test.jsx')) {
          jsxFiles.push(fullPath);
        }
      }
    } catch (err) {
      // Directory might not exist yet
    }
  }

  await scan(dir);
  return jsxFiles;
}

async function buildReactBlocks() {
  const blocksDir = './blocks';

  try {
    const jsxFiles = await getAllJsxFiles(blocksDir);

    if (jsxFiles.length === 0) {
      console.log('⚠️  No .jsx files found in blocks/');
      console.log('   Create .jsx files to get started with React components.');
      return;
    }

    console.log(`\n🔨 Building ${jsxFiles.length} React component(s)...\n`);

    const buildConfigs = jsxFiles.map((jsxFile) => ({
      entryPoints: [jsxFile],
      bundle: true,
      outfile: jsxFile.replace('.jsx', '.js'),
      format: 'esm',
      jsx: 'automatic',
      jsxDev: isWatch,
      loader: { '.jsx': 'jsx' },
      minify: !isWatch,
      sourcemap: isWatch ? 'inline' : false,
      target: 'es2020',
      logLevel: 'error',
    }));

    if (isWatch) {
      // Watch mode - create contexts for all files
      const contexts = await Promise.all(
        buildConfigs.map((config) => esbuild.context(config)),
      );

      await Promise.all(contexts.map((ctx) => ctx.watch()));

      jsxFiles.forEach((file) => {
        console.log(`👀 Watching: ${file}`);
      });

      console.log('\n✨ Watching for changes... (Press Ctrl+C to stop)\n');

      // Keep the process running
      await new Promise(() => {});
    } else {
      // One-time build
      await Promise.all(buildConfigs.map((config) => esbuild.build(config)));

      jsxFiles.forEach((file) => {
        console.log(`✓ Built: ${file} → ${file.replace('.jsx', '.js')}`);
      });

      console.log('\n React build complete!\n');
    }
  } catch (err) {
    console.error(' Build error:', err);
    process.exit(1);
  }
}

buildReactBlocks();
