import fetch from 'node-fetch';

const BASE_URL = 'https://epify-gf25.onrender.com';
// const BASE_URL = 'http://localhost:3000';

const randomId = Math.random().toString(36).substring(2, 7);

const user1 = `user1_${randomId}@test.com`;
const user2 = `user2_${randomId}@test.com`;

console.log(` Generated Test Users: \n  👤 ${user1} \n  👤 ${user2}\n`);

let token1 = '';
let token2 = '';
let noteId = '';
let passed = 0;
let failed = 0;

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

const api = async (method, path, body = null, token = null) => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
};

const check = (name, condition, response = {}) => {
    if (condition) {
        console.log(`  ✅ ${name}`);
        passed++;
    } else {
        console.log(`  ❌ ${name}`);
        console.log(`     Got:`, JSON.stringify(response, null, 2));
        failed++;
    }
};

const section = (name) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  📂 ${name}`);
    console.log(`${'='.repeat(60)}`);
};

// ─────────────────────────────────────────
// Test Runner
// ─────────────────────────────────────────

const runTests = async () => {
    let r;

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  🚀 Epify API Test Suite`);
    console.log(`  URL: ${BASE_URL}`);
    console.log(`${'═'.repeat(60)}`);

    // ── HEALTH ───────────────────────────────────────────────
    section('HEALTH');

    r = await api('GET', '/health');
    check('Health endpoint', r.status === 200, r);

    // ── REGISTER ─────────────────────────────────────────────
    section('REGISTER');

    r = await api('POST', '/register', {});
    check('Missing fields → 400', r.status === 400, r);

    r = await api('POST', '/register', { email: 'bademail', password: 'Password@123' });
    check('Invalid email → 400', r.status === 400, r);

    r = await api('POST', '/register', { email: user1, password: 'Password@123' });
    check('Register user1 → 201', [200, 201].includes(r.status), r);

    r = await api('POST', '/register', { email: user2, password: 'Password@123' });
    check('Register user2 → 201', [200, 201].includes(r.status), r);

    // ── LOGIN ────────────────────────────────────────────────
    section('LOGIN');

    r = await api('POST', '/login', { email: user1, password: 'wrong' });
    check('Wrong password → 401', r.status === 401, r);

    r = await api('POST', '/login', { email: user1, password: 'Password@123' });
    token1 = r.data.access_token || r.data.token;
    check('Login user1 → 200', r.status === 200 && !!token1, r);

    r = await api('POST', '/login', { email: user2, password: 'Password@123' });
    token2 = r.data.access_token || r.data.token;
    check('Login user2 → 200', r.status === 200 && !!token2, r);

    // ── CREATE NOTE ──────────────────────────────────────────
    section('CREATE NOTE');

    r = await api('POST', '/notes', { title: 'My First Note', content: 'Testing content' }, token1);
    noteId = r.data.id || r.data._id || r.data.note?._id || r.data.note?.id;
    check('Create note → 201', [200, 201].includes(r.status) && !!noteId, r);

    // ── GET NOTES ────────────────────────────────────────────
    section('GET NOTES');

    r = await api('GET', '/notes', null, token1);
    check('Get notes → 200', r.status === 200, r);

    // ── GET NOTE ─────────────────────────────────────────────
    section('GET NOTE');

    r = await api('GET', `/notes/${noteId}`, null, token1);
    check('Get by id → 200', r.status === 200, r);

    // ── UPDATE ───────────────────────────────────────────────
    section('UPDATE');

    r = await api('PUT', `/notes/${noteId}`, { title: 'Updated Title', content: 'Updated Content' }, token1);
    check('Update note → 200', r.status === 200, r);

    // ── SHARE ────────────────────────────────────────────────
    section('SHARE');

    r = await api('POST', `/notes/${noteId}/share`, { share_with_email: user2 }, token1);
    check('Share note → 200', r.status === 200, r);

    // ── SHARED ACCESS ────────────────────────────────────────
    section('SHARED ACCESS');

    r = await api('GET', `/notes/${noteId}`, null, token2);
    check('Shared user access → 200', r.status === 200, r);

    // ── SEARCH ───────────────────────────────────────────────
    section('SEARCH');

    r = await api('GET', '/search?q=Updated', null, token1);
    check('Search works → 200 or 404', [200, 404].includes(r.status), r);

    // ── DELETE ───────────────────────────────────────────────
    section('DELETE');

    r = await api('DELETE', `/notes/${noteId}`, null, token1);
    check('Delete note → 204', [200, 204].includes(r.status), r);

    // ── ABOUT ────────────────────────────────────────────────
    section('ABOUT');

    r = await api('GET', '/about');
    check('About endpoint → 200', r.status === 200, r);

    // ── OPENAPI ──────────────────────────────────────────────
    section('OPENAPI');

    r = await api('GET', '/openapi.json');
    check('OpenAPI endpoint → 200', r.status === 200, r);

    // ── RATE LIMIT ───────────────────────────────────────────
    section('RATE LIMIT');

    let hit = false;
    for (let i = 1; i <= 25; i++) {
        const response = await api('POST', '/login', {
            email: `fake${i}@test.com`,
            password: 'wrongpassword',
        });
        console.log(`  Request ${i}: ${response.status}`);
        if (response.status === 429) {
            hit = true;
            console.log(`  Rate limit hit at request ${i}`);
            break;
        }
    }
    check('Rate limiting → 429', hit);

    // ── SUMMARY ──────────────────────────────────────────────
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  Passed : ${passed}`);
    console.log(`  Failed : ${failed}`);
    console.log(`  Total  : ${passed + failed}`);
    console.log(`${'='.repeat(60)}`);

    // ── REMINDERS ────────────────────────────────────────────
    section('REMINDERS');

    r = await api('POST', '/notes', { title: 'Reminder Note', content: 'Do not forget this.' }, token1);
    const reminderNoteId = r.data.id || r.data._id;

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: '2099-01-01T10:00:00Z' });
    check('No auth → 401', r.status === 401, r);

    r = await api('PATCH', '/notes/badid/reminder', { remind_at: '2099-01-01T10:00:00Z' }, token1);
    check('Invalid ID → 400', r.status === 400, r);

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, {}, token1);
    check('Missing remind_at → 400', r.status === 400, r);

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: 'not-a-date' }, token1);
    check('Invalid date → 400', r.status === 400, r);

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: '2020-01-01T10:00:00Z' }, token1);
    check('Past date → 400', r.status === 400, r);

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: '2099-01-01T10:00:00Z' }, token2);
    check('Wrong user → 404', r.status === 404, r);

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: new Date(Date.now() + 15000).toISOString() }, token1);
    check('Set reminder → 200', r.status === 200, r);
    check('Response has remind_at', !!r.data.remind_at, r.data);

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: new Date(Date.now() + 20000).toISOString() }, token1);
    check('Update reminder → 200', r.status === 200, r);

    r = await api('DELETE', `/notes/${reminderNoteId}/reminder`);
    check('Delete reminder no auth → 401', r.status === 401, r);

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: '2099-06-01T10:00:00Z' }, token1);

    r = await api('DELETE', `/notes/${reminderNoteId}/reminder`, null, token1);
    check('Delete reminder → 200', r.status === 200, r);

    r = await api('DELETE', `/notes/${reminderNoteId}/reminder`, null, token1);
    check('Delete with no reminder → 400', r.status === 400, r);

    console.log('\n  ⏳ Setting reminder 5 seconds from now — waiting 70s for cron to fire...');

    r = await api('PATCH', `/notes/${reminderNoteId}/reminder`, { remind_at: new Date(Date.now() + 5000).toISOString() }, token1);
    check('Set reminder for cron test → 200', r.status === 200, r);

    await new Promise((resolve) => setTimeout(resolve, 70000));

    r = await api('GET', `/notes/${reminderNoteId}`, null, token1);
    check('After cron: remind_at cleared', r.data.remind_at === null || r.data.remind_at === undefined, r.data);

    await api('DELETE', `/notes/${reminderNoteId}`, null, token1);
};

runTests().catch(console.error);