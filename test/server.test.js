import test from 'node:test';
import assert from 'node:assert/strict';

process.env.OPENAI_API_KEY = 'test-key';
process.env.READER_PASSWORD = 'test-pass';

const { app } = await import('../server.js');

let server;
test.before(async () => { server = app.listen(0); await new Promise(r => server.once('listening', r)); });
test.after(() => server?.close());

const url = path => `http://127.0.0.1:${server.address().port}${path}`;

test('health endpoint is healthy', async () => {
  const r = await fetch(url('/api/health'));
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.ok, true);
});

test('translation endpoint requires password', async () => {
  const r = await fetch(url('/api/translate'), {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({text:'Ciao'})});
  assert.equal(r.status, 401);
});

test('translation endpoint rejects empty text', async () => {
  const r = await fetch(url('/api/translate'), {method:'POST', headers:{'content-type':'application/json','x-reader-password':'test-pass'}, body:JSON.stringify({text:''})});
  assert.equal(r.status, 400);
});
