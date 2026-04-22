'use strict';

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health / root ───────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'LiteracyMap API', version: '1.0.0', status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'literacy-map-backend', ts: new Date().toISOString() });
});

// ── Students ────────────────────────────────────────────────
const students = [];

app.get('/api/students', (_req, res) => {
  res.json({ students });
});

app.post('/api/students', (req, res) => {
  const { name, grade, id } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const student = { id: id || Date.now().toString(), name, grade: grade || '', createdAt: new Date().toISOString() };
  students.push(student);
  res.status(201).json({ student });
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json({ student });
});

// ── Assessments ─────────────────────────────────────────────
const assessments = [];

app.get('/api/assessments', (_req, res) => {
  res.json({ assessments });
});

app.post('/api/assessments', (req, res) => {
  const { studentId, type, score, date, notes } = req.body;
  if (!studentId || score == null) return res.status(400).json({ error: 'studentId and score are required' });
  const assessment = { id: Date.now().toString(), studentId, type: type || 'general', score, date: date || new Date().toISOString(), notes: notes || '', createdAt: new Date().toISOString() };
  assessments.push(assessment);
  res.status(201).json({ assessment });
});

// ── Interventions ────────────────────────────────────────────
const interventions = [];

app.get('/api/interventions', (_req, res) => {
  res.json({ interventions });
});

app.post('/api/interventions', (req, res) => {
  const { studentId, type, description, startDate } = req.body;
  if (!studentId || !type) return res.status(400).json({ error: 'studentId and type are required' });
  const intervention = { id: Date.now().toString(), studentId, type, description: description || '', startDate: startDate || new Date().toISOString(), active: true, createdAt: new Date().toISOString() };
  interventions.push(intervention);
  res.status(201).json({ intervention });
});

// ── Analytics ────────────────────────────────────────────────
app.get('/api/analytics/summary', (_req, res) => {
  const total       = students.length;
  const avgScore    = assessments.length
    ? (assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length).toFixed(1)
    : null;
  const activeInterventions = interventions.filter(i => i.active).length;
  res.json({ totalStudents: total, averageScore: avgScore ? parseFloat(avgScore) : null, activeInterventions });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
