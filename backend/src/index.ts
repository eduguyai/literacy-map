const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok', service: 'literacy-map-backend' });
});

app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'ok', service: 'literacy-map-backend', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req: any, res: any) => {
  res.json({ message: 'LiteracyMap API is running!', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Visit http://localhost:${PORT}/health to test`);
});

