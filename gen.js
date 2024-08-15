const fs = require('fs');
const path = require('path');

// Extensiones de archivos de audio
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.aac', '.flac'];
const REPO_ROOT = '.'; // La raíz del repositorio es el directorio actual
const REPO_OWNER = 'GabrielgsdCIUwU'; // El propietario del repositorio
const REPO_NAME = 'soundboard'; // El nombre del repositorio
const BRANCH_NAME = 'main'; // El nombre de la rama

// Verifica si el archivo tiene una extensión de audio
function isAudioFile(fileName) {
  return AUDIO_EXTENSIONS.some(ext => fileName.endsWith(ext));
}

// Escanea el directorio recursivamente
function scanDir(dirPath) {
  let results = [];

  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      // Escanea recursivamente los subdirectorios
      results = results.concat(scanDir(fullPath));
    } else if (item.isFile() && isAudioFile(item.name)) {
      // Recolecta la información del archivo de audio
      const relativePath = path.relative(REPO_ROOT, fullPath).replace(/\\/g, '/'); // Asegura que las rutas sean compatibles con URL
      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH_NAME}/${relativePath}`;
      results.push({
        name: item.name,
        path: relativePath,
        rawUrl: rawUrl
      });
    }
  }

  return results;
}

// Función principal
function main() {
  const audioFiles = scanDir(REPO_ROOT);
  fs.writeFileSync('audio_files.json', JSON.stringify(audioFiles, null, 2), 'utf-8');
  console.log('Archivo JSON generado: audio_files.json');
}

main();
