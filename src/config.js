import url from 'node:url';
import path from 'node:path';

const rootDir = url.fileURLToPath(new URL('../', import.meta.url));

const config = {
  rootDir,
  distDir: path.resolve(rootDir, 'dist'),
  modDir: path.resolve(rootDir, 'src/fetch'),
};

export default config;
