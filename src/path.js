import { fileURLToPath } from 'url';
import { dirname } from 'path';
const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);
export default dir;