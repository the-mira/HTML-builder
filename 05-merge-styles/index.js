const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const outputDir = path.join(__dirname, 'project-dist');
  const bundleFile = path.join(outputDir, 'bundle.css');

  try {
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    const styles = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesDir, file.name);
        return await fs.readFile(filePath, 'utf8');
      }),
    );

    await fs.writeFile(bundleFile, styles.join('\n'), 'utf8');
    console.log('Styles merged');
  } catch (err) {
    console.error('Error merging styles');
  }
}

mergeStyles();
