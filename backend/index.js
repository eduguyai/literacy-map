'use strict';
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ── In-memory store ─────────────────────────────────────────
const store = { students: [], assessments: [], interventions: [] };
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ── Health ────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'literacy-map' }));

// ── Students ──────────────────────────────────────────────────
app.get('/api/students', (_, res) => res.json(store.students));

app.post('/api/students', (req, res) => {
  const s = { id: uid(), createdAt: new Date().toISOString(), ...req.body };
  store.students.push(s);
  res.status(201).json(s);
});

app.get('/api/students/:id', (req, res) => {
  const s = store.students.find(s => s.id === req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

app.put('/api/students/:id', (req, res) => {
  const i = store.students.findIndex(s => s.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Not found' });
  store.students[i] = { ...store.students[i], ...req.body, id: req.params.id };
  res.json(store.students[i]);
});

app.delete('/api/students/:id', (req, res) => {
  store.students = store.students.filter(s => s.id !== req.params.id);
  res.json({ ok: true });
});

// ── Assessments ───────────────────────────────────────────────
app.get('/api/assessments', (_, res) => res.json(store.assessments));

app.get('/api/assessments/student/:studentId', (req, res) =>
  res.json(store.assessments.filter(a => a.studentId === req.params.studentId)));

app.post('/api/assessments', (req, res) => {
  const a = { id: uid(), createdAt: new Date().toISOString(), ...req.body };
  store.assessments.push(a);
  res.status(201).json(a);
});

app.delete('/api/assessments/:id', (req, res) => {
  store.assessments = store.assessments.filter(a => a.id !== req.params.id);
  res.json({ ok: true });
});

// ── Interventions ─────────────────────────────────────────────
app.get('/api/interventions', (_, res) => res.json(store.interventions));

app.get('/api/interventions/student/:studentId', (req, res) =>
  res.json(store.interventions.filter(i => i.studentId === req.params.studentId)));

app.post('/api/interventions', (req, res) => {
  const inv = { id: uid(), active: true, createdAt: new Date().toISOString(), ...req.body };
  store.interventions.push(inv);
  res.status(201).json(inv);
});

app.put('/api/interventions/:id', (req, res) => {
  const i = store.interventions.findIndex(inv => inv.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Not found' });
  store.interventions[i] = { ...store.interventions[i], ...req.body, id: req.params.id };
  res.json(store.interventions[i]);
});

// ── Bulk import ───────────────────────────────────────────────
app.post('/api/import/students', (req, res) => {
  const rows = req.body.students || [];
  const created = rows.map(row => {
    const s = { id: uid(), createdAt: new Date().toISOString(), ...row };
    store.students.push(s);
    return s;
  });
  res.status(201).json({ imported: created.length, students: created });
});

// ── Analytics ─────────────────────────────────────────────────
app.get('/api/analytics/summary', (_, res) => {
  const byTier = { 1: 0, 2: 0, 3: 0 };
  store.students.forEach(s => { byTier[s.tier] = (byTier[s.tier] || 0) + 1; });
  res.json({
    totalStudents: store.students.length,
    byTier,
    activeInterventions: store.interventions.filter(i => i.active !== false).length,
  });
});

// ── SPA fallback ──────────────────────────────────────────────
app.get('*', (_, res) =>
  res.sendFile(path.join(__dirname, '../public/index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
