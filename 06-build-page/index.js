const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

async function buildPage() {
  try {
    await fs.mkdir(projectDist, { recursive: true });

    await buildHtml();

    await mergeStyles();

    await copyDirectory(assetsDir, outputAssets);

    console.log('Page built successfully!');
  } catch (err) {
    console.error('Error building page');
  }
}

async function buildHtml() {
  try {
    let template = await fs.readFile(templateFile, 'utf8');

    const tags = template.match(/{{\s*\w+\s*}}/g) || [];

    for (const tag of tags) {
      const componentName = tag.replace(/[{}]/g, '').trim();
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentPath, 'utf8');
        template = template.replace(new RegExp(tag, 'g'), componentContent);
      } catch (err) {
        console.warn(`Component ${componentName} not found`);
      }
    }

    await fs.writeFile(outputHtml, template, 'utf8');
    console.log('HTML built successfully!');
  } catch (err) {
    console.error('Error building HTML:', err);
  }
}

async function mergeStyles() {
  try {
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

    await fs.writeFile(outputCss, styles.join('\n'), 'utf8');
    console.log('CSS merged successfully!');
  } catch (err) {
    console.error('Error merging styles');
  }
}

async function copyDirectory(srcDir, destDir) {
  try {
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

    console.log(`Assets copied to ${destDir}`);
  } catch (err) {
    console.error('Error copying directory');
  }
}

buildPage();
