import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { store } from './store.js';

const app = express();
app.use(cors());
app.use(express.json());
const validStatuses = new Set(['tentative', 'approved', 'final', 'unverified']);
const validEventTypes = new Set(['quiz', 'viva_lab', 'assignment', 'exam', 'project_review', 'other']);
const statusLabels = { tentative: 'Discussed with Faculty — Tentative', approved: 'Approved by Faculty', final: 'Finalized — No Changes', unverified: 'Student-reported — Unverified' };
const required = ['title', 'date', 'course', 'status'];
const actor = body => body.actor?.name ? body.actor : { name: 'Aman Reddy', credential: 'CS-A · 23CSE101' };
const validate = body => required.filter(key => !body[key] || (key === 'status' && !validStatuses.has(body[key])));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/events', async (_req, res) => res.json(await store.readEvents()));

app.post('/api/events', async (req, res) => {
  const missing = validate(req.body); if (missing.length) return res.status(400).json({ error: `Missing or invalid: ${missing.join(', ')}` });
  const now = new Date().toISOString(), by = actor(req.body);
  const event = { id: randomUUID(), title: req.body.title.trim(), eventType: validEventTypes.has(req.body.eventType) ? req.body.eventType : 'other', date: req.body.date, time: req.body.time || '', course: req.body.course.trim(), status: req.body.status, note: req.body.note?.trim() || '', creator: by, createdAt: now, updatedAt: now, history: [{ action: 'created', message: `Event added by ${by.name}`, at: now, by: by.name }] };
  const events = await store.readEvents(); events.push(event); await store.saveEvents(events); res.status(201).json(event);
});

app.patch('/api/events/:id', async (req, res) => {
  const events = await store.readEvents(), event = events.find(item => item.id === req.params.id); if (!event) return res.status(404).json({ error: 'Event not found' });
  const missing = validate({ ...event, ...req.body }); if (missing.length) return res.status(400).json({ error: `Missing or invalid: ${missing.join(', ')}` });
  const oldDate = event.date, oldStatus = event.status, now = new Date().toISOString(), by = actor(req.body);
  for (const key of ['title', 'date', 'time', 'course', 'status', 'note']) if (key in req.body) event[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
  if ('eventType' in req.body && validEventTypes.has(req.body.eventType)) event.eventType = req.body.eventType;
  let message = `Details updated by ${by.name}`, action = 'updated';
  if (oldDate !== event.date) { action = 'date_changed'; message = `Date changed from ${oldDate} to ${event.date} by ${by.name}`; }
  else if (oldStatus !== event.status) { action = 'status_changed'; message = `Status changed to ${statusLabels[event.status]} by ${by.name}`; }
  event.updatedAt = now; event.history.push({ action, message, at: now, by: by.name }); await store.saveEvents(events); res.json(event);
});

app.delete('/api/events/:id', async (req, res) => { const events = await store.readEvents(); const remaining = events.filter(item => item.id !== req.params.id); if (remaining.length === events.length) return res.status(404).json({ error: 'Event not found' }); await store.saveEvents(remaining); res.status(204).end(); });
app.listen(process.env.PORT || 4000, () => console.log('Calendera API at http://localhost:4000'));
