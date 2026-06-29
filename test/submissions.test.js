const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const backendPath = path.join(__dirname, '..', 'index.js');
const tempFile = path.join(os.tmpdir(), `submissions-${Date.now()}.json`);

const waitForServer = async (url) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // wait and retry
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('Server did not start');
};

test('GET /submissions returns stored people and POST saves a new registration', async () => {
  const child = spawn(process.execPath, [backendPath], {
    env: {
      ...process.env,
      PORT: '3101',
      SUBMISSIONS_FILE: tempFile,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    await waitForServer('http://127.0.0.1:3101/health');

    const initialResponse = await fetch('http://127.0.0.1:3101/submissions');
    assert.equal(initialResponse.status, 200);
    assert.deepEqual(await initialResponse.json(), []);

    const postResponse = await fetch('http://127.0.0.1:3101/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '0200000000',
        ministry: 'Youth',
        role: 'member',
        agree: true,
      }),
    });

    assert.equal(postResponse.status, 201);
    const saved = await postResponse.json();
    assert.equal(saved.name, 'Jane Doe');

    const finalResponse = await fetch('http://127.0.0.1:3101/submissions');
    const data = await finalResponse.json();
    assert.equal(data.length, 1);
    assert.equal(data[0].name, 'Jane Doe');
    assert.ok(fs.existsSync(tempFile));
  } finally {
    child.kill('SIGTERM');
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});
