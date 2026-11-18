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


// Emulator-only identity for the same Google account as the document ID.
const identity = 'review-author';
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const token = encode({alg:'none',typ:'JWT'}) + '.' + encode({
    sub:identity, user_id:identity, aud:'demo-portfolio',
    iss:'https://securetoken.google.com/demo-portfolio', iat:now, exp:now+3600,
    firebase:{sign_in_provider:'google.com',identities:{}}
}) + '.';
async function submit(approved, rating, message) {
    const fields = {
        uid:{stringValue:identity},name:{stringValue:'Test reviewer'},
        message:{stringValue:message},rating:{integerValue:rating},
        approved:{booleanValue:approved},photo:{stringValue:''}
    };
    const write = {
        update:{name:'projects/demo-portfolio/databases/(default)/documents/testimonials/' + identity,fields},
        updateTransforms:[{fieldPath:'date',setToServerValue:'REQUEST_TIME'}]
    };
    return fetch(root+':commit',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({writes:[write]})});
}
assert.equal((await submit(true,5,'Review')).status,403);
assert.equal((await submit(false,6,'Review')).status,403);
assert.equal((await submit(false,5,'')).status,403);
assert.equal((await submit(false,5,'Review')).status,200);
assert.equal((await fetch(root+'/testimonials/'+identity)).status,403);
assert.equal((await submit(false,4,'Edited')).status,403);
console.log('Authenticated submission, field validation and moderation checks passed.');
