import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { confirmationRepository } from '../db/repository.mjs';
import { authorized, validateGuest } from '../lib/rsvp.mjs';
import { csvCell } from '../lib/csv.mjs';

test('Postgres preserves confirmations on setup and repeated submissions', async () => {
  const db = new PGlite();
  try {
    const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
    await db.exec(schema);
    const guests = confirmationRepository(async (text, values) => (await db.query(text, values)).rows);
    const first = { id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee', name: "Ana D'Ávila" };
    await guests.save(first);
    const original = (await guests.list())[0];
    await db.exec(schema);
    await guests.save({ ...first, name: 'Ana Maria D’Ávila' });
    const rows = await guests.list();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, 'Ana Maria D’Ávila');
    assert.equal(rows[0].createdAt, original.createdAt);
    await guests.save({ id: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee', name: "Maria'); DROP TABLE confirmations; --" });
    assert.equal((await guests.list()).length, 2);
  } finally { await db.close(); }
});

test('guest input rejects malformed payloads and normalizes spaces', () => {
  const key = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
  assert.deepEqual(validateGuest({ key, name: '  Ana   Maria  ' }), { id: key, name: 'Ana Maria' });
  for (const body of [null, [], { key, name: 'A' }, { key, name: 'a'.repeat(101) }, { key: 'bad', name: 'Maria' }, { key, name: 'Maria\u0000' }]) {
    assert.equal(validateGuest(body), null);
  }
});

test('list requires the configured password and CSV neutralizes formulas', () => {
  const password = 'senha-longa-de-teste';
  assert.equal(authorized(`Bearer ${password}`, password), true);
  assert.equal(authorized('Bearer errada', password), false);
  assert.equal(authorized(null, password), false);
  assert.equal(authorized('Bearer curta', 'curta'), false);
  assert.equal(authorized('Bearer undefined', undefined), false);
  assert.equal(csvCell('  =HYPERLINK("bad")'), '"\'  =HYPERLINK(""bad"")"');
  assert.equal(csvCell('Ana "Maria"'), '"Ana ""Maria"""');
});
