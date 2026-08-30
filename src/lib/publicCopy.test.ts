import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
const legalPages = readFileSync(new URL('../LegalPages.tsx', import.meta.url), 'utf8');
const rules = readFileSync(new URL('../config/parentalLeaveRules.ts', import.meta.url), 'utf8');

test('public UI includes guidance, print and non-affiliation wording', () => {
  assert.match(app, /This calculator is an estimate/);
  assert.match(app, /How accurate is this calculator/);
  assert.match(app, /Official sources/);
  assert.match(app, /Planning estimate only — not legal advice/);
  assert.match(app, /not affiliated with or endorsed by the Fair Work Ombudsman/);
  assert.match(app, /Your calculation stays in your browser/);
  assert.doesNotMatch(app, /official Fair Work calculator/i);
  assert.doesNotMatch(app, /your request is valid/i);
  assert.doesNotMatch(app, /your employer must approve/i);
  assert.match(app, /const \[dob, setDob\] = useState\(''\)/);
  assert.match(app, /const \[returnDate, setReturnDate\] = useState\(''\)/);
});

test('terms, privacy and rule-verification content are present', () => {
  assert.match(legalPages, /Australian Consumer Law savings clause/);
  assert.match(legalPages, /Calculator inputs stay on your device/);
  assert.match(rules, /rulesLastVerified/);
});
