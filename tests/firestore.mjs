import assert from 'node:assert/strict';

const host = process.env.FIRESTORE_EMULATOR_HOST;
assert.ok(/^127\.0\.0\.1:\d+$/.test(host), 'Run against the local emulator');
const root = 'http://' + host + '/v1/projects/demo-portfolio/databases/(default)/documents';
async function seed(id, approved) {
    const res = await fetch(root + '/testimonials/' + id, {
        method: 'PATCH', headers: {Authorization:'Bearer owner','Content-Type':'application/json'},
        body: JSON.stringify({fields:{approved:{booleanValue:approved}}})
    });
    assert.equal(res.status, 200);
}
await seed('pending', false);
await seed('public', true);
assert.equal((await fetch(root + '/testimonials/pending')).status, 403);
assert.equal((await fetch(root + '/testimonials/public')).status, 200);
assert.equal((await fetch(root + '/testimonials')).status, 403);
assert.equal((await fetch(root + '/contacts')).status, 403);
console.log('Approved review read allowed. Pending read, unrestricted list and contacts denied.');

