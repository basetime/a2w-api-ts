import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { unwatchFile, watchFile } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(scriptDir, '..');
const docsDir = path.join(repoDir, 'docs');
const debounceMs = 200;
const pollIntervalMs = 500;
const rescanIntervalMs = 5000;

/** Individual files that trigger rebuilds when changed. */
const watchFiles = [
  path.join(repoDir, 'scripts/build-docs-nav.mjs'),
  path.join(repoDir, 'scripts/docs-nav.config.mjs'),
  path.join(repoDir, 'scripts/docs-slugger.mjs'),
  path.join(repoDir, 'scripts/docs-link-rewriter.mjs'),
  path.join(repoDir, 'scripts/docs-site.config.mjs'),
  path.join(repoDir, 'scripts/assert-docs-slugs.mjs'),
];

let debounceTimer = null;
let buildChain = Promise.resolve();
let watchedPaths = new Set();
let isBuilding = false;
let rescanTimer = null;

/**
 * Runs the docs nav generator and slug assertion scripts.
 *
 * @returns {Promise<void>}
 */
const runBuild = () => {
  if (isBuilding) {
    return buildChain;
  }

  isBuilding = true;
  buildChain = buildChain.then(
    () =>
      new Promise((resolve, reject) => {
        console.log('[docs:watch] rebuilding nav...');

        const nav = spawn('node', [path.join(scriptDir, 'build-docs-nav.mjs')], {
          cwd: repoDir,
          stdio: 'inherit',
        });

        nav.on('error', reject);
        nav.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`build-docs-nav.mjs exited with code ${code}`));
            return;
          }

          const slugs = spawn('node', [path.join(scriptDir, 'assert-docs-slugs.mjs')], {
            cwd: repoDir,
            stdio: 'inherit',
          });

          slugs.on('error', reject);
          slugs.on('close', (slugCode) => {
            if (slugCode !== 0) {
              reject(new Error(`assert-docs-slugs.mjs exited with code ${slugCode}`));
              return;
            }

            console.log('[docs:watch] nav updated');
            resolve();
          });
        });
      }),
  );

  buildChain = buildChain.finally(() => {
    isBuilding = false;
  });

  buildChain.catch((error) => {
    console.error(`[docs:watch] ${error.message}`);
  });

  return buildChain;
};

/**
 * Schedules a debounced nav rebuild.
 */
const scheduleBuild = () => {
  if (isBuilding) {
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void runBuild();
  }, debounceMs);
};

/**
 * Returns whether a markdown file should trigger nav rebuilds.
 *
 * @param {string} filePath Absolute path to a candidate file.
 * @returns {boolean}
 */
const isDocsMarkdownFile = (filePath) => {
  const relative = path.relative(docsDir, filePath).replace(/\\/g, '/');

  if (!relative || relative.startsWith('..')) {
    return false;
  }

  if (relative.includes('.vitepress/') || relative.startsWith('images/')) {
    return false;
  }

  return relative.endsWith('.md');
};

/**
 * Recursively collects markdown files under docs/.
 *
 * @param {string} dirPath Directory to scan.
 * @returns {Promise<string[]>} Absolute markdown file paths.
 */
const collectDocsMarkdownFiles = async (dirPath) => {
  let entries;

  try {
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === '.vitepress' || entry.name === 'images') {
        continue;
      }

      files.push(...(await collectDocsMarkdownFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && isDocsMarkdownFile(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
};

/**
 * Registers polling-based watchFile listeners for a path.
 *
 * @param {string} filePath Absolute file path.
 */
const watchPath = (filePath) => {
  if (watchedPaths.has(filePath)) {
    return;
  }

  watchedPaths.add(filePath);
  watchFile(filePath, { interval: pollIntervalMs, persistent: true }, (current, previous) => {
    if (current.mtimeMs === previous.mtimeMs) {
      return;
    }

    scheduleBuild();
  });
};

/**
 * Registers polling watchers for nav scripts and canonical docs pages.
 */
const startWatching = async () => {
  for (const filePath of watchFiles) {
    watchPath(filePath);
  }

  for (const filePath of await collectDocsMarkdownFiles(docsDir)) {
    watchPath(filePath);
  }

  rescanTimer = setInterval(() => {
    void collectDocsMarkdownFiles(docsDir).then((files) => {
      for (const filePath of files) {
        watchPath(filePath);
      }
    });
  }, rescanIntervalMs);
};

/**
 * Closes active watchers and clears pending rebuilds.
 */
const stopWatching = () => {
  clearTimeout(debounceTimer);
  clearInterval(rescanTimer);

  for (const filePath of watchedPaths) {
    unwatchFile(filePath);
  }

  watchedPaths.clear();
};

process.on('SIGINT', () => {
  stopWatching();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopWatching();
  process.exit(0);
});

await startWatching();
console.log('[docs:watch] watching doc sources for changes...');
