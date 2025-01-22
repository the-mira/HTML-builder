const fs = require('fs/promises');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);
        const stats = await fs.stat(filePath);

        const fileInfo = path.parse(file.name);
        const fileName = fileInfo.name;
        const fileExt = fileInfo.ext.slice(1);
        const fileSizeInKB = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSizeInKB}kb`);
      }
    }
  } catch (err) {
    console.error('Error reading the folder');
  }
})();
