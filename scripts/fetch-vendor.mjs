import { mkdir, writeFile } from 'node:fs/promises';
const url='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
const r=await fetch(url);if(!r.ok)throw new Error(`JSZip download failed: ${r.status}`);await mkdir('public/vendor',{recursive:true});await writeFile('public/vendor/jszip.min.js',await r.text());console.log('Vendored JSZip 3.10.1');
