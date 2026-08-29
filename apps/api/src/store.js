import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedEvents } from './seed.js';

const dataFile = join(dirname(fileURLToPath(import.meta.url)), '../data/events.json');

const inferEventType = event => {
  if (event.eventType) return event.eventType;
  const text = `${event.title} ${event.course}`.toLowerCase();
  if (text.includes('quiz')) return 'quiz';
  if (text.includes('assignment') || text.includes('submission') || text.includes('deadline')) return 'assignment';
  if (text.includes('viva') || text.includes('lab') || text.includes('practical')) return 'viva_lab';
  if (text.includes('cat') || text.includes('midterm') || text.includes('semester') || text.includes('exam')) return 'exam';
  return 'other';
};

async function readEvents() {
  try { const events = JSON.parse(await readFile(dataFile, 'utf8')); const migrated = events.map(event => ({ ...event, eventType: inferEventType(event) })); if (JSON.stringify(events) !== JSON.stringify(migrated)) await writeFile(dataFile, JSON.stringify(migrated, null, 2)); return migrated; }
  catch { await mkdir(dirname(dataFile), { recursive: true }); await writeFile(dataFile, JSON.stringify(seedEvents, null, 2)); return seedEvents; }
}
async function saveEvents(events) { await mkdir(dirname(dataFile), { recursive: true }); await writeFile(dataFile, JSON.stringify(events, null, 2)); }

export const store = { readEvents, saveEvents };
