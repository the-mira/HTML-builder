const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(destDir, { recursive: true });

    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    const destEntries = await fs.readdir(destDir, { withFileTypes: true });
    for (const entry of destEntries) {
      const destEntryPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        await fs.rm(destEntryPath, { recursive: true, force: true });
      } else {
        await fs.unlink(destEntryPath);
      }
    }

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error copying directory');
  }
}

async function copyDirectory(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });

  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

copyDir();
