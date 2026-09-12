import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { getBackendConfig } from './backend-config.js';

const { swaggerUrl } = getBackendConfig();
const outputPath = path.resolve('./src/auth/requiresWrite.generated.ts');

async function fetchSwaggerJson(url) {
  return new Promise((resolve, reject) => {
    const client = new URL(url).protocol === 'https:' ? https : http;
    const request = client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch Swagger JSON. Status code: ${response.statusCode}`));
        response.resume();
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        try {
          const body = Buffer.concat(chunks).toString('utf8');
          const json = JSON.parse(body);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', (error) => reject(error));
  });
}

function collectRequiresWriteEntries(swagger) {
  const entries = new Set();
  const paths = swagger.paths ?? {};

  for (const [rawPath, methods] of Object.entries(paths)) {
    if (!methods || typeof methods !== 'object') continue;

    for (const [method, operation] of Object.entries(methods)) {
      const operationObject = operation ?? {};
      if (operationObject['x-requires-youtube-write'] === true) {
        const key = `${method.toUpperCase()} ${rawPath}`;
        entries.add(key);
      }
    }
  }

  return Array.from(entries).sort();
}

async function ensureDirectoryExists(filePath) {
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
}

async function writeOutputFile(entries) {
  const lines = [];
  lines.push('// AUTO-GENERATED. Do not edit.');
  lines.push('// Format: Set of "METHOD /path"');
  lines.push('export const requiresWrite = new Set<string>([');

  for (const entry of entries) {
    lines.push(`  '${entry}',`);
  }

  lines.push(']);');
  lines.push('');

  await ensureDirectoryExists(outputPath);
  await fs.writeFile(outputPath, lines.join('\n'), { encoding: 'utf8' });
}

async function main() {
  try {
    const swagger = await fetchSwaggerJson(swaggerUrl);
    const entries = collectRequiresWriteEntries(swagger);
    await writeOutputFile(entries);
    // eslint-disable-next-line no-console
    console.log(`Generated ${entries.length} write-protected endpoint entries to ${outputPath}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate requiresWrite map:', error);
    process.exitCode = 1;
  }
}

await main();
