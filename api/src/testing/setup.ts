import * as path from 'node:path';

import 'reflect-metadata';

process.env.LIBNEST_APP_BASE_DIR = path.resolve(import.meta.dirname, '../..');
