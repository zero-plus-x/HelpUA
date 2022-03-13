import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const port = 3000;

const app = express();
app.use(express.json());

app.post('/register', (req, res) => {
  console.log('backend req', req);
  console.log('backend body', req.body);
  res.json(req.body);
});

app.get('/test', async (_, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.get('/ping', (_, res) => {
  res.end('pong');
});

app.listen(port, () => {
  console.log(`>> Backend ready at http://localhost:${port}`);
});

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
